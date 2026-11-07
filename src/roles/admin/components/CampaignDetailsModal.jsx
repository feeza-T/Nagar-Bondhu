import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  ImageIcon,
  MapPin,
  Users,
  X,
  ClipboardList,
} from 'lucide-react';

import { fmtDate } from '../../../utils/format';
import StatusBadge from '../../../components/common/StatusBadge';
import useTranslatedText from '../../../hooks/useTranslatedText';

/*
  Palette
  ink      #1B2B22   main text
  muted    #5F6F65   labels
  line     #E1E6DC   borders
  surface  #F7F8F4   panels
  green    #1F4D3A   primary
  lime     #8DB63C   accent
  orange   #E08A2E   accent
*/

const BRAND_GRADIENT = 'from-[#1F4D3A] via-[#6E9A2F] to-[#E08A2E]';

/* ---------- image helpers ---------- */

// Collects image URLs from whichever field your report uses.
// If your field is named differently, add it to the list below.
function getImages(report, campaign) {
  const sources = [
    report?.images,
    report?.photos,
    report?.image,
    report?.image_url,
    report?.imageUrl,
    report?.photo,
    report?.photo_url,
    campaign?.images,
    campaign?.image,
    campaign?.image_url,
  ];

  const urls = [];
  const push = (item) => {
    if (!item) return;
    if (Array.isArray(item)) return item.forEach(push);
    if (typeof item === 'string') return urls.push(item);
    if (typeof item === 'object') push(item.url || item.src || item.secure_url);
  };
  sources.forEach(push);

  return [...new Set(urls)];
}

