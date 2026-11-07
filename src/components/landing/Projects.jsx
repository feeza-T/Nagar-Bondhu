import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  X,
} from 'lucide-react';
import Reveal from '../common/Reveal';
 
 
import p1 from '../../assets/gallery/p1.webp';
import p2 from '../../assets/gallery/p2.jpg';
import p3 from '../../assets/gallery/p3.jpg';
import p4 from '../../assets/gallery/p4.jpg';
import p5 from '../../assets/gallery/p5.jpg';
import p6 from '../../assets/gallery/p6.jpg';
import p7 from '../../assets/gallery/p7.jpg';
import p8 from '../../assets/gallery/p8.jpg';
import p9 from '../../assets/gallery/p9.jpg';
import p10 from '../../assets/gallery/p10.jpg';
import p11 from '../../assets/gallery/p11.jpg';
import p12 from '../../assets/gallery/p12.jpg';
import p13 from '../../assets/gallery/p13.jpg';
import p14 from '../../assets/gallery/p14.jpg';
 
/* ==========================================================================
   HOW TO ADD MORE PHOTOS
   --------------------------------------------------------------------------
   1. import each photo, e.g.   import p15 from '../../assets/gallery/p15.png';
   2. put it in `src` below.    { key: 'p15', src: p15 }
   3. Need more photos? Just add more items. The mosaic repeats every
      7 photos (one "block"). If your last block is not full, the empty
      slots are filled automatically with colourful placeholders, so the
      grid never has gaps.
 
   Titles / places come from i18n: projects.p1.title, projects.p1.place ...
   (optional: a missing title simply hides the caption).
   ========================================================================== */
const PHOTOS = [
  { key: 'p1', src: p1 },
  { key: 'p2', src: p2 },
  { key: 'p3', src: p3 },
  { key: 'p4', src: p4 },
  { key: 'p5', src: p5 },
  { key: 'p6', src: p6 },
  { key: 'p7', src: p7 },
  { key: 'p8', src: p8 },
  { key: 'p9', src: p9 },
  { key: 'p10', src: p10 },
  { key: 'p11', src: p11 },
  { key: 'p12', src: p12 },
  { key: 'p13', src: p13 },
  { key: 'p14', src: p14 },
];
 
/*
  One "block" of the mosaic. [column, row, width, height] (1-based).
  Verified: every cell is covered exactly once, so there are no gaps.
*/
const BLOCK = 7;
 
// Desktop / tablet: 4 columns x 4 rows per block (16 cells, 7 tiles)
const DESKTOP = [
  [1, 1, 2, 2], [3, 1, 1, 1], [4, 1, 1, 2], [3, 2, 1, 1],
  [1, 3, 1, 2], [2, 3, 2, 2], [4, 3, 1, 2],
];
const DESKTOP_ROWS = 4;
 
// Mobile: 2 columns x 6 rows per block (12 cells, 7 tiles)
const MOBILE = [
  [1, 1, 2, 2],
  [1, 3, 1, 2], [2, 3, 1, 1], [2, 4, 1, 1],
  [1, 5, 2, 1],
  [1, 6, 1, 1], [2, 6, 1, 1],
];
const MOBILE_ROWS = 6;
 
const PLACEHOLDERS = [
  'from-forest to-olive',
  'from-brand to-clay',
  'from-lime to-teal',
  'from-teal to-forest',
  'from-clay to-brand',
  'from-olive to-lime',
  'from-ink to-forest',
];
 
/* ---------- helpers ---------- */
 
function useIsDesktop() {
  const query = '(min-width: 640px)';
  const [match, setMatch] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return match;
}
 
