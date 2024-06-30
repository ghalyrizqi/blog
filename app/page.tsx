import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className="inter container mx-auto px-4">
      <h1 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter">
        <span className="inter text-6xl md:text-7xl">
          Hello World!
          <br />
          I'm{" "}
        </span>{" "}
        <span
          className="playwrite-us-trad text-6xl md:text-7xl underline decoration-4 underline-offset-8"
          style={{ color: "#FF5758" }}
        >
          ghaly
        </span>
      </h1>
      <p className="poppins-kecil mb-4 text-base md:text-lg font-semibold leading-relaxed">
        <strong>Welcome to my Data Engineering journey!</strong> Here, I
        document my exploration of the vast world of data. I am a Data Engineer
        with 2 years of experience, writing about building data pipelines,
        solving data challenges, and exploring new technologies in the field.
      </p>
      <div className="poppins-kecil mb-8">
        <BlogPosts />
      </div>
    </section>
  );
}
