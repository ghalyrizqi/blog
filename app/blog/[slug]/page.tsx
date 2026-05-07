import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let posts = getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) return

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata
  let ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) notFound()

  return (
    <section className="font-montserrat mb-16">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: { '@type': 'Person', name: 'Ghaly Rizqi Mauludin' },
          }),
        }}
      />

      <div className="max-w-2xl mx-auto">
        {/* Cover image */}
        {post.metadata.image && (
          <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        {/* Title & meta */}
        <h1 className="font-bold text-3xl sm:text-4xl tracking-tight mb-3">
          {post.metadata.title}
        </h1>
        <div className="flex items-center gap-3 mb-8 text-sm text-neutral-500 dark:text-neutral-400">
          <time dateTime={post.metadata.publishedAt}>
            {formatDate(post.metadata.publishedAt)}
          </time>
        </div>

        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:my-6
          prose-code:text-sm prose-pre:rounded-lg">
          <CustomMDX source={post.content} />
        </article>
      </div>
    </section>
  )
}
