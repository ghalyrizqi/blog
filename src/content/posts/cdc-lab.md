---
slug: cdc-lab
title: "Change Data Capture, End to End: Postgres, Debezium, Redpanda, dlt, ClickHouse"
excerpt: "A CDC pipeline built from scratch: Postgres's WAL through Debezium into Redpanda, synced into ClickHouse with dlt, plus every gotcha that showed up along the way — base64 decimals, Kafka tombstones, and an off-by-one bug in dlt's own scaffolded source code."
date: 2026-08-08
tags: [CDC, Debezium, Kafka, ClickHouse]
---

Most pipelines I've built move data by re-querying a source table on a schedule: grab everything with `updated_at > last_run`, load it, repeat. That works until it doesn't. It misses deletes entirely (a row that vanished never shows up in a `WHERE updated_at > X` scan), it hammers the source with `SELECT`s it doesn't need, and "near real-time" really means "as fresh as your cron interval." Change Data Capture works the other way: instead of asking the database what changed, you tap the database's own internal change log and turn every insert, update, and delete into a discrete event, in order, as it happens. For Postgres that log is the Write-Ahead Log (WAL), and it's already there, already ordered, already complete. CDC just reads it.

I wanted to build one instead of just reading about it, so here's a small stack, run for real: **Postgres → Debezium → Redpanda → dlt → ClickHouse**. Every command below ran against it on a small VM, and every screenshot is that stack's state at that exact point.

| Layer | Tool | Role |
|---|---|---|
| Source | PostgreSQL 16 | System of record — an `orders` table with logical replication enabled |
| Capture | Debezium (Postgres connector) | Reads the WAL via `pgoutput`, emits a JSON event per row change |
| Broker | Redpanda | Kafka-API-compatible log that durably holds the CDC event stream |
| Broker UI | Redpanda Console | Browser UI to inspect topics and messages |
| Runner | Kafka Connect (`debezium/connect:2.4`) | The JVM worker that runs the Debezium connector |
| Sync | dlt (`kafka` source → `clickhouse` destination) | Consumes the topic, parses Debezium's envelope, upserts into ClickHouse |
| Warehouse | ClickHouse | Destination analytical table |

The flow is linear: Postgres emits WAL records → Debezium decodes them into JSON via `pgoutput` → those events land on a Redpanda topic (`cdc.public.orders`) → a dlt pipeline consumes that topic and merges the rows into ClickHouse, with a `hard_delete` hint turning Postgres deletes into real ClickHouse deletes rather than a soft flag.

A couple of these choices need explaining before the walkthrough:

- I used Redpanda instead of Kafka plus Zookeeper. It speaks the Kafka wire protocol, so an unmodified Kafka Connect worker (and therefore Debezium, `rpk`, and any other Kafka client) works against it unchanged. It ships as one binary with a `dev-container` mode built for small local/CI environments, no separate Zookeeper process, which mattered on a 3.6GB RAM VM.
- Postgres runs as vanilla `postgres:16`, not the `debezium/postgres` convenience image, with `wal_level=logical` set explicitly as a compose flag. The convenience image does the same thing internally, but hiding it defeats the point of a learning project: the flag that makes CDC possible should be visible, not baked in.
- `orders` gets `REPLICA IDENTITY FULL`. Postgres's default replica identity only logs the primary key on deletes and changed columns on updates. `FULL` logs the entire old row every time, which is what makes full before/after payloads and hard deletes possible downstream.
- dlt runs on the host via `uv run`, not in a container. Simpler to iterate on, and a normal local Python workflow.
- The `merge` write disposition plus `hard_delete` and `dedup_sort` hints on the dlt side is the documented, supported way to turn a CDC stream into correct upserts and deletes, not something bespoke to this project.

## Prerequisites, and the parts that tripped me up

