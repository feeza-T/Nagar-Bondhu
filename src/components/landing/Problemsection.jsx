
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  HardHat,
} from 'lucide-react';

import CampaignMap from './Campaignmap';
import { useCampaignStats, districtId } from '../../hooks/Usecampaignstats';

const build = [
  { id: 'report', icon: Camera },
  { id: 'assign', icon: HardHat },
  { id: 'track', icon: CheckCircle2 },
];

export default function ProblemSection() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const stats = useCampaignStats();

  const nf = new Intl.NumberFormat(
    i18n.language?.startsWith('bn') ? 'bn-BD' : 'en-US'
  );

  const rows = Object.values(stats.data);

  const totalCampaigns = rows.reduce(
    (sum, row) => sum + row.count,
    0
  );

  const districtsCovered = new Set(
    rows.flatMap((row) =>
      row.items
        .map((item) => districtId(item.district))
        .filter(Boolean)
    )
  ).size;

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-50px' },
          transition: { duration: 0.55, delay },
        };

  return (
    <section
      aria-labelledby="problem-title"
      className="relative overflow-hidden bg-gradient-to-br from-[#06100F] via-[#0B191B] to-[#192B30] px-6 py-16 sm:py-20 lg:py-24"
    >
      {/* Background lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#DFFF80]/[0.07] blur-[110px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-[#3B8CF5]/[0.08] blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">

        {/* LEFT: Interactive Bangladesh map */}
        <motion.div
          className="order-2 min-w-0 lg:order-1"
          {...(
            reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, x: -35 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true, margin: '-70px' },
                  transition: {
                    duration: 0.7,
                    ease: 'easeOut',
                  },
                }
          )}
        >
          <CampaignMap stats={stats} />
        </motion.div>

        {/* RIGHT: Problem, solution and platform features */}
        <div className="order-1 min-w-0 lg:order-2">

          {/* Problem */}
          <motion.div {...reveal()}>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFB45E]">
              {t('problem.problemBadge')}
            </span>

            <h2
              id="problem-title"
              className="mt-4 max-w-2xl text-3xl font-black leading-[1.2] tracking-tight text-[#DFFF80] sm:text-4xl lg:text-[2.7rem]"
            >
              {t('problem.title')}
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">
              {t('problem.text')}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              {t('problem.source')}
            </p>
          </motion.div>

          {/* Visual divider */}
          <motion.div
            {...reveal(0.08)}
            className="my-9 h-px w-full max-w-lg bg-gradient-to-r from-[#DFFF80]/50 via-white/15 to-transparent"
          />

          {/* Solution */}
          <motion.div {...reveal(0.12)}>
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFB45E]">
              {t('problem.solutionBadge')}
            </span>

            <h3 className="mt-4 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#DFFF80] sm:text-3xl">
              {t('problem.solutionTitle')}
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">
              {t('problem.solutionText')}
            </p>
          </motion.div>

          {/* What we build */}
          <motion.div {...reveal(0.18)} className="mt-10">
            <h4 className="mb-6 text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFB45E]">
              {t('problem.buildTitle')}
            </h4>

            <div className="space-y-6">
              {build.map(({ id, icon: Icon }, index) => (
                <div
                  key={id}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DFFF80]/15 bg-[#DFFF80]/[0.08] text-[#DFFF80]">
                    <Icon size={20} aria-hidden />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h5 className="text-sm font-extrabold text-white">
                      {t(`problem.build.${id}.title`)}
                    </h5>

                    <p className="mt-1 text-sm leading-7 text-white/60">
                      {t(`problem.build.${id}.text`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live backend statistics */}
          {stats.status === 'ready' && (
            <motion.div
              {...reveal(0.22)}
              className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/10 pt-7"
            >
              <div>
                <p className="text-3xl font-black tabular-nums text-[#DFFF80] sm:text-4xl">
                  {nf.format(totalCampaigns)}
                </p>
                <p className="mt-1 text-xs font-medium text-white/55">
                  {t('problem.statCampaigns')}
                </p>
              </div>

              <div>
                <p className="text-3xl font-black tabular-nums text-[#FFB45E] sm:text-4xl">
                  {nf.format(districtsCovered)}
                </p>
                <p className="mt-1 text-xs font-medium text-white/55">
                  {t('problem.statDistricts')}
                </p>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div {...reveal(0.27)} className="mt-9">
            <Link
              to="/report"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#DFFF80] via-[#FFC66D] to-[#FF9B52] px-7 py-4 text-sm font-black text-[#17251C] shadow-lg shadow-[#DFFF80]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFB45E]/20"
            >
              {t('problem.ctaBtn')}

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
