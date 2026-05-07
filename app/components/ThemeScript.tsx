'use client';

import { useEffect } from 'react';

export function ThemeScript() {
  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Get theme from localStorage
              var savedTheme = localStorage.getItem('theme');
              
              // Check system preference
              var systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              
              // Apply the theme
              var initialTheme = savedTheme || systemPreference;
              
              // Apply class to html element immediately
              if (initialTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {
              console.error('Theme script error:', e);
            }
          })();
        `,
      }}
    />
  );
} 