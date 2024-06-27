import Link from "next/link";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
};

export function Navbar() {
  return (
    <aside className="mb-16 px-4">
      <div className="lg:sticky lg:top-20">
        <nav className="flex justify-between items-center relative fade" id="nav">
          {/* Left content: Logo text */}
          <div className="left-content flex items-center">
            <Link href="/" className="playwrite-us-trad text-3xl">
              G
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d6607e] transition-all group-hover:w-full"></span>
            </Link>
          </div>
          {/* Right content: Navigation items */}
          <div className="flex space-x-4">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="transition-all font-bold text-xl hover:text-[#d6607e] dark:hover:text-[#d6607e] flex align-middle py-1 px-2 relative group"
              >
                <span className="inter">{name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d6607e] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}