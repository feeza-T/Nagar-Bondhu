import { useTranslation } from 'react-i18next';
import { Camera, CalendarCheck, HandHeart, PartyPopper, ShieldCheck } from 'lucide-react';
import Reveal from '../common/Reveal';

// These 5 steps are the same flow as the real demo: citizen -> admin -> campaign -> volunteers -> cleaned
const STEPS = [
  { key: 'report', Icon: Camera },
  { key: 'confirm', Icon: ShieldCheck },
  { key: 'campaign', Icon: CalendarCheck },
  { key: 'join', Icon: HandHeart },
  { key: 'clean', Icon: PartyPopper },
];

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how" className="bg-gradient-to-b from-forest to-[#1b3322] py-20 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal><h2 className="font-display text-4xl uppercase text-lime sm:text-6xl">{t('how.title')}</h2></Reveal>
        <ol className="relative mt-14 space-y-10 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-0.5 before:bg-lime/30 md:before:left-1/2">
          {STEPS.map(({ key, Icon }, i) => {
            const left = i % 2 === 0;
            return (
              <li key={key} className="relative grid items-center gap-6 pl-14 md:grid-cols-2 md:pl-0">
                <span className="absolute left-0 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold md:left-1/2 md:-translate-x-1/2">{i + 1}</span>
                <Reveal x={left ? -40 : 40} className={`md:px-10 ${left ? '' : 'md:order-2'}`}>
                  <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                    <Icon className="text-lime" />
                    <h3 className="mt-3 text-xl font-bold">{t(`how.${key}.title`)}</h3>
                    <p className="mt-1 text-sm text-white/75">{t(`how.${key}.desc`)}</p>
                  </div>
                </Reveal>
                {/* Opposite side: empty slot for an image/illustration you add later */}
                <div className={`hidden h-36 items-center justify-center rounded-3xl border-2 border-dashed border-white/20 text-xs text-white/40 md:flex ${left ? '' : 'md:order-1'}`}>{t('how.imageSlot')}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
