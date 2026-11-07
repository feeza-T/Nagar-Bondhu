import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircleHeart, Quote, Star } from 'lucide-react';
import Reveal from '../common/Reveal';
 
/* ==========================================================================
   CURVED SCROLLING TESTIMONIALS
   --------------------------------------------------------------------------
   Cards glide right-to-left on a loop. Size, lean and height are a smooth
   function of distance from the centre of the strip:
     - edges  -> biggest, leaning toward the centre
     - centre -> smallest, flat
   Card positions are warped with the same curve, so the visible gap between
   neighbours stays even while sizes change (no big holes in the middle).
   ========================================================================== */
const IDS = [1, 2, 3]; // testimonials.t1 / t2 / t3 in i18n
const REPEAT = 5; // copies of the set, so the strip fills wide screens
const SPEED = 38; // px per second
const MIN_SCALE = 0.88; // size in the middle
const MAX_SCALE = 1.08; // size at the edges
const TILT = 18; // max rotateY (deg)
const TWIST = 2; // max rotateZ (deg)
const DROP = 18; // px the centre sits lower than the edges
 
// scale(a) = MIN + RANGE * a^2  (smooth bowl, no sharp point in the middle)
const RANGE = MAX_SCALE - MIN_SCALE;
const MAX_A = 2.4;
 
// one bright colour per testimonial: orange, green, yellow
const VARIANTS = [
  'rounded-[2rem] bg-[#FFB45E]',
  'rounded-[2rem_.6rem_2rem_.6rem] bg-[#9BE08A]',
  'rounded-[.6rem_2rem_.6rem_2rem] bg-[#FFE066]',
];
 
export default function Testimonials() {
  const { t } = useTranslation();
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
 
  const items = Array.from({ length: IDS.length * REPEAT }, (_, i) => ({
    n: IDS[i % IDS.length],
    copy: Math.floor(i / IDS.length),
  }));
 
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;
 
    const cards = cardRefs.current.filter(Boolean);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
    let offset = 0;
    let setWidth = 0;
    let last = performance.now();
    let raf = 0;
    let hovering = false;
    let dragging = false;
    let visible = true;
    let lastX = 0;
 
    const measure = () => {
      if (cards.length > IDS.length) {
        setWidth = cards[IDS.length].offsetLeft - cards[0].offsetLeft;
      }
    };
 
    const wrap = () => {
      if (setWidth > 0) offset = ((offset % setWidth) + setWidth) % setWidth;
    };
 
    const paint = () => {
      const centerX = viewport.clientWidth / 2;
      const H = Math.max(centerX, 420); // curve width (softer on phones)
 
      cards.forEach((card) => {
        const layoutCenter = card.offsetLeft + card.offsetWidth / 2 - offset;
        const raw = (layoutCenter - centerX) / H;
        const sign = raw < 0 ? -1 : 1;
        const a = Math.min(Math.abs(raw), MAX_A);
 
        const scale = MIN_SCALE + RANGE * a * a;
        // integral of scale(a): keeps the visual gap between cards even
        const warped = sign * H * (MIN_SCALE * a + (RANGE * a * a * a) / 3);
        const tx = centerX + warped - layoutCenter;
 
        const lean = Math.max(-1.2, Math.min(1.2, raw));
        const y = DROP * Math.max(0, 1 - a * a);
 
        card.style.transform =
          `translate3d(${tx}px,0,0) perspective(1200px) translateY(${y}px) ` +
          `rotateY(${-lean * TILT}deg) rotateZ(${lean * TWIST}deg) scale(${scale})`;
      });
 
      track.style.transform = `translate3d(${-offset}px,0,0)`;
    };
 
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduceMotion && !hovering && !dragging && visible) offset += SPEED * dt;
      wrap();
      paint();
      raf = requestAnimationFrame(tick);
    };
 
    // drag / swipe to scroll
    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      viewport.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      offset -= e.clientX - lastX;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
    };
    const onEnter = (e) => {
      if (e.pointerType === 'mouse') hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
 
    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    viewport.addEventListener('pointerenter', onEnter);
    viewport.addEventListener('pointerleave', onLeave);
 
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(viewport);
 
    measure();
    raf = requestAnimationFrame(tick);
 
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
      viewport.removeEventListener('pointerenter', onEnter);
      viewport.removeEventListener('pointerleave', onLeave);
    };
  }, []);
 
  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-24">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#DFFF80]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#FFB45E]/25 blur-3xl" />
 
      {/* Heading */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A]">
              <MessageCircleHeart size={14} />
              {t('testimonials.eyebrow', { defaultValue: 'Happy Clients' })}
            </span>
 
            <h2 className="section-title text-center">{t('testimonials.title')}</h2>
 
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
          </div>
        </Reveal>
      </div>
 
      {/* Curved strip */}
      <div className="relative mt-6">
        <div
          ref={viewportRef}
          className="cursor-grab select-none overflow-hidden py-12 active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <div
            ref={trackRef}
            className="relative flex w-max items-stretch gap-3 will-change-transform"
          >
            {items.map(({ n, copy }, i) => (
              <figure
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                aria-hidden={copy > 0 ? true : undefined}
                className={`relative flex min-h-[200px] w-[280px] shrink-0 flex-col overflow-hidden border-[3px] border-[#1F3D2A] p-7 shadow-[5px_5px_0_0_#1F3D2A] will-change-transform sm:min-h-[350px] sm:w-[340px] sm:p-8 ${
                  VARIANTS[(n - 1) % VARIANTS.length]
                }`}
              >
                {/* Decoration: dots, blob and a giant faded quote mark */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255,255,255,0.95) 1.4px, transparent 1.4px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 bg-white/30"
                  style={{ borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%' }}
                />
                <Quote
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-4 text-[#1F3D2A]/10"
                  size={130}
                  strokeWidth={2}
                />
 
                <div className="relative flex items-center justify-between">
                  <span className="flex h-11 w-11 -rotate-6 items-center justify-center rounded-full border-2 border-[#1F3D2A] bg-[#1F3D2A] text-[#DFFF80]">
                    <Quote size={20} strokeWidth={2.5} />
                  </span>
                  <span className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className="fill-[#1F3D2A] text-[#1F3D2A]"
                        aria-hidden
                      />
                    ))}
                  </span>
                </div>
 
                <blockquote className="relative mt-6 flex-1 text-base font-medium leading-relaxed text-[#1F3D2A] sm:text-[17px]">
                  {t(`testimonials.t${n}.text`)}
                </blockquote>
 
                <figcaption className="relative mt-6 flex items-center gap-3 border-t-2 border-dashed border-[#1F3D2A]/30 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#1F3D2A] bg-white text-lg font-black text-[#1F3D2A]">
                    {t(`testimonials.t${n}.name`)[0]}
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate text-sm font-extrabold text-[#1F3D2A]">
                      {t(`testimonials.t${n}.name`)}
                    </b>
                    <span className="block truncate text-xs text-[#1F3D2A]/70">
                      {t(`testimonials.t${n}.role`)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
 
        {/* Edge fades so cards melt into the background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-cream to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent sm:w-24" />
      </div>
    </section>
  );
}
 