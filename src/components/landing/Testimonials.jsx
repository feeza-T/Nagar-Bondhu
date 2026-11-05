import { useTranslation } from 'react-i18next';
import { Quote } from 'lucide-react';
import Reveal from '../common/Reveal';

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="section-title">{t('testimonials.title')}</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 0.08}>
              <figure className={`h-full p-7 ${n === 2 ? 'rounded-[2rem] bg-lime' : 'rounded-[2rem_.6rem_2rem_.6rem] bg-surface'}`}>
                <Quote className="text-brand" />
                <blockquote className="mt-3 text-ink/85">{t(`testimonials.t${n}.text`)}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest font-bold text-lime">{t(`testimonials.t${n}.name`)[0]}</span>
                  <span><b className="block text-sm">{t(`testimonials.t${n}.name`)}</b><span className="text-xs text-ink/60">{t(`testimonials.t${n}.role`)}</span></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
