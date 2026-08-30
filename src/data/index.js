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
      'Upgraded two Airflow instances from v2 to v3 on Kubernetes. One handles Trino to BigQuery pipelines, the other BigQuery to BigQuery. Both run production and development in separate namespaces: four deployments total, 500+ DAGs, no maintenance window.',
    bullets: [
      'Two instances, four namespaces (prd + dev each): Trino→BigQuery and BigQuery→BigQuery.',
      'Upgraded Airflow from v2.10.4 to v3.1.6 on a live Kubernetes cluster.',
      'Migrated the metadata database without taking the scheduler offline.',
      'Went through 300+ DAGs across both instances removing deprecated operators one by one.',
      'Introduced dbt Core on BigQuery, replacing stored procedures with staging and mart models.',
    ],
    tags: ['Apache Airflow', 'Kubernetes', 'Python', 'PostgreSQL', 'dbt', 'BigQuery'],
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
      'Three-month probation at a company just starting their data team. Did a bit of everything: Airflow, dbt, Jenkins CI/CD, first BigQuery models. Best three months of my career. Then Bluebird called and offered me my old role back.',
    bullets: [
      'Set up Airflow and dbt in Docker from scratch on a fresh server.',
      'Wired Jenkins to GitHub webhooks so deploys stopped being manual.',
      'Built the first dbt models and got data flowing into BigQuery.',
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
      '50+ individual database connections in our Airflow DAGs: MySQL, PostgreSQL (mostly), and SQL Server, each wired separately. Replaced the whole mess with one Trino endpoint routing into BigQuery.',
    bullets: [
      'Consolidated 50+ source database connections into a single Trino endpoint.',
      'Routed all queries through Trino into BigQuery. Downstream DAG logic stayed the same.',
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
      "Two and a half years at a YC startup. Replaced Redshift with DuckDB on EC2 and cut $1,700+/yr from the warehouse bill. Retired Robointern, a Windows PC running cron jobs, and moved everything onto Airflow. Uptime went to 99%. Pushed CI/CD with the SRE team and ran dbt Core ourselves to avoid paying $1,200/yr for dbt Cloud.",
    bullets: [
      "Migrated the sister company's warehouse from Redshift to DuckDB on EC2. Saved $1,700+/yr, a 77% cut.",
      'Replaced Robointern (a Windows PC scheduler) with Airflow. Added email alerts and centralized logging. Uptime went to 99%.',
      'Pushed Bitbucket and CI/CD adoption with the SRE team.',
      'Self-hosted dbt Core on Redshift instead of paying $1,200/yr for dbt Cloud.',
      'Wrote Python scripts using AWS Secrets Manager to replace plaintext credentials in configs.',
      'Built ETL pipelines pulling from CSV, Google Sheets, MongoDB, Redshift, and Oracle NetSuite. Used Lambda for event-driven steps.',
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
      'Two months mentoring 6 students through an analytics engineering program: pipeline design, dbt, SQL, Python, and GCP hands-on.',
    bullets: [
      'Taught pipeline design, ETL, SQL, Python, and GCP hands-on.',
      'Ran code reviews and troubleshooting sessions each week.',
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
      'First proper data engineering job. Learned Spark and Impala at real scale, built data marts for business reporting, and replaced a pile of manual SQL runs with scheduled pipelines.',
    bullets: [
      'Built data marts in SQL, Scala, and Spark to feed business reports.',
      'Tuned Impala queries that had been slow and untouched for a while.',
      'Set up Cron and Spark schedules to replace manual ETL runs.',
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
    end: '2021-03',
    summary:
      'Four years of CS in Malang. Took data systems, AI, statistics, and machine learning. Thesis: forecasting new COVID-19 cases in Indonesia using Extreme Learning Machine.',
    bullets: [
      'Courses: Database Systems, Data Mining, AI, Statistics, Neural Networks, Information Retrieval.',
      'Thesis: ELM-based forecasting of new COVID-19 cases in Indonesia.',
      'GPA 3.10, graduated with "Very Satisfactory" predicate.',
    ],
    tags: ['Python', 'Java', 'SQL', 'Machine Learning', 'Algorithms'],
  },
  {
    id: 'bsip-2019',
    type: 'intern',
    role: 'Data Analyst Intern',
    org: 'BSIP Jestro',
    orgNote: 'Research Center of Citrus and Subtropical Fruits',
    location: 'Batu',
    start: '2019-07',
    end: '2019-09',
    summary:
      'Internship at a government citrus research center in Batu. Built a SOM clustering model across 625 datasets and a scoring system to rank 25 orange varieties for hybrid selection. First time working with real data.',
    bullets: [
      'Built a Self-Organizing Map model to cluster 625 citrus datasets.',
      'Built a scoring model to rank 25 orange varieties by hybrid potential.',
      'Presented findings and variety recommendations to management.',
    ],
    tags: ['Python', 'R', 'Machine Learning'],
  },
]

export const STACK = [
  { group: 'Languages',  items: ['Python', 'SQL', 'Scala', 'R'] },
  { group: 'Databases',  items: ['BigQuery', 'Redshift', 'DuckDB', 'PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'S3'] },
  { group: 'Tools',      items: ['Apache Airflow', 'dbt', 'Trino', 'Apache Spark', 'Apache Impala', 'AWS Lambda', 'Jenkins', 'Kubernetes', 'Docker', 'Linux', 'Git'] },
]

// ── Helpers ────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1
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
  if (['dbt', 'Airflow', 'Trino', 'DuckDB'].some(t => p.tags.includes(t))) return 'Tools'
  return 'Engineering'
}
