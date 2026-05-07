function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform group-hover:translate-x-1 flex-shrink-0"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="font-montserrat mt-14 sm:mt-16 mb-8 pt-8 sm:pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-base sm:text-lg mb-3 font-playwrite text-primary">g</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Data Engineer exploring the world of data pipelines, analytics, and cloud infrastructure.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base sm:text-lg mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/timeline" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors">
                  Timeline
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base sm:text-lg mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="flex items-center gap-2 group text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="mailto:ghalyrizqimauludin@gmail.com"
                >
                  <ArrowIcon />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 group text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/ghalyrizqi"
                >
                  <ArrowIcon />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 group text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C8553A] dark:hover:text-[#C8553A] transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.linkedin.com/in/ghalyrizqi/"
                >
                  <ArrowIcon />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 sm:mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          © {new Date().getFullYear()} Build with{" "}
          <span className="text-[#C8553A]">❤</span> by Ghaly
        </p>
      </div>
    </footer>
  );
}
