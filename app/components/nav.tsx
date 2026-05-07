'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { TypeMix } from "./TypeMix";

const navItems: { path: string; first: string; rest: string }[] = [
  { path: "/blog", first: "B", rest: "log" },
  { path: "/timeline", first: "T", rest: "imeline" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="mb-10 sm:mb-12">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-wrap justify-between items-center gap-y-2 relative fade py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-800"
          id="nav"
        >
          {/* Left content: Logo text */}
          <div className="left-content flex items-center">
            <Link
              href="/"
              className="font-manufacturing text-4xl sm:text-5xl relative group transition-all duration-300 hover:text-primary"
            >
              G
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right: Navigation items + Theme toggle */}
          <div className="flex items-center gap-x-2 sm:gap-x-4 flex-wrap">
            {navItems.map(({ path, first, rest }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-all duration-300 font-medium text-lg sm:text-xl hover:text-primary dark:hover:text-primary flex align-middle py-1 px-1.5 sm:px-2 relative group ${isActive ? 'text-primary' : ''}`}
                >
                  <TypeMix
                    first={first}
                    rest={rest}
                    firstClassName="text-4xl sm:text-5xl"
                  />
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </aside>
  );
}
