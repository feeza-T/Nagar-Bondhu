import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Leaf, Megaphone, Recycle } from 'lucide-react';
import heroImage from '../../assets/images/hero.jpg';

// Lime + orange mix used by the hero button
const BTN_MIX = 'bg-gradient-to-r from-lime via-[#f0d83a] to-brand text-ink shadow-lg shadow-brand/40 hover:brightness-110';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-forest">
      {/* 1. Full-width image (colour gradient behind it shows while it loads) */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-mint1 via-lime/60 to-brand" />
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover saturate-110"
      />

      {/* 2. Text-side gradient: dark on the left, clear on the right so the image stays bright.
             On mobile it fades from the top instead, because the text covers the whole image. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-forest/85 to-forest/20 lg:bg-gradient-to-r lg:from-forest lg:via-forest/80 lg:to-transparent lg:[background-size:75%_100%] lg:bg-no-repeat" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[640px] lg:py-24">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-sm font-bold text-ink"
          >
            <Leaf size={14} />{t('hero.badge')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-6xl uppercase leading-[0.95] text-white sm:text-7xl lg:text-8xl"
          >
            {t('hero.title1')}<br />
            {/* Lime text is fine here because the background behind it is dark green */}
            <span className="text-lime">{t('hero.title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-lg text-lg text-white/85"
          >
            {t('hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/report" className={`btn ${BTN_MIX}`}>
              <Megaphone size={18} />{t('hero.cta1')}
            </Link>
            <Link
              to="/#how"
              className="btn border-2 border-lime/70 bg-white/10 text-white backdrop-blur hover:bg-lime hover:text-ink"
            >
              {t('hero.cta2')}<ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 3. Floating chips on the right keep that side lively (hidden on small screens) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute right-[8%] top-[18%] animate-float rounded-2xl bg-white/95 px-4 py-2 text-sm font-bold text-teal shadow-xl">
          {t('hero.chip')}
        </div>
        <div className="absolute bottom-[20%] right-[22%] animate-float rounded-full bg-lime p-4 text-forest shadow-xl [animation-delay:1.5s]">
          <Recycle size={28} />
        </div>
        <div className="absolute right-[4%] top-[55%] animate-float rounded-2xl bg-brand p-4 text-white shadow-xl [animation-delay:3s]">
          <Leaf size={28} />
        </div>
      </div>
    </section>
  );
}