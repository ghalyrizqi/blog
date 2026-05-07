'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Safe localStorage helpers — guard against Node.js 22+ experimental localStorage
// which defines localStorage globally but with broken/missing methods during SSR.
function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('theme') as Theme | null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // ignore — private browsing or storage unavailable
  }
}

function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);

    const storedTheme = getStoredTheme();
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = storedTheme || systemPreference;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  // During SSR: render children without the context provider to avoid
  // any context-dependent rendering issues during server pre-render.
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — returns safe defaults during SSR so static generation never crashes.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return { theme: 'light' as Theme, toggleTheme: () => {} };
  }
  return context;
}