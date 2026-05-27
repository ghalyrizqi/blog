import { BlogPosts } from "app/components/posts";
import Link from "next/link";
import { TechBadge } from "app/components/TechBadge";

export default function Page() {
  return (
    <section className="font-sans">
      <div className="mb-10 sm:mb-12 pb-6">
        <div className="relative mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
            <span className="font-montserrat">Hello, I'm </span>
            <span className="font-playwrite text-primary">ghaly</span>
          </h1>
          <div className="h-1 w-16 sm:w-20 bg-primary mt-2 mb-4 sm:mb-6"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
            Data Engineer. Four years building pipelines, migrating warehouses, and keeping production data moving.
          </h2>
        </div>

        <p className="font-poppins mb-6 text-base md:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          Cut warehouse costs 77% by replacing Redshift with DuckDB. Upgraded Airflow from v2 to v3 across 300+ DAGs.
          Wired Jenkins CI/CD into Kubernetes clusters. This is where I write about how it actually went.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Python', 'SQL', 'Airflow', 'dbt', 'BigQuery', 'Redshift', 'DuckDB', 'S3',
            'Docker', 'Kubernetes', 'Jenkins', 'Linux',
            'PostgreSQL', 'MySQL', 'MongoDB',
            'Trino', 'Spark', 'Bitbucket', 'Git',
          ].map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/timeline"
            className="px-4 sm:px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 transition-all text-sm sm:text-base"
          >
            View My Timeline
          </Link>
          <Link
            href="/blog"
            className="px-4 sm:px-5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-sm sm:text-base"
          >
            Read My Blog
          </Link>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 font-poppins">Recent Posts</h3>
        <div className="font-poppins">
          <BlogPosts />
        </div>
      </div>
    </section>
  );
}
