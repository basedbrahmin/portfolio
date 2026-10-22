import { useCallback, useState } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState(() => document.documentElement.dataset.theme || 'light');

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
  }, []);

  return [theme, toggle];
}
