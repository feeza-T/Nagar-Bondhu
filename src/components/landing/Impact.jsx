import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  HandHeart,
  Megaphone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

import Reveal from '../common/Reveal';
import Counter from '../common/Counter';

const STATS = [
  { key: 'resolved', to: 12480, Icon: CheckCircle2, color: 'text-forest', bg: 'bg-lime' },
  { key: 'volunteers', to: 3200, Icon: HandHeart, color: 'text-orange-700', bg: 'bg-orange-100' },
  { key: 'campaigns', to: 540, Icon: Megaphone, color: 'text-forest', bg: 'bg-green-100' },
  { key: 'districts', to: 64, Icon: MapPin, color: 'text-orange-700', bg: 'bg-orange-100' },
];

export default function Impact() {
  const { t } = useTranslation();

  return (
    <section id="impact" className="bg-[#F0F7E9] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}
        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              {t('impact.eyebrow')}
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#285B3D] sm:text-4xl lg:text-5xl">
              {t('impact.heading1')}
              <span className="text-[#E88A35]"> {t('impact.heading2')}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#66806A] sm:text-base">
              {t('impact.intro')}
            </p>
          </div>
        </Reveal>

        {/* Compact statistics */}
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] border border-[#DDEBD5] bg-white/85 p-5 shadow-[0_12px_40px_rgba(52,100,62,0.06)] sm:p-8">

            <div className="grid grid-cols-2 gap-y-7 sm:grid-cols-4 sm:gap-0">

              {STATS.map(({ key, to, Icon, color, bg }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 px-2 sm:justify-center sm:px-5 ${
                    i % 2 === 0 ? 'border-r border-[#E6EDE1] sm:border-r' : ''
                  } ${
                    i < 2 ? 'border-b border-[#E6EDE1] pb-6 sm:border-b-0 sm:pb-0' : ''
                  } ${
                    i >= 2 ? 'pt-6 sm:pt-0' : ''
                  } ${
                    i === 1 ? 'sm:border-r' : ''
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${bg} ${color}`}>
                    <Icon size={19} strokeWidth={2} />
                  </span>

                  <div className="min-w-0">
                    <p className="font-display text-2xl font-bold leading-none tracking-tight text-[#347449] sm:text-3xl">
                      <Counter to={to} suffix="+" />
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-[#829385] sm:text-sm">
                      {t(`impact.${key}`)}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </Reveal>

        {/* Small bottom message */}
        <Reveal delay={0.2}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="rounded-full bg-[#DDF2BD] px-3 py-1.5 text-xs font-semibold text-[#376C42]">
              {t('impact.chip')}
            </span>
            <span className="text-sm text-[#78917B]">
              {t('impact.bottom')}
            </span>
            <ArrowUpRight size={16} className="text-[#E88A35]" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}