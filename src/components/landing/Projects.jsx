import { useTranslation } from 'react-i18next';
import Reveal from '../common/Reveal';

// Mixed-size gallery. Tiles are gradients now; swap the `bg` for <img> tags when you have photos.
const TILES = [
  { key: 'p1', cls: 'sm:col-span-2 sm:row-span-2', bg: 'from-forest to-olive' },
  { key: 'p2', cls: '', bg: 'from-brand to-clay' },
  { key: 'p3', cls: '', bg: 'from-lime to-teal' },
  { key: 'p4', cls: 'sm:col-span-2', bg: 'from-teal to-forest' },
  { key: 'p5', cls: '', bg: 'from-clay to-brand' },
  { key: 'p6', cls: 'sm:row-span-2', bg: 'from-olive to-lime' },
  { key: 'p7', cls: 'sm:col-span-2', bg: 'from-ink to-forest' },
];

export default function Projects() {
  const { t } = useTranslation();
  return (
    <section id="projects" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><h2 className="section-title">{t('projects.title')}</h2><p className="mt-3 max-w-xl text-ink/70">{t('projects.desc')}</p></Reveal>
        <div className="mt-10 grid auto-rows-[150px] gap-4 sm:grid-cols-4">
          {TILES.map(({ key, cls, bg }, i) => (
            <Reveal key={key} delay={(i % 4) * 0.07} className={cls}>
              <figure className={`group relative h-full overflow-hidden rounded-[1.6rem_.5rem_1.6rem_.5rem] bg-gradient-to-br ${bg}`}>
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-4 text-white transition group-hover:translate-y-0">
                  <p className="font-bold">{t(`projects.${key}.title`)}</p>
                  <p className="text-xs text-white/80">{t(`projects.${key}.place`)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
