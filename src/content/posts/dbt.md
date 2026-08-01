---
slug: dbt
title: "dbt in an Afternoon: uv, DuckDB, and Jaffle Shop"
excerpt: "What dbt actually does, why it's worth learning, and a hands-on walkthrough with uv, DuckDB, and dbt Labs' Jaffle Shop project — dbt build, dbt run, dbt test, dbt docs, and sqlfluff along the way."
date: 2026-07-26
tags: [dbt, DuckDB, uv]
---

[dbt](https://docs.getdbt.com/docs/introduction) (data build tool) handles the transformation step of ELT. You load raw data into a warehouse first, however you normally do that, and dbt turns it into clean, tested, documented tables using nothing but SQL `select` statements. No orchestration, no data movement. A model is a `.sql` file that selects from `{{ ref('other_model') }}` instead of a hardcoded table name, and dbt compiles that into real SQL, works out the dependency graph from the `ref()` calls, and runs everything in the right order. It's the part of the analytics stack that finally borrowed the boring, useful parts of software engineering: version control, modularity, tests, and documentation that isn't three years out of date.

That name actually covers two different things, and mixing them up is the first mistake almost everyone makes. dbt Core is the free, open-source CLI — install it yourself, point it at a warehouse, run it from your laptop or a cron job or whatever orchestrator you're already stuck with. dbt Cloud is dbt Labs' hosted product built on top of Core: browser IDE, job scheduler, hosted docs, a git UI, a semantic layer — all the operational stuff you'd otherwise have to wire up yourself. Same dbt underneath either way. Cloud just charges for not having to run it.

![dbt Cloud pricing page showing the Starter plan at $100 per user/month](/images/dbt/dbt-cloud-pricing.jpeg "$100/user/month × 12 = $1,200/yr for a single seat")

That $100-a-seat Starter tier is what made the decision easy at my first dbt job, a YC startup: self-host Core on Redshift instead of paying dbt Cloud $1,200 a year for something a laptop and some cron could already do. Everything in this post is dbt Core, run the same way.

The advantages mostly fall out of that one design choice — models as `ref()`-linked SQL files instead of a black box. Models are small and composable instead of one 400-line stored procedure nobody wants to touch. You get tests for free (`unique`, `not_null`, `accepted_values`, `relationships`) and can write your own in plain SQL. Docs and a lineage graph get generated straight from your project, so "what feeds this table" is a command away instead of a Slack archaeology session.

And because the transformation logic is warehouse-agnostic, the same models run on Postgres, BigQuery, Snowflake, Redshift, or DuckDB with an adapter swap. I've run it against Redshift, then watched that same project migrate to DuckDB without the models caring — swap `profiles.yml`, rerun, done. Two jobs since then it's been BigQuery. The SQL barely moves between any of them, which is exactly why a local DuckDB setup is a legitimate way to learn the tool, not a toy version of it.

## Common dbt Terminology

The workshop below throws around `ref()`, `seed`, `source`, and a few other dbt-specific words pretty freely. Quick definitions first, all grounded in the same Jaffle Shop project the rest of this post uses.

### model

A `.sql` file with a `select` statement in it. Nothing more — no config object, no class to extend. Every model becomes a table, a view, or something else, depending on how you materialize it.

```
models/
├── customers.sql
├── orders.sql
├── schema.yml
└── staging/
    ├── stg_customers.sql
    ├── stg_orders.sql
    ├── stg_payments.sql
    └── schema.yml
```

One `.sql` file, one model, one table or view. That's the entire mental model — no ORM, no hidden state.

### source

`source` is how you tell dbt about raw data it didn't build — a table that's already sitting in the warehouse before dbt ever touches it. Declare it once, in YAML, and reference it with `source('name', 'table')` instead of hardcoding the raw table name in every model that needs it.

Jaffle Shop actually sidesteps this. The raw data ships as CSV seeds instead of warehouse tables — a seed is just a CSV file dbt loads into a table with `dbt seed`, no warehouse round-trip needed — and every staging model has a comment admitting it:

```sql
-- normally we would select from the table here, but we are
-- using seeds to load our data in this project
```

If `raw_customers`, `raw_orders`, and `raw_payments` lived in a real warehouse instead of as seeds, you'd declare them like this:

```yaml
# models/staging/_sources.yml
version: 2

sources:
  - name: raw
    database: analytics
    schema: raw
    tables:
      - name: raw_customers
      - name: raw_orders
      - name: raw_payments
```

Rule of thumb: `source()` for anything dbt didn't build, `ref()` for anything it did.

### ref

`ref()` is how one model points at anything else dbt builds — another model, a seed, a snapshot — `{{ ref('raw_customers') }}` instead of a hardcoded table name. dbt resolves that at compile time into the real table, and it's also how dbt works out the entire dependency graph and run order: build everything a model `ref()`s before the model itself, every time, without anyone writing that order down by hand.

```sql
-- models/staging/stg_customers.sql
select
    id as customer_id,
    first_name,
    last_name
from {{ ref('raw_customers') }}
```

Delete a model and every `ref()` pointing at it breaks loudly at compile time, before anything runs. Compare that to finding out a stored procedure depended on a table someone dropped three weeks ago.

### macro

A reusable chunk of Jinja and SQL — write the logic once, call it from anywhere. Jaffle Shop doesn't ship any macros, but it's got the perfect candidate sitting in plain sight: `stg_payments.sql` converts cents to dollars inline —

```sql
amount / 100 as amount
```

Repeat that in five models and you've got five places to update if the raw data's units ever change. A macro turns it into one:

```sql
{% macro cents_to_dollars(column_name) %}
    ({{ column_name }} / 100)
{% endmacro %}
```

```sql
{{ cents_to_dollars('amount') }} as amount
```

Same output, but now exactly one place knows amounts are stored in cents.

### test

dbt calls these **generic tests** — four ship free with dbt-core (`unique`, `not_null`, `accepted_values`, `relationships`), declared as a few lines of YAML next to the column they check. The other kind is a **singular test**: a plain `.sql` file that selects the rows that shouldn't exist — zero rows back means it passes, no special syntax either way. More on both a bit further down, with the real output.

### docs

Generated straight from the project itself: every model, every test, every column description, plus the full lineage graph, with zero separate documentation effort. Full walkthrough with real screenshots further down too.

### snapshot

Source tables get overwritten. A status changes, a price gets corrected, and whatever the value used to be is just gone — the warehouse only ever shows you now. A snapshot is dbt's answer: run on a schedule, and instead of overwriting a row when something changes, it closes out the old version and inserts a new one, stamped with `dbt_valid_from` / `dbt_valid_to`. That's a slowly changing dimension, type 2.

It's exactly the same shape as `orders.status` in Jaffle Shop — `placed`, `shipped`, `completed`, `return_pending`, `returned` — except right now the `orders` model only ever shows the current status. If `raw_orders` lived in that hypothetical warehouse source instead of as a seed, you'd snapshot it directly, before dbt does anything else to it:

```yaml
# snapshots/snap_orders_status.yml
snapshots:
  - name: snap_orders_status
    relation: source('raw', 'raw_orders')
    config:
      unique_key: order_id
      strategy: timestamp
      updated_at: order_date
```

```
order_id   status       dbt_valid_from   dbt_valid_to
1042       shipped      2026-06-01       2026-06-04
1042       completed    2026-06-04       null → current
```

The `orders` model only ever knows `completed`. The snapshot still knows it was `shipped` for three days first.

## Setting Up dbt Locally: uv, DuckDB, and Jaffle Shop

The fastest way to get a feel for dbt without provisioning a warehouse is dbt Labs' [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_duckdb) project, a small fictional ecommerce dataset built specifically to run on DuckDB. Here's the whole loop, end to end.

### Installing uv

[uv](https://docs.astral.sh/uv/) is a single Rust binary that replaces pip, venv, pipx, and most of what people reach for Poetry to do. It manages Python versions itself, resolves dependencies fast enough that you stop noticing install times, and every project gets a lockfile by default instead of "works on my machine." I'd reach for it over pip for anything new at this point, dbt project or otherwise. pip still works, sure. I just don't miss waiting on it.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

![uv --version confirming the install](/images/dbt/uv-version.jpeg "uv 0.9.24, installed and ready")

### Cloning Jaffle Shop

```bash
git clone https://github.com/dbt-labs/jaffle_shop_duckdb.git
```

![git clone output for jaffle_shop_duckdb](/images/dbt/git-clone.jpeg "Cloning the repo dbt Labs built for exactly this kind of local demo")

### Installing dependencies with uv sync

The project's `pyproject.toml` lists `dbt-core`, `dbt-duckdb`, and `sqlfluff`. `uv sync` reads that (and the lockfile) and builds a `.venv` that matches exactly, no separate `pip install -r requirements.txt` step needed.

```bash
uv sync
```

![uv sync installing dbt-core, dbt-duckdb, and sqlfluff](/images/dbt/uv-sync.jpeg "A clean install, resolved and installed in a few seconds")

### Why DuckDB

DuckDB is open source, runs in-process, and reads/writes a single local file — no server, no account, no credentials to generate. `dbt debug` confirms the connection before you run anything:

```bash
uv run dbt debug
```

![dbt debug showing a successful DuckDB connection](/images/dbt/dbt-debug.jpeg "adapter type: duckdb, connection test: OK, all checks passed")

That's the whole pitch for using it here: zero setup between "I have the repo" and "I have a working warehouse." I'm not just saying that as a tutorial nicety, either — the Redshift-to-DuckDB migration I mentioned earlier cut that warehouse's bill by 77%, over $1,700 a year, and the dbt models didn't need touching, just the connection. The whole thing ran on a [`t3.small`](https://instances.vantage.sh/aws/ec2/t3.small) — 2 vCPUs, 2GB of RAM, about $15 a month on-demand — which says a lot about how little DuckDB actually needs to do real work.

![AWS t3.small instance spec and on-demand pricing](/images/dbt/aws-t3-small-pricing.jpeg "2 vCPUs, 2 GiB RAM, $0.0208/hr on-demand — about $15/month")

The SQL and dbt concepts you build on top of it here transfer directly once you point `profiles.yml` at BigQuery, Snowflake, or whatever your actual job runs.

### Trying dbt build

`dbt build` runs seeds, snapshots, models, and tests together in dependency order — the fastest way to go from an empty database to a fully built, fully tested project. Jaffle Shop doesn't have any snapshots, so this run skips straight to seeds, models, and tests.

```bash
uv run dbt build
```

![dbt build running seeds, models, and tests in one pass](/images/dbt/dbt-build.jpeg "3 seeds, 2 table models, 3 view models, 20 data tests — 28 of 28 passed")

### dbt run and dbt test, separately

`build` is what I reach for day to day, but it's worth knowing the two commands it's bundling. `dbt run` only materializes models:

```bash
uv run dbt run
```

![dbt run materializing the staging and mart models](/images/dbt/dbt-run.jpeg "5 models built, nothing else touched")

`dbt test` only runs the tests — generic ones declared in `.yml`, singular ones sitting as `.sql` files in `tests/` — against whatever's already built:

```bash
uv run dbt test
```

![dbt test running the project's schema tests](/images/dbt/dbt-test.jpeg "20 tests, all passing: unique, not_null, accepted_values, relationships")

You reach for these separately when you want a tighter loop — rerun just the models while you're iterating on a query, or just the tests to double-check a fix, without redoing the whole pipeline.

Every one of those 20 tests traces back to plain YAML, not some separate test-writing syntax. Jaffle Shop's `models/schema.yml` declares them directly on the columns they check, right next to each column's description:

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null

      - name: customer_id
        tests:
          - not_null
          - relationships:
              arguments:
                to: ref('customers')
                field: customer_id

      - name: status
        tests:
          - accepted_values:
              arguments:
                values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
```

`unique` and `not_null` take no arguments. `accepted_values` takes a list of the only values the column is allowed to hold. `relationships` checks that every `customer_id` in `orders` actually exists in `customers` — a foreign key check dbt runs as a query, not a database constraint. All four ship with dbt-core for free; a singular test is just a `.sql` file under `tests/` that selects the rows you don't want to see. Zero rows back means the test passes.

### dbt docs

This is the one that's hard to sell in words. `dbt docs generate` builds a catalog of your project (models, columns, tests, descriptions, lineage), and `dbt docs serve` puts a documentation site in front of it, no extra config required.

```bash
uv run dbt docs generate
uv run dbt docs serve
```

![dbt docs generate building the catalog](/images/dbt/dbt-docs-generate.jpeg "Catalog written to target/catalog.json")

![dbt docs serve running locally](/images/dbt/dbt-docs-serve.jpeg "Serving docs at http://localhost:8080")

![The generated dbt docs site overview page](/images/dbt/dbt-docs-overview.jpeg "Every model, seed, and test in the project, browsable")

![A model's generated documentation page, with columns and tests](/images/dbt/dbt-docs-model.jpeg "customers table — description, columns, and tests pulled straight from the project's yml files")

Every bit of that page came from `.yml` files already sitting in the repo. Nobody hand-wrote a doc site.

### sqlfluff

[sqlfluff](https://sqlfluff.com/) is a SQL linter and formatter that actually understands dbt: it resolves Jinja and `ref()` calls before linting, and it's dialect-aware, so the same config lints correctly whether you're targeting DuckDB, BigQuery, or Snowflake. Jaffle Shop ships with a `.sqlfluff` config out of the box, and it's about as minimal as the file gets:

```ini
[sqlfluff]

dialect = duckdb
```

`dialect` is the one setting that actually matters — it's what tells sqlfluff which SQL grammar to parse against, and it's mandatory. Everything else falls back to sqlfluff's defaults. But the file format supports a lot more once a team wants opinions enforced instead of just a working linter: a `[sqlfluff]` block for global settings, and one `[sqlfluff:rules:<rule name>]` block per rule you want to tune individually. A more opinionated version might look like this:

```ini
[sqlfluff]
dialect = duckdb
exclude_rules = layout.cte_newline
max_line_length = 100

[sqlfluff:rules:capitalisation.keywords]
capitalisation_policy = upper

[sqlfluff:rules:layout.newlines]
maximum_empty_lines_inside_statements = 0
```

`exclude_rules` turns off specific checks by rule name — `layout.cte_newline` normally wants a blank line after every CTE's closing parenthesis, and not every team writes SQL that way. `max_line_length` is a plain global setting (sqlfluff's own default is 80, borrowed from dbt Labs' style guide). Everything under a `[sqlfluff:rules:...]` header configures that one rule specifically: `capitalisation.keywords` defaults to just requiring *consistent* casing, so setting `capitalisation_policy = upper` is what actually forces `select` to become `SELECT`. `layout.newlines` controls blank-line limits; capping `maximum_empty_lines_inside_statements` at `0` is a common way to keep CTEs tight instead of double-spaced.

```bash
uv run sqlfluff lint models/
```

![sqlfluff lint output flagging real style issues in the demo models](/images/dbt/sqlfluff-lint.jpeg "Indentation, line length, and an unqualified column reference — real findings from the unmodified demo project")

That's the unmodified demo project, and it still isn't perfectly clean — an unqualified `amount` reference, a couple of lines over 80 characters, some indentation sqlfluff wants adjusted. Most of it is auto-fixable with `sqlfluff fix`. On a team, this is the difference between "SQL style" being a PR comment someone types out by hand every time versus a CI check that just runs.

That's the full loop: install uv, clone a project, sync dependencies, and go from an empty DuckDB file to built models, passing tests, and a browsable docs site, without touching a warehouse or a credential the whole way through. Swap `profiles.yml` for BigQuery or Snowflake later and none of the rest changes. I still reach for a local DuckDB copy of whatever dbt project I'm on when I just want to poke at a model without waiting on a warehouse.
