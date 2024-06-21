import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`Experienced Data Engineer with over 2 years of expertise in developing robust and scalable data solutions leveraging Python, Scala, SQL, and bash scripting. Proficient in utilizing Apache Spark, Apache Airflow, and Dbt for data pipeline construction and management. Successful track record in automation migration, ETL pipeline development, and forecasting model creation. Dedicated and skilled in delivering innovative solutions to drive positive impact.`}
      </p>
      <br />
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
