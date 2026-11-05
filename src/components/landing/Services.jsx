import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Megaphone, Truck, Users } from 'lucide-react';
import Reveal from '../common/Reveal';

const CARDS = [
  { key: 'citizen', Icon: Megaphone, to: '/report' },
  { key: 'community', Icon: Users, to: '/signup', featured: true },
  { key: 'city', Icon: Truck, to: '/login' },
];

export default function Services() {
  const { t } = useTranslation();
  return (
    <section id="services" className="bg-gradient-to-b from-mint2 to-cream py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="section-title text-center">{t('services.title')}</h2></Reveal>
        <div className="mt-14 grid items-center gap-6 md:grid-cols-3">
          {CARDS.map(({ key, Icon, to, featured }, i) => (
            <Reveal key={key} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8 }} className={featured ? 'rounded-[2.5rem] bg-forest p-8 text-white shadow-2xl ring-4 ring-lime md:scale-105 md:py-12' : 'rounded-[2rem_.7rem_2rem_.7rem] bg-white p-8 shadow-lg'}>
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${featured ? 'bg-lime text-ink' : 'bg-brand text-white'}`}><Icon /></span>
                <h3 className="mt-5 font-display text-3xl uppercase">{t(`services.${key}.title`)}</h3>
                <p className={`mt-2 text-sm ${featured ? 'text-white/75' : 'text-ink/70'}`}>{t(`services.${key}.desc`)}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {[1, 2, 3].map((n) => <li key={n} className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${featured ? 'text-lime' : 'text-teal'}`} />{t(`services.${key}.p${n}`)}</li>)}
                </ul>
                <Link to={to} className={`btn mt-6 w-full ${featured ? 'btn-lime' : 'btn-primary'}`}>{t(`services.${key}.cta`)}</Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
