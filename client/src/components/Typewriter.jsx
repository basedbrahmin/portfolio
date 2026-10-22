import { useEffect, useState } from 'react';

export default function Typewriter({ words, typeSpeed = 70, deleteSpeed = 35, pause = 1700 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const word = words[index % words.length] || '';

  useEffect(() => {
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
      return;
    }
    const full = !deleting && text === word;
    const id = setTimeout(
      () => {
        if (full) setDeleting(true);
        else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      },
      full ? pause : deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(id);
  }, [text, deleting, word, typeSpeed, deleteSpeed, pause]);

  return (
    <span className="typewriter">
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
      <span className="typewriter__caret" aria-hidden="true" />
    </span>
  );
}
