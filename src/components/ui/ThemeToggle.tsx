'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark' || (theme === 'dark' && resolvedTheme !== 'light');

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative p-2.5 rounded-xl border border-border bg-surface text-foreground hover:bg-background hover:border-foreground transition-all flex items-center justify-center gap-1.5 shadow-sm"
    >
      {isDark ? (
        <Moon className="h-4 w-4 transition-transform duration-200 rotate-0 scale-100 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200 rotate-0 scale-100 text-amber-500" />
      )}
    </button>
  );
}
