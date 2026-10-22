import { useRef } from 'react';
import { useContent } from '../lib/content.jsx';
import { useReveal } from '../lib/useReveal.js';
import Marquee from '../components/Marquee.jsx';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Skills from '../sections/Skills.jsx';
import Projects from '../sections/Projects.jsx';
import Timeline from '../sections/Timeline.jsx';
import Certifications from '../sections/Certifications.jsx';
import Contact from '../sections/Contact.jsx';

export default function Home({ introReady }) {
  const content = useContent();
  const root = useRef(null);
  useReveal(root, [content]);

  const skillNames = content.skills.map((s) => s.name);

  return (
    <main ref={root}>
      <Hero ready={introReady} />
      <Marquee items={['Open to internships', 'B.Tech CSE @ JKLU', 'C++ · DSA · DBMS', 'MERN stack', 'Based in Jaipur']} />
      <About />
      <Skills />
      <Marquee items={skillNames} reverse accent />
      <Projects />
      <Timeline />
      <Certifications />
      <Contact />
    </main>
  );
}
