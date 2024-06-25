import Link from "next/link";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
  // "/resume": {
  //   name: "resume",
  // },
};

export function Navbar() {
  return (
    <aside className="mb-16 px-4">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex justify-between items-center relative fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          {/* Left content: Logo text */}
          <div className="left-content flex items-center">
            <Link href="/" className="playwrite-us-trad text-3xl">
              G
            </Link>
          </div>
          {/* Right content: Navigation items */}
          <div className="flex space-x-4">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="transition-all font-bold text-xl hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle py-1 px-2"
              >
                {name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
