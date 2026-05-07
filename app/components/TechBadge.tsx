import {
  SiPython, SiPostgresql, SiMysql, SiMongodb,
  SiGooglebigquery, SiAmazonredshift, SiDuckdb,
  SiDocker, SiKubernetes, SiJenkins, SiApacheairflow,
  SiDbt, SiTrino, SiTableau, SiBitbucket,
  SiAwslambda, SiAmazons3, SiGooglecloud,
  SiScala, SiApachespark, SiR, SiJava,
  SiMicrosoftsqlserver, SiGit,
} from 'react-icons/si';
import { IconType } from 'react-icons';

const iconMap: Record<string, { icon: IconType; color: string }> = {
  'Python':         { icon: SiPython,           color: '#3776AB' },
  'PostgreSQL':     { icon: SiPostgresql,        color: '#4169E1' },
  'MySQL':          { icon: SiMysql,             color: '#4479A1' },
  'MongoDB':        { icon: SiMongodb,           color: '#47A248' },
  'BigQuery':       { icon: SiGooglebigquery,    color: '#4285F4' },
  'Redshift':       { icon: SiAmazonredshift,    color: '#8C4FFF' },
  'DuckDB':         { icon: SiDuckdb,            color: '#FFF000' },
  'Docker':         { icon: SiDocker,            color: '#2496ED' },
  'Kubernetes':     { icon: SiKubernetes,        color: '#326CE5' },
  'Jenkins':        { icon: SiJenkins,           color: '#D24939' },
  'Airflow':        { icon: SiApacheairflow,     color: '#017CEE' },
  'dbt':            { icon: SiDbt,               color: '#FF694A' },
  'Trino':          { icon: SiTrino,             color: '#DD00A1' },
  'Tableau':        { icon: SiTableau,           color: '#E97627' },
  'Bitbucket':      { icon: SiBitbucket,         color: '#0052CC' },
  'AWS Lambda':     { icon: SiAwslambda,         color: '#FF9900' },
  'S3':             { icon: SiAmazons3,          color: '#569A31' },
  'GCP':            { icon: SiGooglecloud,       color: '#4285F4' },
  'Scala':          { icon: SiScala,             color: '#DC322F' },
  'Apache Spark':   { icon: SiApachespark,       color: '#E25A1C' },
  'R':              { icon: SiR,                 color: '#276DC3' },
  'Java':           { icon: SiJava,              color: '#ED8B00' },
  'SQL Server':     { icon: SiMicrosoftsqlserver,color: '#CC2927' },
  'Git':            { icon: SiGit,               color: '#F05032' },
};

type TechBadgeProps = {
  tech: string;
};

export function TechBadge({ tech }: TechBadgeProps) {
  const entry = iconMap[tech];
  const Icon = entry?.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
      {Icon && <Icon style={{ color: entry.color }} className="w-3 h-3 flex-shrink-0" />}
      {tech}
    </span>
  );
}
