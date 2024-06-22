import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className={`inter container mx-auto px-4`}>
      <h1 className="mb-8 text-6xl font-bold tracking-tighter">
        <span className={`inter text-7xl`}>
          Hello World!
          <br />
          I'm{" "}
        </span>{" "}
        <span
          className={`playwrite-us-trad text-7xl underline decoration-4 underline-offset-8`}
        >
          ghaly
        </span>
      </h1>
      <p className={`poppins-kecil mb-10 font-semibold`}>
        {`Experienced Data Engineer with over 2 years of expertise in developing robust and scalable data solutions leveraging Python, Scala, SQL, and bash scripting. Proficient in utilizing Apache Spark, Apache Airflow, and Dbt for data pipeline construction and management. Successful track record in automation migration, ETL pipeline development, and forecasting model creation. Dedicated and skilled in delivering innovative solutions to drive positive impact.`}
      </p>
      <div className={`poppins-kecil mb-8`}>
        <BlogPosts />
      </div>
    </section>
  );
}
