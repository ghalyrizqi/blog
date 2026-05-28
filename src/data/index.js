export const TIMELINE = [
  {
    id: 'bluebird-2026',
    type: 'work',
    role: 'Data Engineer',
    org: 'Bluebird Group',
    location: 'Jakarta',
    start: '2026-01',
    end: null,
    current: true,
    summary:
      'Upgraded Apache Airflow from v2.10.4 to v3.1.6 on Kubernetes, migrated the metadata database, and refactored deprecated code across 300+ DAGs.',
    bullets: [
      'Upgraded Apache Airflow from v2.10.4 to v3.1.6 on Kubernetes.',
      'Migrated the metadata database with zero downtime.',
      'Refactored deprecated code across 300+ DAGs.',
    ],
    tags: ['Apache Airflow', 'Kubernetes', 'Python', 'PostgreSQL'],
  },
  {
    id: 'lautan-2025',
    type: 'work',
    role: 'Data Engineer',
    org: 'Lautan Luas Group',
    location: 'Jakarta',
    start: '2025-10',
    end: '2025-12',
    summary:
      'Set up Airflow and dbt in Docker, wired Jenkins CI/CD to GitHub webhooks for automated deploys, and built dbt models in BigQuery.',
    bullets: [
      'Set up Airflow and dbt in Docker.',
      'Wired Jenkins CI/CD to GitHub webhooks for automated deploys.',
      'Built dbt models in BigQuery.',
    ],
    tags: ['Apache Airflow', 'dbt', 'Docker', 'Jenkins', 'BigQuery'],
  },
  {
    id: 'bluebird-2025',
    type: 'work',
    role: 'Data Engineer',
    org: 'Bluebird Group',
    location: 'Jakarta',
    start: '2025-02',
    end: '2025-07',
    summary:
      'Replaced individual MySQL, PostgreSQL, and SQL Server connectors in Airflow DAGs with a single Trino connection into BigQuery.',
    bullets: [
      'Consolidated MySQL, PostgreSQL, and SQL Server connectors into a single Trino connection.',
      'Routed unified queries into BigQuery from existing Airflow DAGs.',
    ],
    tags: ['Apache Airflow', 'Trino', 'BigQuery', 'MySQL', 'PostgreSQL', 'SQL Server'],
  },
  {
    id: 'super-2022',
    type: 'work',
    role: 'Data Engineer',
    org: 'Super',
    orgNote: 'YC W18',
    location: 'Surabaya',
    start: '2022-08',
    end: '2024-12',
    summary:
      'Cut warehouse costs 77% by migrating Redshift → DuckDB, raised pipeline uptime to 99%, and led CI/CD adoption.',
    bullets: [
      "Moved sister company's data warehouse from Redshift to DuckDB on EC2, cutting annual costs by 77% ($1,700+).",
      'Moved automation off an on-premise Windows PC onto Apache Airflow, bringing uptime to 99%.',
      'Led Bitbucket and CI/CD adoption with SRE teams.',
      'Built dbt Core on Redshift instead of paying $1,200/yr for dbt Cloud.',
      'Built ETL pipelines pulling from CSV, Google Sheets, MongoDB, Redshift, and Oracle NetSuite API.',
    ],
    tags: ['Python', 'SQL', 'Apache Airflow', 'dbt', 'Redshift', 'DuckDB', 'AWS Lambda', 'S3', 'MongoDB', 'Tableau', 'Bitbucket'],
  },
  {
    id: 'partnatech-2024',
    type: 'volunteer',
    role: 'Data Engineer Mentor',
    org: 'PARTNATECH',
    location: 'Remote',
    start: '2024-04',
    end: '2024-05',
    summary:
      'Mentored 6 students in the Analytics Engineer stream. Covered pipeline design, ETL, SQL, Python, and GCP.',
    bullets: [
      'Mentored 6 students in the Analytics Engineer stream.',
      'Covered pipeline design, ETL, SQL, Python, and GCP through code reviews and hands-on sessions.',
    ],
    tags: ['Python', 'SQL', 'GCP', 'ETL'],
  },
  {
    id: 'astra-2021',
    type: 'work',
    role: 'Data Engineer',
    org: 'Astra International',
    location: 'Jakarta',
    start: '2021-05',
    end: '2022-05',
    summary:
      'Built data marts in SQL/Scala/Spark and tuned Impala queries to speed up business reporting.',
    bullets: [
      'Built data marts in SQL, Scala, and Apache Spark to feed faster business reports.',
      'Tuned SQL queries in Apache Impala to cut processing time.',
      'Scheduled ETL pipelines with Cron and Apache Spark, replacing manual runs.',
    ],
    tags: ['SQL', 'Scala', 'Apache Spark', 'Apache Impala', 'Cron'],
  },
  {
    id: 'brawijaya',
    type: 'education',
    role: 'B.Eng. Informatics Engineering',
    org: 'University of Brawijaya',
    location: 'Malang',
    start: '2016-08',
    end: '2021-04',
    summary:
      'Studied data systems and algorithms. Final thesis applied ML to classify citrus varieties across 625 samples.',
    bullets: [
      'Focus on data systems and algorithms.',
      'Final thesis on machine learning applied to agricultural data.',
    ],
    tags: ['Python', 'Java', 'SQL', 'Algorithms'],
  },
  {
    id: 'bsip-2019',
    type: 'work',
    role: 'Data Analyst Intern',
    org: 'BSIP Jestro',
    orgNote: 'Research Center of Citrus and Subtropical Fruits',
    location: 'Batu',
    start: '2019-07',
    end: '2019-09',
    summary:
      'Clustered citrus data and built a forecasting model to identify the best hybrid orange varieties.',
    bullets: [
      'Built a Self-Organizing Map clustering model across 625 citrus datasets.',
      'Built a forecasting model scoring 25 orange varieties to identify best hybrid candidates.',
    ],
    tags: ['Python', 'R', 'Machine Learning'],
  },
]

