import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from '../common/Reveal';

export default function CtaBanner() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-white to-mint2 px-4 pb-20 pt-4 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-forest to-olive p-10 text-center text-white sm:p-16">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lime/30 blur-2xl" />
          <h2 className="relative font-display text-4xl uppercase sm:text-6xl">{t('cta.title')}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/80">{t('cta.desc')}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn btn-lime">{t('cta.primary')}</Link>
            <Link to="/report" className="btn border-2 border-white/40 text-white hover:bg-white/10">{t('cta.secondary')}</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