Docker, Compose, and `librdkafka-dev` (a native dependency of `confluent-kafka`, which dlt's `kafka` source needs):

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 librdkafka-dev
sudo usermod -aG docker $USER
```

Two things went wrong for me here, and both cost real time before I tracked them down.

`sudo` needs a real TTY. Run install commands through anything that isn't your own interactive terminal (an agent session, a relay, anything without a real pty attached) and `sudo` fails with `sudo: a terminal is required to authenticate`, even though the command looks like it's running in your shell.

Group membership doesn't apply retroactively, either. `usermod -aG docker $USER` doesn't add the group to your *already-running* session; group membership gets computed at login. Either log out and back in, or grab a subshell that recomputes it on the spot:

```bash
sg docker -c "docker ps"
```

I used `sg docker -c "..."` for every docker/compose command in this build for exactly that reason.

For Python, I wanted `uv` to own the interpreter entirely rather than fighting the system one. Debian/Ubuntu's system Python is PEP 668 "externally managed," so a plain `pip install --system` fails, and even `--break-system-packages` then fails on a permission error because `dist-packages` is root-owned. The fix is to have `uv` provision its own interpreter and target that instead:

```bash
uv python install 3.13
uv pip install --system --break-system-packages --python 3.13 \
  "dlt[clickhouse]" confluent-kafka "psycopg[binary]" playwright
```

That `uv`-managed `python3.13` is fully user-owned, so "system-wide" installs into it need no venv and no root. `--break-system-packages` is still required because `uv` applies its own version of the same guard, but it's harmless here since this interpreter isn't a shared OS Python.

Playwright (used later for the screenshot automation) bundles Chromium itself, but Chromium still needs OS shared libraries most minimal server images don't ship:

```bash
sudo $HOME/.local/share/uv/python/cpython-3.13-linux-x86_64-gnu/bin/python3.13 \
  -m playwright install-deps chromium
```

Running that as `sudo python3.13 -m playwright ...` fails with `command not found`, even though `python3.13` works fine outside `sudo`. That's because `sudo` uses its own `secure_path` by default, not your shell's `PATH`, so it can't see anything under `~/.local/bin`. Passing the interpreter's full real path sidesteps it.

## The stack: `docker-compose.yml`

Five services, each with an explicit `mem_limit` to fit a 3.6GB box:

```yaml
name: cdc-lab

services:
  postgres:
    image: postgres:16
    command:
      - postgres
      - -c
      - wal_level=logical      # required: Debezium reads the logical replication stream
      - -c
      - max_wal_senders=10
      - -c
      - max_replication_slots=10
    environment:
      POSTGRES_USER: cdc_user
      POSTGRES_PASSWORD: cdc_pass
      POSTGRES_DB: cdc_lab
    volumes:
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    mem_limit: 300m

  redpanda:
    image: docker.redpanda.com/redpandadata/redpanda:${REDPANDA_VERSION:-latest}
    command:
      - redpanda start
      - --mode dev-container
      - --smp 1
      - --memory 700M
      - --kafka-addr internal://0.0.0.0:9092,external://0.0.0.0:19092
      - --advertise-kafka-addr internal://redpanda:9092,external://localhost:19092
    mem_limit: 800m

  redpanda-console:
    image: docker.redpanda.com/redpandadata/console:latest
    environment:
      KAFKA_BROKERS: redpanda:9092
    ports: ["8080:8080"]
    mem_limit: 250m

  debezium:
    image: debezium/connect:2.4
    environment:
      BOOTSTRAP_SERVERS: redpanda:9092
      GROUP_ID: cdc-connect-cluster
      KAFKA_HEAP_OPTS: "-Xms256m -Xmx512m"   # keep the JVM small on a 3.6GB box
    ports: ["8083:8083"]
    mem_limit: 900m

  clickhouse:
    image: clickhouse/clickhouse-server:latest
    environment:
      CLICKHOUSE_DB: cdc_lab
      CLICKHOUSE_PASSWORD: cdc_pass
    ports: ["8123:8123", "9000:9000"]
    mem_limit: 1200m
```

(Trimmed for readability; the full file also sets healthchecks, `depends_on: condition: service_healthy` chains, and Redpanda's proxy/schema-registry ports.)

`postgres/init.sql` runs automatically on first container start and does the CDC setup: creates `orders`, flips it to `REPLICA IDENTITY FULL`, seeds five rows, and creates the publication Debezium will subscribe to.

```sql
CREATE TABLE IF NOT EXISTS orders (
    id             SERIAL PRIMARY KEY,
    customer_name  TEXT NOT NULL,
    product        TEXT NOT NULL,
    quantity       INTEGER NOT NULL,
    unit_price     NUMERIC(10, 2) NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders REPLICA IDENTITY FULL;

INSERT INTO orders (customer_name, product, quantity, unit_price) VALUES
    ('Alice Tan',      'Mechanical Keyboard', 1,  89.99),
    ('Budi Santoso',   'USB-C Hub',           2,  24.50),
    ('Chen Wei',       '27" Monitor',         1, 219.00),
    ('Dewi Lestari',   'Wireless Mouse',      3,  15.75),
    ('Erik Johansson', 'Laptop Stand',        1,  34.00);

-- Debezium's Postgres connector uses logical replication, which requires a
-- PUBLICATION covering the tables it should capture. Created explicitly here
-- rather than relying on the connector's autocreate mode, so it's visible
-- and versioned as part of the schema.
CREATE PUBLICATION cdc_publication FOR TABLE orders;
```

```bash
cd ~/cdc-lab
sg docker -c "docker compose up -d"
```

Debezium took the longest to report healthy (JVM boot plus its own REST endpoint coming up); everything else was healthy within seconds:

```
$ sg docker -c "docker compose ps"
NAME                   IMAGE                                               STATUS
cdc-clickhouse         clickhouse/clickhouse-server:latest                 Up (healthy)
cdc-debezium           debezium/connect:2.4                                Up (healthy)
cdc-postgres           postgres:16                                         Up (healthy)
cdc-redpanda           docker.redpanda.com/redpandadata/redpanda:v26.2.1   Up (healthy)
cdc-redpanda-console   docker.redpanda.com/redpandadata/console:latest     Up
```

![Postgres seed data, five rows in the orders table](/images/cdc-lab/00-postgres-seed-data.png "Seed data, straight from Postgres: the baseline everything downstream gets compared against")

## Registering the Debezium connector

The Kafka Connect REST payload, `debezium/postgres-connector.json`:

```json
{
  "name": "postgres-orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "plugin.name": "pgoutput",

    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "cdc_user",
    "database.password": "cdc_pass",
    "database.dbname": "cdc_lab",

    "topic.prefix": "cdc",
    "table.include.list": "public.orders",

    "publication.name": "cdc_publication",
    "publication.autocreate.mode": "disabled",
    "slot.name": "cdc_orders_slot",
    "decimal.handling.mode": "string",

    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter.schemas.enable": "false"
  }
}
```

`plugin.name: pgoutput` is Postgres's built-in logical decoding plugin, so no extra Postgres extension is needed, unlike `wal2json` or `decoderbufs`. `publication.autocreate.mode: disabled` tells the connector to use the publication `init.sql` already created rather than manage its own. `topic.prefix` and `table.include.list` together determine the topic name: events land on `cdc.public.orders`.

```bash
curl -X POST -H "Content-Type: application/json" \
  --data @debezium/postgres-connector.json \
  http://localhost:8083/connectors
```

```bash
$ curl -s http://localhost:8083/connectors/postgres-orders-connector/status | python3 -m json.tool
{
    "name": "postgres-orders-connector",
    "connector": {"state": "RUNNING", "worker_id": "172.18.0.5:8083"},
    "tasks": [{"id": 0, "state": "RUNNING", "worker_id": "172.18.0.5:8083"}],
    "type": "source"
}
```

Consuming the first message shows the initial-snapshot event Debezium generates for each pre-existing row: `"op": "r"` for read/snapshot, versus `c`/`u`/`d` for insert/update/delete.

```bash
$ sg docker -c "docker compose exec -T redpanda rpk topic consume cdc.public.orders -n 1 -o start"
{
  "key": "{\"id\":1}",
  "value": "{\"before\":null,\"after\":{\"id\":1,\"customer_name\":\"Alice Tan\",...,\"unit_price\":\"89.99\",...},\"op\":\"r\",...}"
}
```

![Redpanda Console showing the CDC topic with five snapshot events](/images/cdc-lab/01-redpanda-console-topic.png "Redpanda Console, live — five initial-snapshot events, before is null on every one since these are reads, not updates")

NUMERIC columns arrive as base64 by default, and that one cost me some head-scratching. The first time I registered this connector without `decimal.handling.mode`, `unit_price` came through as `"Iyc="`: base64 for Kafka Connect's binary `Decimal` logical type. Debezium's default (`decimal.handling.mode: precise`) is technically the most faithful representation, but it's opaque without the Avro/Protobuf schema that would normally travel with it, and I'm intentionally running with schemas disabled to keep the JSON simple to parse downstream. `decimal.handling.mode: string` fixes it: plain decimal strings instead.

Kafka Connect also remembers offsets by connector name, even after you delete the connector. Fixing the decimal issue meant deleting and re-registering it. Deleting it via the REST API removes the *definition*, but Connect's internal `connect_offsets` topic still holds the last-committed LSN keyed by connector name. I'd also dropped and recreated the replication slot in the meantime, to force a clean re-snapshot, so the stale offset pointed earlier than the new slot's minimum, and the re-registered connector refused to start:

```
ERROR: cannot advance replication slot to 0/196BA78, minimum is 0/196BB10
```

The fix I used was blunt but effective for a learning setup: wipe Connect's three internal topics and restart the worker, so there's no stale offset to conflict with.

```bash
curl -X DELETE http://localhost:8083/connectors/postgres-orders-connector
sg docker -c "docker compose exec -T postgres psql -U cdc_user -d cdc_lab -c \"SELECT pg_drop_replication_slot('cdc_orders_slot');\""
sg docker -c "docker compose stop debezium"
sg docker -c "docker compose exec -T redpanda rpk topic delete connect_configs connect_offsets connect_statuses"
sg docker -c "docker compose start debezium"
```

In a real deployment you'd almost never want to nuke all connector state like this: pick a new connector name for a fresh start, or use Kafka Connect's offset-reset endpoints on newer Connect versions instead.

## dlt: from Kafka topic to ClickHouse table

dlt has a "verified sources" pattern: `dlt init <source> <destination>` scaffolds working source code *into your project* rather than hiding it behind a pip import, which you then customize.

```bash
uv init --python 3.13
dlt init kafka clickhouse
uv pip install --system --break-system-packages --python 3.13 -r requirements.txt
```

That generated `pipeline/kafka/` (the `kafka_consumer` resource and an `OffsetTracker` helper, dlt's own unmodified library code) plus an example pipeline I replaced with the CDC-specific one below.

`.dlt/secrets.toml`:

```toml
[sources.kafka.credentials]
bootstrap_servers = "localhost:19092"   # Redpanda's EXTERNAL listener — this pipeline runs on the host
group_id = "dlt_cdc_pipeline"
security_protocol = "PLAINTEXT"

[destination.clickhouse]
dataset_table_separator = "___"
table_engine_type = "merge_tree"

[destination.clickhouse.credentials]
database = "cdc_lab"
username = "default"
password = "cdc_pass"
host = "localhost"
port = 9000        # native TCP, used for the actual data load
http_port = 8123    # used for lighter management queries
secure = 0
```

And the pipeline itself, `cdc_pipeline.py`, is the core of the whole thing: turning a raw Debezium event stream into correct upserts and deletes in ClickHouse.

```python
import json
from typing import Any, Dict

import dlt
from confluent_kafka import Message

from kafka import kafka_consumer

TOPIC = "cdc.public.orders"


def debezium_msg_processor(msg: Message) -> Dict[str, Any]:
    # {"before": {...}|null, "after": {...}|null, "op": "c"|"r"|"u"|"d", "ts_ms": ...}
    # c/r/u carry the new row in "after"; d carries the old row in "before"
    envelope = json.loads(msg.value().decode("utf-8"))
    op = envelope["op"]
    row = envelope["after"] if envelope["after"] is not None else envelope["before"]

    return {
        **row,
        "__cdc_op": op,
        "__cdc_ts_ms": envelope["ts_ms"],
        "__cdc_deleted": op == "d",   # hard_delete hint below reads this
    }


orders = kafka_consumer(TOPIC, msg_processor=debezium_msg_processor, batch_size=500, batch_timeout=5)
orders.apply_hints(
    table_name="orders",
    primary_key="id",
    write_disposition="merge",
    columns={
        "__cdc_deleted": {"hard_delete": True},
        "__cdc_ts_ms": {"dedup_sort": "desc"},   # keep the newest event if a batch has dupes
    },
)

pipeline = dlt.pipeline(pipeline_name="cdc_orders", destination="clickhouse", dataset_name="cdc_lab")

if __name__ == "__main__":
    load_info = pipeline.run(orders)
    print(load_info)
```

Three hints are doing all the real work: `write_disposition="merge"` with `primary_key="id"` turns every load into an upsert instead of a blind append; `hard_delete` on `__cdc_deleted` means that when it's `True` for a row, dlt deletes that row from ClickHouse during merge: a Postgres `DELETE` becomes a real `DELETE`, not a `deleted=true` flag sitting next to stale data; and `dedup_sort` on `__cdc_ts_ms` keeps only the newest event if a batch happens to contain two updates for the same row.

```bash
$ python3.13 cdc_pipeline.py
Pipeline cdc_orders load step completed in 0.64 seconds
1 load package(s) were loaded to destination clickhouse and into dataset cdc_lab
```

`dataset_table_separator = "___"` in secrets means every table gets namespaced as `<dataset_name>___<table_name>`, so `orders` lands as `cdc_lab___orders`, alongside dlt's own bookkeeping tables (`_dlt_loads`, `_dlt_pipeline_state`, `_dlt_version`) and a parallel `_staging` set it uses before merging.

![ClickHouse after the first sync, five rows with cdc_op = r](/images/cdc-lab/02-clickhouse-initial-sync.png "All five seed rows present, decimals readable, cdc_op = r for every one since they all came from Debezium's initial snapshot")

## Live propagation: insert, update, delete

This is the payoff: change Postgres, rerun the pipeline, and watch it show up in ClickHouse, including a delete, which timestamp-polling approaches structurally can't see.

### Insert: a bug in dlt's scaffolded source

```sql
INSERT INTO orders (customer_name, product, quantity, unit_price)
VALUES ('Fatima Rahman', 'Webcam 1080p', 2, 45.90);
```

```bash
$ python3.13 cdc_pipeline.py
0 load package(s) were loaded to destination clickhouse and into dataset None
```

Nothing loaded, even though the row's CDC event was confirmed present on the topic via `rpk topic consume`. I tracked this down to an off-by-one in the scaffolded `dlt-kafka` source's `OffsetTracker`: at runtime, `renew(msg)` stores `cur = msg.offset()`, meaning `cur` is "last consumed offset." But at startup, `_init_partition_offsets()` computed `cur_offset = last_stored_offset + 1`, a "next offset to read" value, and used that same number both to seed `cur` *and* to seek the Kafka consumer. `has_unread` then compares as if `cur` always means "last consumed" (`cur + 1 < max`). Feed it an already-incremented "next to read" value at init and the comparison silently shifts by one: if exactly one new message is pending since the last run, `has_unread` is `False` before the read loop ever starts, and that message sits invisible. Not lost, since the moment a second message shows up both get caught in the same run, but a single pending change can hang there indefinitely.

Since dlt's verified sources are scaffolded straight into the project rather than hidden behind a package boundary, I could just fix it in place, in `pipeline/kafka/helpers.py`: keep `cur` consistently meaning "last consumed" at both init and runtime, and compute the Kafka seek position (which does need "next to read") as a separate value, only at init.

```python
else:
    cur_offset = self._cur_offsets[t_name].get(str(part.partition), -1)
    end_offset = max_offset
    seek_offset = cur_offset + 1   # Kafka seek wants "next to read"; cur stays "last consumed"
...
parts[i].offset = seek_offset
```

```bash
$ python3.13 cdc_pipeline.py
Pipeline cdc_orders load step completed in 0.30 seconds
1 load package(s) were loaded to destination clickhouse and into dataset cdc_lab
```

![ClickHouse after the insert, six rows](/images/cdc-lab/03-clickhouse-after-insert.png "The pending row lands the moment the offset bug is patched")

### Update

```sql
UPDATE orders SET quantity = 5, unit_price = 39.90 WHERE id = 6;
```

```bash
$ python3.13 cdc_pipeline.py
Pipeline cdc_orders load step completed in 0.61 seconds
1 load package(s) were loaded to destination clickhouse and into dataset cdc_lab
```

![ClickHouse after the update, still six rows](/images/cdc-lab/04-clickhouse-after-update.png "Still six rows, no duplicate: merge plus primary_key correctly upserted row 6 in place, cdc_op now shows u")

### Delete: the Kafka tombstone convention

```sql
DELETE FROM orders WHERE id = 6;
```

```bash
$ python3.13 cdc_pipeline.py
Traceback (most recent call last):
  ...
AttributeError: 'NoneType' object has no attribute 'decode'
```

By default, every Debezium delete produces *two* Kafka messages: the `"op": "d"` event itself, carrying the deleted row's `before` image, immediately followed by a **tombstone** (same key, `value = null`). That's a standard Kafka log-compaction convention ("this key's history can be garbage collected now"), not a Debezium bug, but my message processor assumed every message had a JSON value and crashed calling `.decode()` on `None`.

I fixed it two ways. Defensively, in the consumer loop, skip `msg_processor` on null-value messages but still advance the offset tracker past them:

```python
if current_offset < max_offset:
    if msg.value() is not None:
        batch.append(msg_processor(msg))
    tracker.renew(msg)
```

And at the source: a connector config change so Debezium stops emitting the redundant tombstone in the first place, applied as a live `PUT /connectors/postgres-orders-connector/config`, which restarts the task in place without touching offsets or the replication slot.

```json
"tombstones.on.delete": "false"
```

```bash
$ python3.13 cdc_pipeline.py
Pipeline cdc_orders load step completed in 1.66 seconds
1 load package(s) were loaded to destination clickhouse and into dataset cdc_lab
```

![ClickHouse after the delete, row 6 gone](/images/cdc-lab/05-clickhouse-after-delete.png "id=6 isn't flagged deleted — it's structurally absent, exactly as if DELETE had run directly against ClickHouse")

That's the payoff of the `hard_delete` hint from the pipeline code above: row 6 isn't sitting there tagged `cdc_deleted = True`, it's gone.

## Schema evolution: what happens when the source shape changes, live

The real test of a CDC pipeline is what happens when the upstream schema changes without a restart.

### Adding a column

```sql
ALTER TABLE orders ADD COLUMN discount_pct NUMERIC(5,2);
INSERT INTO orders (customer_name, product, quantity, unit_price, discount_pct)
VALUES ('Gita Wulandari', 'Noise-Cancelling Headphones', 1, 129.00, 10.00);
```

Postgres's logical replication doesn't need any special handling for `ALTER TABLE`. It just reflects the table's current shape at decode time, so the very next CDC event simply contains the new field. Rerunning the pipeline needs no code change and no restart: dlt inspects the incoming row, notices `discount_pct` isn't part of the known schema yet, and automatically issues `ALTER TABLE ... ADD COLUMN` against ClickHouse before loading. That's dlt's default schema evolution behavior, no configuration needed.

![ClickHouse after ADD COLUMN, discount_pct appears](/images/cdc-lab/06-clickhouse-add-column.png "The five pre-existing rows get NULL for discount_pct; the new row has 10.00. No manual DDL was run.")

### Dropping a column: dlt's default behavior

```sql
ALTER TABLE orders DROP COLUMN discount_pct;
INSERT INTO orders (customer_name, product, quantity, unit_price)
VALUES ('Hendra Wijaya', 'Desk Lamp', 1, 22.00);
```

From here on, every CDC event's JSON simply doesn't have a `discount_pct` key at all: not `null`, just absent, same as any column that never existed. Rerunning the pipeline doesn't drop the column from ClickHouse. Row 7 keeps its `10.00` forever; row 8, created after the drop, just gets `NULL`.

![ClickHouse after DROP COLUMN, discount_pct still present](/images/cdc-lab/07-clickhouse-drop-column-default.png "discount_pct is untouched: dlt never narrows a warehouse schema just because the source did")

This is deliberate, not a limitation. A dropped source column doesn't have one obvious meaning: it might mean "purge this data," or it might mean "we moved this field upstream but the history still matters for reporting." dlt can't know which, so it defaults to the non-destructive option and never silently deletes data. If you want the column gone, that has to be an explicit, separate action.

### Forcing the drop for real

`reconcile_schema.py` is a small standalone script, deliberately not wired into the regular pipeline run, that diffs Postgres's `information_schema.columns` against ClickHouse's `system.columns` and issues `ALTER TABLE ... DROP COLUMN` for anything orphaned:

```python
import argparse
import clickhouse_connect
import psycopg

PG_TABLE = "orders"
CH_TABLE = "cdc_lab___orders"
PIPELINE_OWNED_COLUMNS = {"cdc_op", "cdc_ts_ms", "cdc_deleted", "_dlt_load_id", "_dlt_id"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="actually run the DROP COLUMNs (default: dry run)")
    args = parser.parse_args()

    pg_columns = get_postgres_columns()
    client = clickhouse_connect.get_client(**CLICKHOUSE_DSN)
    ch_columns = get_clickhouse_columns(client)
    orphaned = ch_columns - pg_columns - PIPELINE_OWNED_COLUMNS

    if not orphaned:
        print(f"No orphaned columns. ClickHouse `{CH_TABLE}` matches Postgres `{PG_TABLE}`.")
        return

    print(f"Columns in ClickHouse no longer present in Postgres: {sorted(orphaned)}")
    if not args.apply:
        print("Dry run - no changes made. Re-run with --apply to actually drop these columns.")
        return

    for col in sorted(orphaned):
        client.command(f"ALTER TABLE {CH_TABLE} DROP COLUMN `{col}`")
    print(f"Dropped {len(orphaned)} column(s). This is irreversible.")
```

Dry run by default, real drop only with `--apply`:

```bash
$ python3.13 reconcile_schema.py
Columns in ClickHouse `cdc_lab___orders` no longer present in Postgres `orders`:
  - discount_pct
Dry run - no changes made. Re-run with --apply to actually drop these columns.

$ python3.13 reconcile_schema.py --apply
Applying: ALTER TABLE cdc_lab___orders DROP COLUMN `discount_pct`
Dropped 1 column(s) from `cdc_lab___orders`.
```

![ClickHouse schema after the forced drop, discount_pct gone entirely](/images/cdc-lab/08-clickhouse-drop-column-forced.png "Structurally gone from DESCRIBE TABLE, along with row 7's 10.00 — not hidden, physically removed")

Side by side, this is the whole tradeoff made explicit: dlt's default is safe and non-destructive, nothing lost, ever, silently. The deliberate alternative is one specifically-named script with one specifically-named flag: never something that happens automatically just because a source column disappeared.

## Wrap-up

Every pipeline run in this walkthrough was a manual, one-shot `python3.13 cdc_pipeline.py`, kept deliberate so each screenshot had a clean before/after. For a real deployment the same script works unchanged on a loop or a schedule, since dlt's incremental offset tracking means each run only picks up what's new:

```bash
watch -n 10 python3.13 cdc_pipeline.py
```

For lower latency than polling, `kafka_consumer` could run as a long-lived consumer instead of batch-and-exit. Out of scope here, but `batch_size`/`batch_timeout` in the pipeline are where that starts.

This is what actually went wrong building it, the reference I'd want on hand next time:

| Symptom | Cause | Fix |
|---|---|---|
| `sudo: a terminal is required to authenticate` | Command relayed through a non-interactive session, not a real pty | Run `sudo` directly in your own terminal/SSH session |
| `sudo: python3.13: command not found` | `sudo` resets `PATH`, doesn't see `~/.local/bin` | Pass the interpreter's full real path to `sudo` |
| `docker ps` → permission denied right after `usermod -aG docker` | Group membership is computed at login, not retroactive | `sg docker -c "..."` instead of a full logout |
| `unit_price` arrives as base64 gibberish | Debezium's default `decimal.handling.mode: precise` | Set `"decimal.handling.mode": "string"` on the connector |
| `cannot advance replication slot to X, minimum is Y` | Kafka Connect's stored offset survived a connector delete + slot recreate | Wipe Connect's internal topics and restart (or pick a new connector name) |
| A single new Postgres change never shows up until a second change happens | Off-by-one in the scaffolded `kafka_consumer`'s `OffsetTracker.has_unread` | Patched locally in `pipeline/kafka/helpers.py` |
| `AttributeError: 'NoneType' object has no attribute 'decode'` right after a delete | Kafka tombstone message (`value=null`) following the delete event | Skip null-value messages in the consumer loop, set `"tombstones.on.delete": "false"` |
| A dropped Postgres column still shows up (as `NULL`) in ClickHouse | dlt's intended default: additive-only schema evolution | Expected; use `reconcile_schema.py --apply` if you want it dropped |

If I extended this further, the next things I'd try are a second table with a foreign-key-shaped join, to see how multiple CDC topics interact in one dlt pipeline, and swapping `hard_delete` for a soft-delete flag to compare query ergonomics against what's here. The bug in the scaffolded offset tracker was the most useful part of this build: a good reminder that "verified source" means the code showed up working on day one, not that it's bug-free forever, and that dlt scaffolding it directly into the project instead of hiding it behind a package boundary is exactly what made that bug fixable in five minutes instead of a GitHub issue and a wait.
