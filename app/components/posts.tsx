import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div className="flex flex-col gap-6">
      {allBlogs
        .sort((a, b) =>
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
        )
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 items-start hover:opacity-90 transition-opacity"
          >
            {/* Thumbnail */}
            {post.metadata.image && (
              <div className="relative flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={post.metadata.image}
                  alt={post.metadata.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            )}

            {/* Text */}
            <div className="flex flex-col gap-1 min-w-0">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-primary transition-colors">
                {post.metadata.title}
              </p>
              {post.metadata.summary && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {post.metadata.summary}
                </p>
              )}
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
