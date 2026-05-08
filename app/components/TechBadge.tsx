import {
  SiPython, SiPostgresql, SiMysql, SiMongodb,
  SiGooglebigquery, SiDuckdb,
  SiDocker, SiKubernetes, SiJenkins, SiApacheairflow,
  SiDbt, SiTrino, SiBitbucket,
  SiApachespark, SiGit, SiLinux,
} from 'react-icons/si'
import { IconType } from 'react-icons'

const iconMap: Record<string, { icon: IconType; color: string }> = {
  'Python': { icon: SiPython, color: '#3776AB' },
  'PostgreSQL': { icon: SiPostgresql, color: '#4169E1' },
  'MySQL': { icon: SiMysql, color: '#4479A1' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'BigQuery': { icon: SiGooglebigquery, color: '#4285F4' },
  'DuckDB': { icon: SiDuckdb, color: '#FFF000' },
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Kubernetes': { icon: SiKubernetes, color: '#326CE5' },
  'Jenkins': { icon: SiJenkins, color: '#D24939' },
  'Airflow': { icon: SiApacheairflow, color: '#017CEE' },
  'dbt': { icon: SiDbt, color: '#FF694A' },
  'Trino': { icon: SiTrino, color: '#DD00A1' },
  'Bitbucket': { icon: SiBitbucket, color: '#0052CC' },
  'Spark': { icon: SiApachespark, color: '#E25A1C' },
  'Git': { icon: SiGit, color: '#F05032' },
  'Linux': { icon: SiLinux, color: '#FCC624' },
}

type TechBadgeProps = {
  tech: string
}

export function TechBadge({ tech }: TechBadgeProps) {
  const entry = iconMap[tech]
  const Icon = entry?.icon

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
      {Icon && <Icon style={{ color: entry.color }} className="w-3 h-3 flex-shrink-0" />}
      {tech}
    </span>
  )
}
