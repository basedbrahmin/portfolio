import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './lib/gsap.js';
import { initSmoothScroll, scrollTo, startScroll, stopScroll } from './lib/scroll.js';
import { useContent } from './lib/content.jsx';
import Loader from './components/Loader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import NotFound from './pages/NotFound.jsx';

// Jump to the top (or to #section) on every route change, then recalc scroll triggers.
function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    scrollTo(0, { immediate: true });
    if (hash) setTimeout(() => scrollTo(hash), 100);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const content = useContent();

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [content]);

  useEffect(() => {
    if (!loading) return;
    document.documentElement.classList.add('is-loading');
    stopScroll();
    return () => {
      document.documentElement.classList.remove('is-loading');
      startScroll();
    };
  }, [loading]);

  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      {loading && <Loader onReveal={() => setIntroReady(true)} onComplete={() => setLoading(false)} />}
      <Cursor />
      <Nav />
      <RouteScroll />
      <Routes>
        <Route path="/" element={<Home introReady={introReady} />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
