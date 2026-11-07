
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, MapPin, Megaphone, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  MapContainer,
  TileLayer,
  Marker,
} from 'react-leaflet';
import L from 'leaflet';

import useFetch from '../../hooks/useFetch';
import useTranslatedText from '../../hooks/useTranslatedText';

import {
  listReports,
  updateReportStatus,
} from '../../services/wasteReportService';

import { REPORT_STATUSES } from '../../utils/constants';
import { fmtDate } from '../../utils/format';

import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import CampaignModal from './components/CampaignModal';

// Leaflet marker icon
const reportMarkerIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Check whether report coordinates are valid
function hasValidCoordinates(report) {
  return (
    report.latitude !== null &&
    report.latitude !== undefined &&
    report.longitude !== null &&
    report.longitude !== undefined &&
    Number.isFinite(Number(report.latitude)) &&
    Number.isFinite(Number(report.longitude)) &&
    Number(report.latitude) >= -90 &&
    Number(report.latitude) <= 90 &&
    Number(report.longitude) >= -180 &&
    Number(report.longitude) <= 180
  );
}

// Displays the reported waste location on a map
function ReportLocationMap({ report }) {
  if (!hasValidCoordinates(report)) {
    return (
      <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-ink/50">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          Location coordinates are not available for this report.
        </div>
      </div>
    );
  }

  const position = [
    Number(report.latitude),
    Number(report.longitude),
  ];

  return (
    <div className="mt-4 space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-olive">
        <MapPin size={16} />
        Report Location
      </h3>

      <div className="overflow-hidden rounded-xl border border-ink/10">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={false}
          dragging={true}
          className="h-[220px] w-full"
          style={{ minHeight: '220px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
            icon={reportMarkerIcon}
          />
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink/50">
        <span>
          Latitude: {position[0].toFixed(6)}
        </span>

        <span>
          Longitude: {position[1].toFixed(6)}
        </span>

        <a
          href={`https://www.openstreetmap.org/?mlat=${position[0]}&mlon=${position[1]}#map=18/${position[0]}/${position[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-olive underline"
        >
          Open full map
        </a>
      </div>
    </div>
  );
}

// Translates user-generated report content according to selected language.
function TranslatedReportContent({ report }) {
  const title = useTranslatedText(report.title);
  const location = useTranslatedText(report.location);
  const description = useTranslatedText(report.description);

  return (
    <>
      <h2 className="font-bold">{title}</h2>

      <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
        <MapPin size={14} />
        {location}
      </p>

      <p className="mt-2 text-sm">{description}</p>
    </>
  );
}

// Admin reviews reports, confirms them, then creates campaigns.
export default function AdminReports() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);

  const { data, loading, reload } = useFetch(listReports);

  const act = async (id, status) => {
    await updateReportStatus(id, status);
    reload();
  };

  const list = (data || []).filter(
    (report) => filter === 'all' || report.status === filter
  );

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="font-display text-4xl uppercase text-olive">
          {t('admin.reportsTitle')}
        </h1>

        <p className="text-ink/65">
          {t('admin.reportsSub')}
        </p>
      </div>

      {/* Report filters */}
      <div className="flex flex-wrap gap-2">
        {['all', ...REPORT_STATUSES].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={`btn btn-sm ${
              filter === status ? 'btn-dark' : 'btn-outline'
            }`}
          >
            {status === 'all'
              ? t('common.all')
              : t(`status.${status}`)}
          </button>
        ))}
      </div>

      {/* Report list */}
      {loading ? (
        <Spinner />
      ) : !list.length ? (
        <p className="panel text-center text-ink/60">
          {t('admin.noReports')}
        </p>
      ) : (
        <ul className="space-y-4">
          {list.map((report) => (
            <li key={report.id} className="panel">

              <div className="flex flex-wrap gap-4">

                {/* Report photo */}
                {report.image ? (
                  <img
                    src={report.image}
                    alt={t('report.photoAlt')}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-surface text-xs text-ink/40">
                    {t('admin.noPhoto')}
                  </div>
                )}

                {/* Report information */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">
                    <TranslatedReportContent report={report} />

                    <StatusBadge status={report.status} />
                  </div>

                  {/* Static translated area and category */}
                  <p className="mt-1 text-sm text-ink/60">
                    {t(`areas.${report.area}`)}
                  </p>

                  {/* Report metadata */}
                  <p className="mt-2 text-xs text-ink/50">
                    {t('admin.by', { name: report.userName })}
                    {' · '}
                    {t(`report.cat.${report.category}`)}
                    {' · '}
                    {fmtDate(report.createdAt, i18n.language)}
                  </p>

                </div>
              </div>

              {/* Report location map */}
              <ReportLocationMap report={report} />

              {/* Admin actions */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">

                {report.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => act(report.id, 'confirmed')}
                    >
                      <Check size={15} />
                      {t('admin.confirm')}
                    </button>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => act(report.id, 'rejected')}
                    >
                      <X size={15} />
                      {t('admin.reject')}
                    </button>
                  </>
                )}

                {report.status === 'confirmed' && (
                  <button
                    className="btn btn-lime btn-sm"
                    onClick={() => setModal(report)}
                  >
                    <Megaphone size={15} />
                    {t('admin.createCampaign')}
                  </button>
                )}

                {report.status === 'campaign' && (
                  <Link
                    to="/admin/campaigns"
                    className="btn btn-outline btn-sm"
                  >
                    {t('admin.viewCampaign')}
                  </Link>
                )}

              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Campaign creation modal */}
      {modal && (
        <CampaignModal
          report={modal}
          onClose={() => setModal(null)}
          onCreated={() => {
            setModal(null);
            reload();
          }}
        />
      )}

    </div>
  );
}
