import { BlogPosts } from "app/components/posts";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  weight: ["700"],
  subsets: ["latin"],
});
const poppins = Poppins({
  weight: ["300"],
  subsets: ["latin"],
});

const poppins2 = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Page() {
  return (
    <section className={`${inter.className} container mx-auto px-4`}>
      <h1 className="mb-8 text-6xl font-bold tracking-tighter">
        <span className={`${inter.className} text-7xl`}>
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
      <p className={`${poppins.className} mb-8`}>
        {`Experienced Data Engineer with over 2 years of expertise in developing robust and scalable data solutions leveraging Python, Scala, SQL, and bash scripting. Proficient in utilizing Apache Spark, Apache Airflow, and Dbt for data pipeline construction and management. Successful track record in automation migration, ETL pipeline development, and forecasting model creation. Dedicated and skilled in delivering innovative solutions to drive positive impact.`}
      </p>
      <div className={`${poppins2.className} mb-8`}>
        <BlogPosts />
      </div>
    </section>
  );
}
