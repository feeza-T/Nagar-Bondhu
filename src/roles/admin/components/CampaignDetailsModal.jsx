
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MapPinned,
  Users,
  X,
  ClipboardList,
} from 'lucide-react';

import { fmtDate } from '../../../utils/format';
import StatusBadge from '../../../components/common/StatusBadge';

export default function CampaignDetailsModal({
  campaign,
  workers,
  language,
  onClose,
}) {
  if (!campaign) return null;

  const name = (id) =>
    workers?.find((worker) => worker.id === id)?.name || 'Volunteer';

  const progress = campaign.needed
    ? Math.min(
        100,
        Math.round((campaign.volunteers.length / campaign.needed) * 100)
      )
    : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-details-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-[#123D2B] px-6 py-7 text-white">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-lime-300/10" />
          <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/5" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-300">
              <ClipboardList size={26} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              NagarBondhu / Admin
            </p>

            <h2
              id="campaign-details-title"
              className="mt-2 pr-8 text-2xl font-bold"
            >
              Campaign Details
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {campaign.title}
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={campaign.status} />
              <span className="text-sm font-semibold text-ink/60">
                {campaign.volunteers.length} of {campaign.needed} volunteers
              </span>
            </div>

            {/* Campaign information */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-[#174B35]">
                <CalendarDays size={18} />
                Campaign Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-xs text-ink/50">Campaign date</p>
                  <p className="mt-1 text-sm font-semibold">
                    {fmtDate(campaign.date, language)}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-xs text-ink/50">Start time</p>
                  <p className="mt-1 text-sm font-semibold">
                    {campaign.time}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface p-4 sm:col-span-2">
                  <p className="flex items-center gap-1 text-xs text-ink/50">
                    <MapPin size={13} />
                    Meeting point
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {campaign.meetingPoint}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface p-4 sm:col-span-2">
                  <p className="text-xs text-ink/50">
                    Campaign description
                  </p>
                  <p className="mt-1 text-sm leading-6">
                    {campaign.note || 'No description provided.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Recruitment progress */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-[#174B35]">
                <Users size={18} />
                Volunteer Recruitment
              </h3>

              <div className="rounded-2xl border border-ink/10 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-ink/60">
                    Recruitment progress
                  </span>
                  <span className="text-sm font-bold text-[#174B35]">
                    {progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-[#174B35] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-ink/50">
                  {campaign.volunteers.length} joined · {campaign.done.length}{' '}
                  marked attendance · {campaign.needed} target
                </p>
              </div>
            </section>

            {/* Volunteer attendance */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-[#174B35]">
                <Users size={18} />
                Volunteer Attendance
              </h3>

              {campaign.volunteers.length === 0 ? (
                <div className="rounded-2xl bg-surface p-5 text-center text-sm text-ink/50">
                  No volunteers have joined this campaign yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {campaign.volunteers.map((volunteerId) => {
                    const attended = campaign.done.includes(volunteerId);

                    return (
                      <div
                        key={volunteerId}
                        className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#174B35]/10 font-bold text-[#174B35]">
                            {name(volunteerId).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {name(volunteerId)}
                            </p>
                            <p className="text-xs text-ink/50">Volunteer</p>
                          </div>
                        </div>

                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                            attended
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {attended ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Clock size={13} />
                          )}
                          {attended ? 'Done' : 'Joined'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Linked waste report */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-[#174B35]">
                <FileText size={18} />
                Linked Waste Report
              </h3>

              {campaign.report ? (
                <div className="rounded-2xl border border-[#174B35]/15 bg-[#174B35]/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold leading-6">
                      {campaign.report.title}
                    </h4>
                    <StatusBadge status={campaign.report.status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-ink/50">Waste category</p>
                      <p className="mt-1 text-sm font-semibold">
                        {campaign.report.waste_category || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink/50">District</p>
                      <p className="mt-1 text-sm font-semibold">
                        {campaign.report.district || 'N/A'}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="flex items-center gap-1 text-xs text-ink/50">
                        <MapPinned size={13} />
                        Report location
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {campaign.report.location_address || campaign.location}
                      </p>
                    </div>
                  </div>

                  {campaign.report.description && (
                    <div className="mt-4 border-t border-ink/10 pt-3">
                      <p className="text-xs text-ink/50">
                        Report description
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink/70">
                        {campaign.report.description}
                      </p>
                    </div>
                  )}

                  <p className="mt-4 break-all text-[11px] text-ink/40">
                    Report ID: {campaign.reportId}
                  </p>
                </div>
              ) : (
                <p className="rounded-2xl bg-surface p-4 text-sm text-ink/50">
                  No linked report information is available.
                </p>
              )}
            </section>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-[#174B35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#103A29]"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