function Media({ tile, alt, iconSize = 44 }) {
  if (tile.src) {
    return (
      <img
        src={tile.src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${tile.bg}`}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.9) 1.4px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-32 w-32 bg-white/30"
        style={{ borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%' }}
      />
      <Camera
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30"
        size={iconSize}
        strokeWidth={1.5}
      />
    </div>
  );
}
 
/* ---------- Lightbox ---------- */
 
function Lightbox({ tiles, index, onClose, onPrev, onNext, t }) {
  const tile = tiles[index];
  const title = t(`projects.${tile.key}.title`, { defaultValue: '' });
  const place = t(`projects.${tile.key}.place`, { defaultValue: '' });
 
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);
 
  const btn =
    'z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1F3D2A] bg-white text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A]';
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C2619]/90 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A]"
      >
        <X size={20} strokeWidth={3} />
      </button>
 
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
        className={`absolute left-2 top-1/2 -translate-y-1/2 sm:left-6 ${btn}`}
      >
        <ChevronLeft size={24} strokeWidth={3} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
        className={`absolute right-2 top-1/2 -translate-y-1/2 sm:right-6 ${btn}`}
      >
        <ChevronRight size={24} strokeWidth={3} />
      </button>
 
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 170, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl overflow-hidden rounded-[2rem] border-[3px] border-[#1F3D2A] bg-[#FBF6E9]"
          style={{ boxShadow: '10px 10px 0 0 #DFFF80' }}
        >
          <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
            <Media tile={tile} alt={title || 'Project photo'} iconSize={96} />
          </div>
 
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
            <div>
              {title && (
                <h3 className="text-xl font-extrabold text-[#1F3D2A] sm:text-2xl">
                  {title}
                </h3>
              )}
              {place && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5A6E58]">
                  <MapPin size={15} />
                  {place}
                </p>
              )}
            </div>
            <span className="rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] px-3 py-1 text-xs font-black tracking-widest text-[#1F3D2A]">
              {index + 1} / {tiles.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
 
/* ---------- Section ---------- */
 
export default function Projects() {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const [openIndex, setOpenIndex] = useState(null);
 
  // Pad to a full block so the mosaic never has empty cells
  const blocks = Math.max(1, Math.ceil(PHOTOS.length / BLOCK));
  const total = blocks * BLOCK;
  const tiles = Array.from({ length: total }, (_, i) => {
    const p = PHOTOS[i] || { key: `empty-${i}`, src: null };
    return { ...p, bg: PLACEHOLDERS[i % PLACEHOLDERS.length] };
  });
 
  const layout = isDesktop ? DESKTOP : MOBILE;
  const cols = isDesktop ? 4 : 2;
  const rowsPerBlock = isDesktop ? DESKTOP_ROWS : MOBILE_ROWS;
  const rows = rowsPerBlock * blocks;
  // Keep cells nicely proportioned: ~3:2 on desktop, 4:5 on mobile
  const cellRatio = isDesktop ? 0.6667 : 1.25; // height / width of a single cell
  const aspect = `${cols} / ${rows * cellRatio}`;
 
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % total)),
    [total]
  );
 
  return (
    <section id="projects" className="relative overflow-hidden bg-cream py-20 sm:py-24">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#DFFF80]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-[#E9A34B]/20 blur-3xl" />
 
      {/* Heading */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A]">
              <Camera size={14} />
              {t('projects.eyebrow', { defaultValue: 'Our Gallery' })}
            </span>
 
            <h2 className="section-title">{t('projects.title')}</h2>
 
            <svg
              aria-hidden
              viewBox="0 0 200 14"
              className="mx-auto mt-3 h-3 w-40 text-[#E9A34B]"
              fill="none"
            >
              <motion.path
                d="M2 7 Q 14 0, 26 7 T 50 7 T 74 7 T 98 7 T 122 7 T 146 7 T 170 7 T 198 7"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
              />
            </svg>
 
            <p className="mx-auto mt-4 max-w-xl text-ink/70">{t('projects.desc')}</p>
          </div>
        </Reveal>
      </div>
 
      {/* Full-width mosaic: every cell filled, no gaps */}
      <div className="relative mx-auto mt-12 max-w-[1800px] px-2 sm:px-3">
        <div
          className="grid w-full gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            aspectRatio: aspect,
          }}
        >
          {tiles.map((tile, i) => {
            const b = Math.floor(i / BLOCK);
            const [c, r, w, h] = layout[i % BLOCK];
            const title = t(`projects.${tile.key}.title`, { defaultValue: '' });
            const place = t(`projects.${tile.key}.place`, { defaultValue: '' });
            const big = w * h >= 4;
 
            return (
              <motion.figure
                key={tile.key}
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 15,
                  delay: (i % 4) * 0.06,
                }}
                onClick={() => setOpenIndex(i)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl"
                style={{
                  gridColumn: `${c} / span ${w}`,
                  gridRow: `${r + b * rowsPerBlock} / span ${h}`,
                }}
              >
                <Media
                  tile={tile}
                  alt={title || 'Project photo'}
                  iconSize={big ? 90 : 44}
                />
 
                {/* Caption */}
                {(title || place) && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0C2619]/90 via-[#0C2619]/55 to-transparent p-3 pt-10 text-white sm:p-4 sm:pt-12">
                    {title && (
                      <p
                        className={`font-extrabold leading-tight ${
                          big ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'
                        }`}
                      >
                        {title}
                      </p>
                    )}
                    {place && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/80 sm:text-xs">
                        <MapPin size={11} />
                        {place}
                      </p>
                    )}
                  </figcaption>
                )}
 
                {/* Expand icon: fades in, nothing moves */}
                <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1F3D2A] bg-white text-[#1F3D2A] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Maximize2 size={14} strokeWidth={2.5} />
                </span>
              </motion.figure>
            );
          })}
        </div>
      </div>
 
      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            tiles={tiles}
            index={openIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
            t={t}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
 