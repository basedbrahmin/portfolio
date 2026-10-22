import { createContext, useContext, useEffect, useState } from 'react';
import fallback from '../data/content.json';
import { fetchContent } from './api.js';

const ContentContext = createContext(fallback);

// Renders instantly from the bundled copy, then swaps in live data from the API.
// Empty collections from a fresh database keep the fallback.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    let alive = true;
    fetchContent()
      .then((data) => {
        if (!alive) return;
        const usable = Object.entries(data).filter(([, v]) => v && (!Array.isArray(v) || v.length));
        setContent((prev) => ({ ...prev, ...Object.fromEntries(usable) }));
      })
      .catch((err) => console.info('[content] using bundled data:', err.message));
    return () => {
      alive = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
