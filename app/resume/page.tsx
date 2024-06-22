import React from "react";

export default function Resume() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="inter mb-8 text-4xl font-bold text-left">
        GHALY RIZQI MAULUDIN
      </h1>
      <h2 className="poppins-gede mb-4 text-xl text-left">Data Engineer</h2>
      <p className="poppins-gede mb-8 text-left">
        ghalyrizqimauludin@gmail.com
      </p>

      <section className="mb-8">
        <h3 className="inter mb-4 text-2xl font-bold">PROFILE</h3>
        <p className="poppins-gede mb-4">
          Experienced Data Engineer with over 2 years of expertise in developing
          robust and scalable data solutions leveraging Python, Scala, SQL, and
          bash scripting. Proficient in utilizing Apache Spark, Apache Airflow,
          and Dbt for data pipeline construction and management. Successful
          track record in automation migration, ETL pipeline development, and
          forecasting model creation. Dedicated and skilled in delivering
          innovative solutions to drive positive impact.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="inter mb-4 text-2xl font-bold">EDUCATION</h3>
        <div className="mb-4">
          <p className="poppins-gede mb-2 font-semibold">
            UNIVERSITY OF BRAWIJAYA
          </p>
          <p className="italic mb-1">Bachelor of Informatics Engineer</p>
          <p className="poppins-gede">Malang, Indonesia</p>
          <p className="poppins-gede white">2016 - 2021</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-2xl font-bold">WORK EXPERIENCES</h3>
        <div className="mb-4">
          <h4 className="mb-2 text-xl font-semibold">SUPER APPS (YC W18)</h4>
          <p className="italic mb-1">Data Engineer</p>
          <p className="mb-1">Indonesia</p>
          <p className="mb-1">August 2022 – Present</p>
          <ul className="list-disc ml-5 mb-4">
            <li>
              Spearheaded Roobintorn to Apache Airflow migration, implementing
              transition plan, setting up cloud VMs, and designing CI/CD with
              SRE teams.
            </li>
            <li>
              Designed, developed, and maintained Airflow pipelines for
              efficient, automated data processing. Created scripts, addressed
              errors, monitored server usage.
            </li>
            <li>
              Contributed to dbt model development and maintenance for reliable
              data transformation pipelines.
            </li>
            <li>
              Developed internal Python/Google Sheets tools for BI team,
              streamlining workflows and enhancing productivity.
            </li>
            <li>
              Introduced Apache Airflow and Bitbucket to data teams, conducting
              demos, developing training materials, and providing implementation
              support.
            </li>
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="mb-2 text-xl font-semibold">
            ASTRAGRAPHIA INFORMATION TECHNOLOGY
          </h4>
          <p className="italic mb-1">Data Engineer</p>
          <p className="mb-1">Indonesia</p>
          <p className="mb-1">May 2021 - May 2022</p>
          <ul className="list-disc ml-5 mb-4">
            <li>
              Designed, implemented, and maintained automated ETL pipelines for
              seamless data integration into the data warehouse.
            </li>
            <li>
              Performed complex SQL tasks daily, enabling efficient BI
              reporting. Created consolidated data marts for BI analysis.
            </li>
            <li>
              Set up and configured optimized databases and tables for efficient
              BI operations.
            </li>
            <li>
              Collaborated with BI team to define and prioritize data
              requirements aligned with business objectives and data-driven
              decision-making.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-2xl font-semibold">PROJECT</h3>
        <ul className="list-disc ml-5 mb-4">
          <li>
            <strong>
              Forecasting New COVID-19 Cases in Indonesia Using Extreme Learning
              Machine (ELM)
            </strong>
            : Developed a Python script utilizing Jupyter Notebook to extract
            JSON data from the API of Indonesia's COVID-19 task force, employing
            web scraping techniques and data wrangling. Implemented the Extreme
            Learning Machine (ELM) method for forecasting new COVID-19 cases in
            Indonesia.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-2xl font-semibold">SKILLS</h3>
        <ul className="list-disc ml-5 mb-4">
          <li>Programming Languages: Python, Scala, R, SQL, Bash</li>
          <li>Databases: Redshift, MySQL, GCP</li>
          <li>
            Tools: Apache Spark, Hadoop, Hive, Impala, Apache Airflow, Data
            Build Tool (dbt), Cron, Docker
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-2xl font-semibold">CERTIFICATIONS</h3>
        <ul className="list-disc ml-5 mb-4">
          <li>SQL - HackerRank</li>
          <li>Python - HackerRank</li>
          <li>Learn DevOps Basics - Dicoding</li>
          <li>
            Create Data Warehouse for Database Architect (Data Engineer) - Skill
            Academy
          </li>
        </ul>
      </section>
    </div>
  );
}
