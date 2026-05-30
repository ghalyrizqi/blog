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
      'Migrated 300+ production DAGs from Airflow v2 to v3 on Kubernetes. The metadata database stayed live throughout.',
    bullets: [
      'Upgraded Airflow from v2.10.4 to v3.1.6 on Kubernetes with a live cutover.',
      'Migrated the metadata database without taking the scheduler down.',
      'Dug through 300+ DAGs to remove deprecated APIs, one operator at a time.',
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
      'Set up Airflow and dbt in Docker from scratch, wired Jenkins CI/CD to GitHub webhooks, and shipped the first dbt models to BigQuery in six weeks.',
    bullets: [
      'Stood up Airflow and dbt in Docker on a fresh environment.',
      'Wired Jenkins CI/CD to GitHub webhooks — deploys went from manual to automatic.',
      'Built the first dbt models against BigQuery.',
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
      'Replaced five source connectors in our Airflow DAGs with one Trino endpoint routing into BigQuery. The DAG logic stayed the same.',
    bullets: [
      'Replaced MySQL, PostgreSQL, and SQL Server DAG connectors with one Trino connection.',
      'Routed all queries through Trino into BigQuery without touching the downstream logic.',
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
      'Replaced Redshift with a DuckDB instance on EC2, cutting the warehouse bill by 77%. Moved the pipeline scheduler off a Windows PC onto Airflow; uptime went to 99%. Pushed CI/CD adoption with a resistant SRE team.',
    bullets: [
      "Migrated the sister company's warehouse from Redshift to DuckDB on EC2 — saved $1,700+/yr (77% cut).",
      'Moved pipeline automation off an on-premise Windows PC onto Airflow; uptime went to 99%.',
      'Pushed Bitbucket + CI/CD adoption across the SRE team.',
      'Self-hosted dbt Core on Redshift instead of paying $1,200/yr for dbt Cloud.',
      'Built ETL pipelines across CSV, Google Sheets, MongoDB, Redshift, and Oracle NetSuite.',
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
      'Mentored 6 students through an analytics engineering curriculum: pipeline design, dbt, SQL, and GCP hands-on.',
    bullets: [
      'Mentored 6 students through an Analytics Engineer curriculum.',
      'Covered pipeline design, ETL, SQL, Python, and GCP hands-on — code reviews included.',
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
      'Built data marts in Spark and Impala for business reporting. Replaced manual SQL runs with Cron and Spark schedules. First job at data scale.',
    bullets: [
      'Built data marts in SQL, Scala, and Spark to power faster business reporting.',
      'Tuned Impala queries that were quietly eating compute time.',
      'Replaced manual ETL runs with Cron and Spark schedules.',
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
      'CS degree from Brawijaya. Final thesis: SOM-based classification of 625 citrus samples by variety. Spent more time on data cleaning than the model itself.',
    bullets: [
      'Focused on data systems and algorithms.',
      'Final thesis: ML-based classification of citrus varieties across 625 samples.',
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
      'Built a Self-Organizing Map model to cluster 625 citrus samples and score 25 orange varieties for hybrid potential. First time working with a real dataset.',
    bullets: [
      'Built a Self-Organizing Map model to cluster 625 citrus datasets.',
      'Scored 25 orange varieties to surface the best hybrid candidates.',
    ],
    tags: ['Python', 'R', 'Machine Learning'],
  },
]

export const BLOG_POSTS = [
  {
    slug: 'airflow-v3-migration',
    title: 'Migrating Airflow v2 → v3 on Kubernetes',
    excerpt:
      "The metadata migration playbook I wish existed before I started. Notes from upgrading 300+ production DAGs.",
    date: '2026-03-12',
    minutes: 9,
    tags: ['Airflow', 'Kubernetes', 'Migration'],
    placeholder: true,
  },
  {
    slug: 'redshift-to-duckdb',
    title: 'Why we replaced Redshift with DuckDB (and saved 77%)',
    excerpt:
      'One EC2 box and a Parquet bucket replaced Redshift. The annual bill dropped 77% and the setup took a week.',
    date: '2026-01-28',
    minutes: 12,
    tags: ['DuckDB', 'Redshift', 'Architecture'],
    placeholder: true,
  },
  {
    slug: 'trino-single-connector',
    title: 'One Trino connection to rule them all',
    excerpt:
      'Consolidated MySQL, Postgres, and SQL Server DAG connectors into one Trino endpoint. The latency numbers were not what I expected.',
    date: '2025-11-04',
    minutes: 7,
    tags: ['Trino', 'Airflow', 'BigQuery'],
    placeholder: true,
  },
  {
    slug: 'dbt-core-on-redshift',
    title: 'dbt Core on Redshift, skipping the $1,200 bill',
    excerpt:
      'Self-hosted dbt Core against Redshift instead of paying $1,200/yr for dbt Cloud. A comparison of what you give up and what you keep.',
    date: '2025-08-19',
    minutes: 8,
    tags: ['dbt', 'Redshift', 'CI/CD'],
    placeholder: true,
  },
  {
    slug: 'som-citrus',
    title: 'Self-Organizing Maps on citrus data, five years on',
    excerpt:
      'My undergrad thesis was SOM clustering on 625 citrus samples. Five years later, most of the approach holds. Two things I would redo.',
    date: '2025-05-02',
    minutes: 6,
    tags: ['ML', 'Retrospective'],
    placeholder: true,
  },
  {
    slug: 'vim',
    title: 'On saying miaw: notes on stress in production',
    excerpt:
      'A note on a habit that carried me through three on-call rotations. About a cat, mostly.',
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
