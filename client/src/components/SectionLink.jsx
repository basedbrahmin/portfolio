import { Link, useLocation } from 'react-router-dom';
import { scrollTo } from '../lib/scroll.js';

// Smooth-scrolls to a section on the home page, or routes home first from elsewhere.
export default function SectionLink({ to, onClick, children, ...props }) {
  const { pathname } = useLocation();
  const hash = `#${to}`;

  const handleClick = (e) => {
    onClick?.(e);
    if (pathname !== '/') return;
    e.preventDefault();
    scrollTo(to === 'top' ? 0 : hash);
    window.history.replaceState(null, '', to === 'top' ? '/' : hash);
  };

  return (
    <Link to={to === 'top' ? '/' : `/${hash}`} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
