import { useEffect, useRef } from 'react';
import { stopScroll, startScroll } from '../lib/scroll.js';

export default function Lightbox({ item, onClose, children }) {
  const dialog = useRef(null);

  useEffect(() => {
    const el = dialog.current;
    if (item && !el.open) {
      el.showModal();
      stopScroll();
    } else if (!item && el.open) el.close();
  }, [item]);

  const handleClose = () => {
    startScroll();
    onClose();
  };

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      onClose={handleClose}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      aria-label={item?.title}
    >
      {item && (
        <div className="lightbox__inner">
          <button className="lightbox__close mono" onClick={() => dialog.current.close()} autoFocus>
            Close ✕
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
