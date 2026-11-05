import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fmtNum } from '../../utils/format';

// Counts from 0 to `to` when scrolled into view
export default function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { i18n } = useTranslation();
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => { if (ref.current) ref.current.textContent = fmtNum(Math.round(v), i18n.language) + suffix; } });
    return () => c.stop();
  }, [inView, to, suffix, i18n.language]);
  return <span ref={ref}>0{suffix}</span>;
}
