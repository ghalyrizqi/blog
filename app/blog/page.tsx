import { BlogPosts } from 'app/components/posts'
import { TypeMix } from 'app/components/TypeMix'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <section className="font-montserrat pb-16">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 sm:mb-12">
          <TypeMix first="B" rest="log" firstClassName="text-6xl sm:text-7xl font-normal" className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-poppins">
            Thoughts and writings on data engineering, pipelines, and technology.
          </p>
          <div className="h-1 w-16 sm:w-20 bg-primary mt-4 sm:mt-6"></div>
        </header>
        <BlogPosts />
      </div>
    </section>
  )
}
