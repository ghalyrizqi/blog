import apacheAirflow from 'thesvg/apache-airflow'
import apacheSpark from 'thesvg/apache-spark'
import awsRedshift from 'thesvg/aws-amazon-redshift'
import bitbucket from 'thesvg/bitbucket'
import databricks from 'thesvg/databricks'
import docker from 'thesvg/docker'
import duckdb from 'thesvg/duckdb'
import git from 'thesvg/git'
import googleBigquery from 'thesvg/google-bigquery'
import googleCloud from 'thesvg/googlecloud'
import jenkins from 'thesvg/jenkins'
import kubernetes from 'thesvg/kubernetes'
import linux from 'thesvg/linux'
import mongodb from 'thesvg/mongodb'
import mysql from 'thesvg/mysql'
import postgresql from 'thesvg/postgresql'
import python from 'thesvg/python'
import r from 'thesvg/r'
import scala from 'thesvg/scala'
import trino from 'thesvg/trino'

type SvgIcon = { svg: string; hex: string; title: string }

const iconMap: Record<string, SvgIcon> = {
  'Airflow':    apacheAirflow,
  'Spark':      apacheSpark,
  'Redshift':   awsRedshift,
  'Bitbucket':  bitbucket,
  'Databricks': databricks,
  'Docker':     docker,
  'DuckDB':     duckdb,
  'Git':        git,
  'BigQuery':   googleBigquery,
  'GCP':        googleCloud,
  'Jenkins':    jenkins,
  'Kubernetes': kubernetes,
  'Linux':      linux,
  'MongoDB':    mongodb,
  'MySQL':      mysql,
  'PostgreSQL': postgresql,
  'Python':     python,
  'R':          r,
  'Scala':      scala,
  'Trino':      trino,
}

type TechBadgeProps = {
  tech: string
}

export function TechBadge({ tech }: TechBadgeProps) {
  const entry = iconMap[tech]

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
      {entry && (
        <span
          className="w-3 h-3 flex-shrink-0 inline-flex [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: entry.svg }}
        />
      )}
      {tech}
    </span>
  )
}
