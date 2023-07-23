import Image from '@/components/mdx/image'

import { HERO_LINKS } from '@/config/links'

const Hero = () => {
  return (
    <div className='space-y-6 md:my-16'>
      <div className='flex flex-col-reverse gap-8 md:flex-row md:justify-between'>
        <div className='space-y-4 md:max-w-lg'>
          <h1 className='text-4xl font-bold text-accent-fg'>Ghaly</h1>
          <h2 className='text-lg font-medium text-accent-5'>
            26 yrs • Data Engineer
          </h2>
          <p className='text-lg'>
            Greetings! Welcome to my personal website, where I embark on a
            continuous journey of learning and exploring the fascinating world
            of data engineering. Here, I share my experiences, challenges, and
            triumphs as I delve into the depths of this ever-evolving field.
            *Enjoy your time here!*"
          </p>
        </div>
        <div className='h-20 w-20 md:h-28 md:w-28'>
          <Image
            src='/static/images/avatar.png'
            width={112}
            height={112}
            alt='Hong'
            rounded='rounded-full'
            loading='eager'
            priority
          />
        </div>
      </div>
      <div className='flex gap-6'>
        {HERO_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.label}
            target='_blank'
            rel='noopener noreferrer'
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Hero
