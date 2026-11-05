import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Camera, CalendarCheck, MapPin, ShieldCheck, Users, Languages } from 'lucide-react';
import Reveal from '../common/Reveal';

// Each feature has its own organic shape / colour so the grid does not look like a template
const FEATURES = [
  { key: 'report', Icon: Camera, shape: 'rounded-[3rem_1rem_3rem_1rem]', bg: 'bg-brand text-white', icon: 'bg-lime text-ink', span: 'lg:col-span-2' },
  { key: 'verify', Icon: ShieldCheck, shape: 'rounded-[1rem_3rem_1rem_3rem]', bg: 'bg-forest text-white', icon: 'bg-brand text-white', span: '' },
  { key: 'campaign', Icon: CalendarCheck, shape: 'rounded-[1rem_3rem_1rem_3rem]', bg: 'bg-lime text-ink', icon: 'bg-forest text-lime', span: '' },
  { key: 'map', Icon: MapPin, shape: 'rounded-[3rem_1rem_3rem_1rem]', bg: 'bg-white text-ink border-2 border-forest/15', icon: 'bg-teal text-white', span: '' },
  { key: 'team', Icon: Users, shape: 'rounded-[3rem_3rem_1rem_3rem]', bg: 'bg-mint1 text-ink', icon: 'bg-olive text-white', span: '' },
  { key: 'bangla', Icon: Languages, shape: 'rounded-[1rem_3rem_3rem_3rem]', bg: 'bg-clay text-white', icon: 'bg-cream text-clay', span: '' },
];

export default function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><h2 className="section-title max-w-2xl">{t('features.title')}</h2></Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, Icon, shape, bg, icon, span }, i) => (
            <Reveal key={key} delay={(i % 3) * 0.1} className={span}>
              <motion.div whileHover={{ y: -8, rotate: i % 2 ? 0.8 : -0.8 }} className={`h-full p-7 shadow-lg ${shape} ${bg}`}>
                <span className={`flex h-14 w-14 items-center justify-center rounded-full ${icon}`}><Icon size={26} /></span>
                <h3 className="mt-5 font-display text-3xl uppercase leading-none">{t(`features.${key}.title`)}</h3>
                <p className="mt-3 max-w-md text-sm opacity-90">{t(`features.${key}.desc`)}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
