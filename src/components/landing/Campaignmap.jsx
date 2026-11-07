import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';

import { MAP, DIVISIONS } from '../../components/data/Bdmapdata';
import { districtId } from '../../hooks/Usecampaignstats';

/* label position as a fraction of the map box [x, y] */
const LABELS = {
  rangpur: [0.1, 0.12],
  rajshahi: [0.1, 0.4],
  khulna: [0.1, 0.7],
  barishal: [0.4, 0.94],
  mymensingh: [0.62, 0.05],
  sylhet: [0.9, 0.3],
  dhaka: [0.9, 0.52],
  chattogram: [0.9, 0.76],
};

const STATUS_CLS = {
  completed: 'bg-[#DFFF80] text-[#1F3D2A]',
  ongoing: 'bg-[#FFB45E] text-[#5A3000]',
  upcoming: 'bg-[#9CC8FF] text-[#12315C]',
};

export default function CampaignMap({ stats }) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();

  const [hover, setHover] = useState(null); // { div, district }
  const [pinned, setPinned] = useState(null); // division id (tap / click)

  const lang = i18n.language?.startsWith('bn') ? 'bn' : 'en';
  const nf = new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US');
  const fmtDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
  };

  const activeId = hover?.div ?? pinned;
  const active = DIVISIONS.find((d) => d.id === activeId);
  const hoveredDistrict = hover?.district
    ? active?.districts.find((d) => d.id === hover.district)
    : null;

  const countOf = (id) => stats.data[id]?.count ?? 0;

  /* draw the active division last so its outline sits on top */
  const ordered = useMemo(
    () =>
      activeId
        ? [...DIVISIONS.filter((d) => d.id !== activeId), DIVISIONS.find((d) => d.id === activeId)]
        : DIVISIONS,
    [activeId]
  );

  const enter = (div, district = null) => setHover({ div, district });

  /* campaigns shown in the panel */
  const allItems = active ? stats.data[active.id]?.items ?? [] : [];
  const items = hoveredDistrict
    ? allItems.filter((it) => districtId(it.district) === hoveredDistrict.id)
    : allItems;

  const name = (d) => (lang === 'bn' ? d.bn : d.en);

  return (
    <div>
      {/* ---------- map ---------- */}
      <div
        className="relative mx-auto w-full max-w-[46rem]"
        style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${MAP.width} ${MAP.height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={t('map.aria')}
        >
          {ordered.map((dv) => {
            const on = dv.id === activeId;
            return (
              <g key={dv.id} className="cursor-pointer" onClick={() => setPinned(dv.id)}>
                {dv.districts.map((dd) => (
                  <path
                    key={dd.id}
                    d={dd.d}
                    fill={dv.color}
                    fillOpacity={on ? 0.92 : activeId ? 0.16 : 0.3}
                    stroke="#A9C4D4"
                    strokeOpacity={on ? 0.7 : 0.4}
                    strokeWidth={0.8}
                    style={{ transition: 'fill-opacity .25s ease' }}
                    onMouseEnter={() => enter(dv.id, dd.id)}
                  />
                ))}
                <path
                  d={dv.outline}
                  fill="none"
                  stroke={on ? '#FFFFFF' : '#8FB4C4'}
                  strokeOpacity={on ? 1 : 0.45}
                  strokeWidth={on ? 2.4 : 1.2}
                  pointerEvents="none"
                  style={on ? { filter: `drop-shadow(0 0 8px ${dv.color})` } : undefined}
                />
              </g>
            );
          })}

          {/* leader lines + pins */}
          {DIVISIONS.map((dv) => {
            const [lx, ly] = LABELS[dv.id];
            const [px, py] = dv.pin;
            const on = dv.id === activeId;
            return (
              <g key={`pin-${dv.id}`} pointerEvents="none">
                <line
                  x1={px}
                  y1={py}
                  x2={lx * MAP.width}
                  y2={ly * MAP.height}
                  stroke={dv.color}
                  strokeOpacity={on ? 0.9 : 0.5}
                  className="hidden md:block"
                />
                {on && !reduceMotion && (
                  <circle cx={px} cy={py} r="6" fill="none" stroke={dv.color} strokeWidth="2">
                    <animate attributeName="r" values="6;18" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={px} cy={py} r="10" fill={dv.color} fillOpacity="0.25" />
                <circle cx={px} cy={py} r="6" fill={dv.color} stroke="#fff" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {/* floating labels (desktop / tablet) */}
        {DIVISIONS.map((dv) => {
          const [lx, ly] = LABELS[dv.id];
          const on = dv.id === activeId;
          return (
            <button
              key={dv.id}
              type="button"
              onMouseEnter={() => enter(dv.id)}
              onFocus={() => enter(dv.id)}
              onBlur={() => setHover(null)}
              onClick={() => setPinned(dv.id)}
              style={{
                left: `${lx * 100}%`,
                top: `${ly * 100}%`,
                borderColor: dv.color,
                boxShadow: on ? `0 0 26px ${dv.color}66` : undefined,
              }}
              className={`absolute hidden min-w-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[#0D1524]/90 px-3 py-2 text-left backdrop-blur transition md:block ${
                on ? 'scale-105 bg-[#13203A]' : ''
              }`}
            >
              <span className="block text-sm font-extrabold text-white">{name(dv)}</span>
              <span className="block text-xs text-white/60">
                {t('map.campaigns', { n: nf.format(countOf(dv.id)) })}
              </span>
            </button>
          );
        })}
      </div>

      {/* division chips (mobile) */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
        {DIVISIONS.map((dv) => (
          <button
            key={dv.id}
            type="button"
            onClick={() => setPinned(dv.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              pinned === dv.id ? 'bg-white text-[#0D1524]' : 'bg-white/5 text-white'
            }`}
            style={{ borderColor: dv.color }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: dv.color }} />
            {name(dv)}
          </button>
        ))}
      </div>

      {/* ---------- details ---------- */}
      <div
        aria-live="polite"
        className="mt-6 min-h-[11.5rem] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
      >
        {stats.status === 'error' && (
          <p className="text-sm text-[#F28B82]">{t('map.error')}</p>
        )}

        {stats.status !== 'error' && !active && (
          <p className="text-sm text-white/60">
            {stats.status === 'loading' ? t('map.loading') : t('map.hint')}
          </p>
        )}

        {stats.status !== 'error' && active && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: active.color }} />
              <h4 className="text-lg font-black text-white">{name(active)}</h4>
              <span className="rounded-full bg-[#DFFF80] px-2.5 py-0.5 text-xs font-black text-[#1F3D2A]">
                {t('map.campaigns', { n: nf.format(countOf(active.id)) })}
              </span>
              {hoveredDistrict && (
                <span className="text-sm font-bold text-[#FFB45E]">· {name(hoveredDistrict)}</span>
              )}
            </div>

            {items.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">
                {hoveredDistrict
                  ? t('map.noneInDistrict', { name: name(hoveredDistrict) })
                  : t('map.none')}
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {items.slice(0, 4).map((it, i) => (
                  <li key={it.id ?? i} className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-white">{it.title}</span>
                      <span className="block text-xs text-white/55">
                        {[it.district, fmtDate(it.date)].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    {it.status && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black ${
                          STATUS_CLS[it.status] || 'bg-white/15 text-white'
                        }`}
                      >
                        {t(`map.status.${it.status}`, { defaultValue: it.status })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}