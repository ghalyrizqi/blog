import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <section className="mb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
        <BlogPosts />
      </div>
    </section>
  )
}
