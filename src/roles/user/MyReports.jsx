
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import useTranslatedText from '../../hooks/useTranslatedText';
import { listReports } from '../../services/wasteReportService';
import { fmtDate } from '../../utils/format';

import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import ReportProgress from './components/ReportProgress';

function ReportContent({ report }) {
  const title = useTranslatedText(report.title);
  const location = useTranslatedText(report.location);
  const adminNote = useTranslatedText(report.adminNote);

  return (
    <>
      <h2 className="font-bold text-forest">{title}</h2>

      <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
        <MapPin size={14} />
        {location}
      </p>

      {report.adminNote && (
        <div className="mt-4 rounded-xl bg-orange-50 p-3">
          <p className="text-xs font-bold text-clay">Admin Update</p>
          <p className="mt-1 text-sm text-ink/75">{adminNote}</p>
        </div>
      )}
    </>
  );
}

export default function MyReports() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const { data: reports, loading } = useFetch(
    () => listReports({ userId: user.id }),
    [user.id]
  );

  return (
    <section className="min-h-[70vh] bg-mint2 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl uppercase text-olive sm:text-4xl">
              {t('nav.myReports', 'Track My Reports')}
            </h1>
            <p className="mt-2 text-ink/65">
              {t('myReports.subtitle', 'Follow the progress of your submitted waste reports.')}
            </p>
          </div>

          <Link to="/report" className="btn btn-primary">
            <Plus size={17} />
            {t('nav.report')}
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : !reports?.length ? (
          <div className="panel py-12 text-center">
            <h2 className="text-xl font-bold text-forest">
              {t('myReports.emptyTitle', 'No reports yet')}
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              {t('myReports.emptyDescription', 'Submit your first waste report to track its progress.')}
            </p>
            <Link to="/report" className="btn btn-primary mt-5">
              {t('nav.report')}
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm font-semibold text-ink/60">
              {reports.length} {t('myReports.submitted', 'reports submitted')}
            </p>

            {reports.map((report) => (
              <article key={report.id} className="panel">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    {report.image && (
                      <img
                        src={report.image}
                        alt={report.title}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <ReportContent report={report} />

                      <p className="mt-1 text-xs text-ink/50">
                        {fmtDate(report.createdAt, i18n.language)}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={report.status} />
                </div>

                <div className="mt-6 border-t border-ink/10 pt-5">
                  <h3 className="mb-4 text-sm font-bold text-forest">
                    {t('myReports.progress', 'Report Progress')}
                  </h3>
                  <ReportProgress status={report.status} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