export const BLOG_POSTS = [
  {
    slug: 'airflow-v3-migration',
    title: 'Migrating Airflow v2 → v3 on Kubernetes',
    excerpt:
      "What broke, what didn't, and the metadata-database migration playbook I wish I'd had going in. Notes from refactoring 300+ DAGs.",
    date: '2026-03-12',
    minutes: 9,
    tags: ['Airflow', 'Kubernetes', 'Migration'],
    placeholder: true,
  },
  {
    slug: 'redshift-to-duckdb',
    title: 'Why we replaced Redshift with DuckDB (and saved 77%)',
    excerpt:
      'When "enterprise warehouse" is the wrong default: one EC2 box and a Parquet bucket replaced Redshift and cut annual costs by 77% ($1,700+).',
    date: '2026-01-28',
    minutes: 12,
    tags: ['DuckDB', 'Redshift', 'Architecture'],
    placeholder: true,
  },
  {
    slug: 'trino-single-connector',
    title: 'One Trino connection to rule them all',
    excerpt:
      'Consolidating MySQL, Postgres, and SQL Server connectors in Airflow DAGs into a single Trino endpoint. The good, the ugly, the latency.',
    date: '2025-11-04',
    minutes: 7,
    tags: ['Trino', 'Airflow', 'BigQuery'],
    placeholder: true,
  },
  {
    slug: 'dbt-core-on-redshift',
    title: 'dbt Core on Redshift, skipping the $1,200 bill',
    excerpt:
      'How we ran dbt against Redshift without paying for dbt Cloud — CI, docs, exposures, and the parts you actually miss.',
    date: '2025-08-19',
    minutes: 8,
    tags: ['dbt', 'Redshift', 'CI/CD'],
    placeholder: true,
  },
  {
    slug: 'som-citrus',
    title: 'Self-Organizing Maps on citrus data, five years on',
    excerpt:
      'Looking back at my undergrad thesis — clustering 625 orange varieties. What I\'d do differently as a data engineer today.',
    date: '2025-05-02',
    minutes: 6,
    tags: ['ML', 'Retrospective'],
    placeholder: true,
  },
  {
    slug: 'vim',
    title: 'On saying miaw: notes on stress in production',
    excerpt:
      'A short, silly note on a habit that\'s quietly carried me through three on-call rotations. Not technical. Mostly about a cat.',
    date: '2024-06-21',
    minutes: 3,
    tags: ['Personal'],
    placeholder: false,
    content: `
Stress is inevitable. Deadlines pile up, pipelines break at 2 AM, and the metrics dashboard turns red right before a review. We all have our coping mechanisms — some people run, some meditate, some drink too much coffee.

I say *miaw*.

## The origin

It started as a joke. During a particularly rough on-call rotation, my cat walked across my keyboard and somehow typed "miaw" in the middle of a Slack thread about a broken Airflow DAG. My colleague responded: "mood."

That was it. That was the whole thing. Something about a cat's complete indifference to production incidents felt deeply correct.

## Why it works

There's a psychological concept called *cognitive defusion* — the idea that you can create distance between yourself and a stressful thought by observing it rather than becoming it. Saying "miaw" out loud when something goes wrong is, I think, a very low-tech version of this.

It's hard to catastrophize when you've just said "miaw" to a broken SQL query.

## Practical application

- Pipeline fails at 3 AM: miaw.
- Stakeholder asks for "just one more column" at 4:30 PM on a Friday: miaw.
- dbt test fails in prod but passes locally: miaw (twice, for emphasis).

## The actual lesson

The point isn't the word. The point is the pause — that half-second where you acknowledge that something is annoying or broken or hard, without immediately spiraling into it.

A deep breath works too. So does stepping away from the screen. But "miaw" is faster, more memorable, and occasionally makes your colleagues laugh, which is its own kind of stress relief.

Try it. You have nothing to lose except your composure, which you were probably losing anyway.
    `.trim(),
  },
]

export const STACK = [
  { group: 'Languages',      items: ['Python', 'SQL', 'Scala', 'R', 'Java'] },
  { group: 'Orchestration',  items: ['Apache Airflow', 'dbt', 'Cron', 'Jenkins'] },
  { group: 'Warehouses',     items: ['BigQuery', 'Redshift', 'DuckDB', 'Trino'] },
  { group: 'Storage / OLTP', items: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'S3'] },
  { group: 'Compute',        items: ['Apache Spark', 'Apache Impala', 'AWS Lambda'] },
  { group: 'Platform',       items: ['Kubernetes', 'Docker', 'Linux', 'Bitbucket', 'Git'] },
]

// ── Helpers ────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function fmtMonth(s) {
  if (!s) return 'Present'
  const [y, m] = s.split('-')
  if (!m) return y
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

export function fmtRange(start, end) {
  return `${fmtMonth(start)} — ${end ? fmtMonth(end) : 'Present'}`
}

export function toDate(s) {
  if (!s) return new Date()
  const [y, m] = s.split('-')
  return new Date(parseInt(y), m ? parseInt(m) - 1 : 0, 1)
}

export function durationMonths(start, end) {
  const s = toDate(start)
  const e = end ? toDate(end) : new Date()
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
}

export function fmtDuration(start, end) {
  const months = durationMonths(start, end)
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y} yr`
  return `${y} yr ${m} mo`
}

export function postCat(p) {
  if (p.tags.includes('Personal') || p.tags.includes('Retrospective')) return 'Personal'
  if (['dbt','Airflow','Trino','DuckDB'].some(t => p.tags.includes(t))) return 'Tools'
  return 'Engineering'
}