function ImageGallery({ images }) {
  const [failed, setFailed] = useState(() => new Set());
  const [active, setActive] = useState(null);

  const visible = images.filter((src) => !failed.has(src));

  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation(); // close only the image, not the whole modal
        setActive(null);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [active]);

  if (visible.length === 0) return null;

  const markFailed = (src) =>
    setFailed((prev) => new Set(prev).add(src));

  return (
    <>
      <div
        className={`grid gap-2 ${
          visible.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {visible.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(src)}
            aria-label={`View report image ${i + 1}`}
            className={`group overflow-hidden rounded-lg border border-[#E1E6DC] bg-[#F7F8F4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3A] ${
              visible.length === 1 ? 'aspect-[16/9]' : 'aspect-square'
            }`}
          >
            <img
              src={src}
              alt={`Report image ${i + 1}`}
              loading="lazy"
              decoding="async"
              onError={() => markFailed(src)}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setActive(null);
          }}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={20} />
          </button>
          <img
            src={active}
            alt="Report"
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/* ---------- small building blocks ---------- */

function Field({ icon: Icon, label, children, className = '' }) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-[#E1E6DC] bg-[#F7F8F4] p-3 ${className}`}
    >
      <p className="flex items-center gap-1.5 text-xs font-medium text-[#5F6F65]">
        {Icon && <Icon size={14} className="shrink-0" />}
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-semibold text-[#1B2B22]">
        {children}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, aside, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-bold text-[#1B2B22]">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${BRAND_GRADIENT} text-white`}
          >
            <Icon size={15} />
          </span>
          <span className="truncate">{title}</span>
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/* ---------- translated content ---------- */

function CampaignTitle({ campaign }) {
  const title = useTranslatedText(campaign.title);
  return (
    <p className="mt-1 break-words text-sm leading-6 text-white/90">{title}</p>
  );
}

function CampaignInfo({ campaign, language }) {
  const meetingPoint = useTranslatedText(campaign.meetingPoint);
  const note = useTranslatedText(campaign.note);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Campaign date">{fmtDate(campaign.date, language)}</Field>
      <Field label="Start time">{campaign.time || 'Not specified'}</Field>
      <Field icon={MapPin} label="Meeting point" className="sm:col-span-2">
        {meetingPoint || 'Not specified'}
      </Field>
      {note && (
        <Field label="Description" className="sm:col-span-2">
          <span className="font-normal leading-6">{note}</span>
        </Field>
      )}
    </div>
  );
}

function ReportContent({ report, campaign }) {
  const title = useTranslatedText(report.title);
  const location = useTranslatedText(
    report.location_address || campaign.location
  );
  const description = useTranslatedText(report.description);
  const category = useTranslatedText(report.waste_category);
  const district = useTranslatedText(report.district);
  const images = getImages(report, campaign);

  return (
    <div className="rounded-lg border border-[#E1E6DC] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 break-words text-sm font-bold leading-6 text-[#1B2B22]">
          {title}
        </h4>
        <StatusBadge status={report.status} />
      </div>

      {images.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#5F6F65]">
            <ImageIcon size={14} />
            Report {images.length > 1 ? 'images' : 'image'}
          </p>
          <ImageGallery images={images} />
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Waste category">{category || 'N/A'}</Field>
        <Field label="District">{district || 'N/A'}</Field>
        <Field icon={MapPin} label="Report location" className="sm:col-span-2">
          {location || 'Not specified'}
        </Field>
      </div>

      {report.description && (
        <p className="mt-3 break-words text-sm leading-6 text-[#5F6F65]">
          {description}
        </p>
      )}

      <p className="mt-3 break-all border-t border-[#E1E6DC] pt-3 text-xs text-[#5F6F65]">
        Report ID: {campaign.reportId}
      </p>
    </div>
  );
}

/* ---------- modal ---------- */

export default function CampaignDetailsModal({
  campaign,
  workers,
  language,
  onClose,
}) {
  const isOpen = Boolean(campaign);

  // Lock background scroll and close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!campaign) return null;

  const volunteers = campaign.volunteers || [];
  const completedVolunteers = campaign.done || [];
  const needed = campaign.needed || 0;

  const name = (id) =>
    workers?.find((worker) => worker.id === id)?.name || 'Volunteer';

  const progress = needed
    ? Math.min(100, Math.round((volunteers.length / needed) * 100))
    : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-details-title"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[88dvh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className={`flex shrink-0 items-start gap-3 bg-gradient-to-r ${BRAND_GRADIENT} px-5 py-4 sm:px-6`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
            <ClipboardList size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="campaign-details-title"
              className="text-lg font-bold text-white"
            >
              Campaign Details
            </h2>
            <CampaignTitle campaign={campaign} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={18} />
          </button>
        </header>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={campaign.status} />
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1B2B22]">
                <Users size={16} className="text-[#1F4D3A]" />
                {volunteers.length} of {needed} volunteers
              </span>
            </div>

            <Section icon={CalendarDays} title="Campaign information">
              <CampaignInfo campaign={campaign} language={language} />
            </Section>

            <Section icon={Users} title="Volunteer recruitment">
              <div className="rounded-lg border border-[#E1E6DC] p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#5F6F65]">Recruitment progress</span>
                  <span className="font-bold text-[#1B2B22]">{progress}%</span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-[#E1E6DC]"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8DB63C] to-[#E08A2E]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-[#5F6F65]">
                  <span>{volunteers.length} joined</span>
                  <span>{completedVolunteers.length} marked done</span>
                  <span>{needed} target</span>
                </div>
              </div>
            </Section>

            <Section
              icon={CheckCircle2}
              title="Volunteer attendance"
              aside={
                <span className="shrink-0 rounded-full bg-[#F7F8F4] px-2.5 py-1 text-xs font-semibold text-[#5F6F65] ring-1 ring-[#E1E6DC]">
                  {volunteers.length}
                </span>
              }
            >
              {volunteers.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#CBD3C5] p-5 text-center text-sm text-[#5F6F65]">
                  No volunteers have joined this campaign yet.
                </p>
              ) : (
                <ul className="divide-y divide-[#E1E6DC] rounded-lg border border-[#E1E6DC]">
                  {volunteers.map((volunteerId) => {
                    const attended = completedVolunteers.includes(volunteerId);
                    const volunteerName = name(volunteerId);

                    return (
                      <li
                        key={volunteerId}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2D8] text-sm font-bold text-[#3F5F1C]">
                            {volunteerName.charAt(0).toUpperCase()}
                          </div>
                          <p className="truncate text-sm font-semibold text-[#1B2B22]">
                            {volunteerName}
                          </p>
                        </div>

                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            attended
                              ? 'bg-[#EAF2D8] text-[#3F5F1C]'
                              : 'bg-[#FCEBD3] text-[#8A4F0F]'
                          }`}
                        >
                          {attended ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {attended ? 'Done' : 'Joined'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>

            <Section icon={FileText} title="Linked waste report">
              {campaign.report ? (
                <ReportContent report={campaign.report} campaign={campaign} />
              ) : (
                <p className="rounded-lg border border-dashed border-[#CBD3C5] p-5 text-center text-sm text-[#5F6F65]">
                  No linked report information is available.
                </p>
              )}
            </Section>
          </div>
        </div>

        {/* Fixed footer */}
        <footer className="flex shrink-0 justify-end border-t border-[#E1E6DC] bg-white px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg bg-gradient-to-r ${BRAND_GRADIENT} px-5 py-2 text-sm font-semibold text-white hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3A] focus-visible:ring-offset-2`}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}