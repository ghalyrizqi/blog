import React from 'react';
import { TypeMix } from 'app/components/TypeMix';
import { TechBadge } from 'app/components/TechBadge';

type TimelineItem = {
  id: number;
  date: string;
  title: string;
  company: string;
  location: string;
  description: string[];
  stack: string[];
  category: 'education' | 'work' | 'achievement' | 'volunteer';
};

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    date: 'Jan 2026 – Present',
    title: 'Data Engineer',
    company: 'Bluebird Group',
    location: 'Jakarta',
    description: [
      'Upgraded Apache Airflow from v2.10.4 to v3.1.6 on Kubernetes, migrated the metadata database, and refactored deprecated code across 300+ DAGs.',
    ],
    stack: ['Airflow', 'Kubernetes', 'Python', 'PostgreSQL'],
    category: 'work',
  },
  {
    id: 2,
    date: 'Oct 2025 – Dec 2025',
    title: 'Data Engineer',
    company: 'Lautan Luas Group',
    location: 'Jakarta',
    description: [
      'Set up Airflow and dbt in Docker, wired Jenkins CI/CD to GitHub webhooks for automated deploys, and built dbt models in BigQuery.',
    ],
    stack: ['Airflow', 'dbt', 'Docker', 'Jenkins', 'BigQuery'],
    category: 'work',
  },
  {
    id: 3,
    date: 'Feb 2025 – Jul 2025',
    title: 'Data Engineer',
    company: 'Bluebird Group',
    location: 'Jakarta',
    description: [
      'Replaced individual MySQL, PostgreSQL, and SQL Server connectors in Airflow DAGs with a single Trino connection into BigQuery.',
    ],
    stack: ['Airflow', 'Trino', 'BigQuery', 'MySQL', 'PostgreSQL', 'SQL Server'],
    category: 'work',
  },
  {
    id: 4,
    date: 'Aug 2022 – Dec 2024',
    title: 'Data Engineer',
    company: 'Super Apps (YC W18)',
    location: 'Surabaya',
    description: [
      'Moved sister company\'s data warehouse from Redshift to DuckDB on EC2, cutting annual costs by 77% ($1,700+).',
      'Moved automation off an on-premise Windows PC onto Apache Airflow, bringing uptime to 99%. Added email alerts and centralized logging to cut incident response time.',
      'Led Bitbucket and CI/CD adoption with SRE teams, tightening code security and deployment reliability.',
      'Built dbt Core on Redshift instead of paying $1,200/year for dbt Cloud, and sped up Tableau dashboards through optimized data marts.',
      'Built ETL pipelines in Python and SQL pulling from CSV, Google Sheets, MongoDB, Redshift, and Oracle NetSuite API. Used AWS Lambda for event-driven steps.',
    ],
    stack: ['Python', 'SQL', 'Airflow', 'dbt', 'Redshift', 'DuckDB', 'AWS Lambda', 'S3', 'MongoDB', 'Tableau', 'Bitbucket'],
    category: 'work',
  },
  {
    id: 5,
    date: 'Apr 2024 – May 2024',
    title: 'Data Engineer Mentor',
    company: 'PARTNATECH',
    location: 'Remote',
    description: [
      'Mentored 6 students in the Analytics Engineer stream. Covered pipeline design, ETL, SQL, Python, and GCP through code reviews and hands-on sessions.',
    ],
    stack: ['Python', 'SQL', 'GCP', 'ETL'],
    category: 'volunteer',
  },
  {
    id: 6,
    date: 'May 2021 – May 2022',
    title: 'Data Engineer',
    company: 'Astra International',
    location: 'Jakarta',
    description: [
      'Built data marts in SQL, Scala, and Apache Spark to feed faster business reports.',
      'Tuned SQL queries in Apache Impala to cut processing time and improve response speed.',
      'Scheduled ETL pipelines with Cron and Apache Spark, replacing manual runs.',
    ],
    stack: ['SQL', 'Scala', 'Apache Spark', 'Apache Impala', 'Cron'],
    category: 'work',
  },
  {
    id: 7,
    date: '2016 – 2021',
    title: 'Bachelor of Informatics Engineering',
    company: 'University of Brawijaya',
    location: 'Malang',
    description: [
      'Graduated with a degree in Informatics Engineering with a focus on data systems and algorithms.',
    ],
    stack: ['Python', 'Java', 'SQL', 'Algorithms'],
    category: 'education',
  },
  {
    id: 8,
    date: 'Jul 2019 – Sep 2019',
    title: 'Data Analyst Intern',
    company: 'Research Center of Citrus and Subtropical Fruits (BSIP Jestro)',
    location: 'Batu',
    description: [
      'Built a Self-Organizing Map clustering model to categorize citrus fruit data across 625 datasets.',
      'Built a forecasting model scoring 25 orange varieties on standardized parameters to identify best hybrid candidates.',
    ],
    stack: ['Python', 'R', 'Machine Learning'],
    category: 'work',
  },
];

function CategoryBadge({ category }: { category: TimelineItem['category'] }) {
  const colors = {
    education: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    work: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    achievement: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    volunteer: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  };

  const labels = {
    education: 'Education',
    work: 'Work',
    achievement: 'Achievement',
    volunteer: 'Volunteer',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category]}`}>
      {labels[category]}
    </span>
  );
}

export default function TimelinePage() {
  return (
    <div className="font-montserrat pb-16">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 sm:mb-12">
          <TypeMix first="T" rest="imeline" firstClassName="text-6xl sm:text-7xl font-normal" className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-poppins">
            A chronological journey through my professional and educational milestones.
          </p>
          <div className="h-1 w-16 sm:w-20 bg-[#C8553A] mt-4 sm:mt-6"></div>
        </header>

        <div className="relative">
          <div className="absolute left-3 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-neutral-200 dark:bg-neutral-800"></div>

          <div className="relative z-10">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="mb-10 sm:mb-12 relative">
                <div className={`md:flex items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-3 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#C8553A] border-4 border-white dark:border-[#121212]"></div>

                  <div className={`ml-10 sm:ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-10 md:text-right' : 'md:ml-10'} md:w-1/2`}>
                    <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-[#C8553A] transition-all duration-300">
                      <div className="flex flex-col space-y-2">
                        <CategoryBadge category={item.category} />
                        <time className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          {item.date}
                        </time>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                          <p className="text-sm font-medium text-[#C8553A]">{item.company} · {item.location}</p>
                        </div>
                        <ul className="space-y-1">
                          {item.description.map((point, i) => (
                            <li key={i} className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {item.description.length > 1 ? `• ${point}` : point}
                            </li>
                          ))}
                        </ul>
                        {item.stack.length > 0 && (
                          <div className={`flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                            {item.stack.map((tech) => (
                              <TechBadge key={tech} tech={tech} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
