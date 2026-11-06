
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Users,
} from 'lucide-react';

import useFetch from '../../hooks/useFetch';
import {
  completeCampaign,
  listCampaigns,
} from '../../services/campaignService';
import { listWorkers } from '../../services/userService';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

import CampaignDetailsModal from './components/CampaignDetailsModal';
import CampaignCompletionModal from './components/CampaignModal';

export default function AdminCampaigns() {
  const { t, i18n } = useTranslation();

  const { data, loading, reload } = useFetch(listCampaigns);
  const { data: workers } = useFetch(listWorkers);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsCampaign, setDetailsCampaign] = useState(null);

  const [modalStatus, setModalStatus] = useState('confirm');
  const [completing, setCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const campaigns = data || [];

  const getVolunteerName = (id) =>
    workers?.find((worker) => worker.id === id)?.name || 'Volunteer';

  const openCompletionModal = (campaign) => {
    setSelectedCampaign(campaign);
    setModalStatus('confirm');
    setErrorMessage('');
  };

  const closeCompletionModal = () => {
    if (completing) return;

    setSelectedCampaign(null);
    setModalStatus('confirm');
    setErrorMessage('');
  };

  const handleComplete = async () => {
    if (!selectedCampaign || completing) return;

    setCompleting(true);
    setErrorMessage('');

    try {
      const result = await completeCampaign(selectedCampaign.id);

      if (result?.error) {
        throw result.error;
      }

      await reload();
      setModalStatus('success');
    } catch (error) {
      console.error('Campaign completion failed:', error);
      setErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      );
      setModalStatus('error');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-7">
      {/* Page heading */}
     <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
  <div className="min-w-0 flex-1">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#84A83D]">
      NagarBondhu / Administration
    </p>

    <h1 className="font-display text-3xl font-bold leading-tight tracking-normal text-[#174B35] sm:text-4xl">
      {t('admin.campaignsTitle')}
    </h1>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
      {t('admin.campaignsSub')}
    </p>
  </div>

  <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#174B35]/10 bg-white px-4 py-3 shadow-sm">
    <Users size={18} className="text-[#84A83D]" />
    <span className="whitespace-nowrap text-sm font-semibold text-[#174B35]">
      {campaigns.length} Campaigns
    </span>
  </div>
</div>

      {/* Empty state */}
      {campaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#174B35]/20 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174B35]/5 text-[#174B35]">
            <CalendarDays size={26} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-[#174B35]">
            {t('admin.noCampaigns')}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Campaigns created from confirmed waste reports will appear here.
          </p>
        </div>
      ) : (
        /* Campaign cards */
        <div className="grid gap-5 xl:grid-cols-2">
          {campaigns.map((campaign) => {
            const volunteers = campaign.volunteers || [];
            const completedVolunteers = campaign.done || [];

            const percentage = campaign.needed
              ? Math.min(
                  100,
                  Math.round(
                    (volunteers.length / campaign.needed) * 100
                  )
                )
              : 0;

            const isCompleted = campaign.status === 'completed';

            const canComplete = [
              'open',
              'ongoing',
              'pending_verification',
            ].includes(campaign.status);

            return (
              <article
                key={campaign.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Card accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#174B35] via-[#84A83D] to-[#E99A43]" />

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Title and status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                        Volunteer campaign
                      </p>

                      <h2 className="text-lg font-bold leading-snug text-[#174B35]">
                        {campaign.title}
                      </h2>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge status={campaign.status} />
                    </div>
                  </div>

                  {/* Campaign information */}
                  <div className="mt-5 grid gap-3 rounded-xl bg-[#F7F9F5] p-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#174B35]">
                        <CalendarDays size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-400">
                          Date
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          {fmtDate(campaign.date, i18n.language)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#174B35]">
                        <Clock size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-400">
                          Time
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          {campaign.time || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#174B35]">
                        <MapPin size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-400">
                          Meeting point
                        </p>
                        <p className="break-words text-sm font-semibold text-gray-700">
                          {campaign.meetingPoint || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Campaign note */}
                  {campaign.note && (
                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      {campaign.note}
                    </p>
                  )}

                  {/* Volunteer progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#174B35]">
                        <Users size={16} />
                        Volunteer progress
                      </div>

                      <span className="text-sm font-bold text-[#174B35]">
                        {volunteers.length}/{campaign.needed}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#174B35] to-[#91B84D] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>{completedVolunteers.length} completed</span>
                      <span>{percentage}% of target</span>
                    </div>
                  </div>

                  {/* Volunteer list */}
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Joined volunteers
                    </p>

                    {volunteers.length === 0 ? (
                      <p className="rounded-lg bg-gray-50 px-3 py-3 text-xs text-gray-400">
                        {t('admin.noVolunteers')}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {volunteers.map((id) => {
                          const isDone = completedVolunteers.includes(id);

                          return (
                            <span
                              key={id}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {isDone && <CheckCircle2 size={13} />}
                              {getVolunteerName(id)}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
                   <button
  type="button"
  onClick={() => setDetailsCampaign(campaign)}
  className="group flex items-center justify-center gap-2 rounded-xl border border-[#174B35]/10 bg-gradient-to-r from-[#174B35] via-[#477B3D] to-[#E99A43] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#174B35]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#174B35]/25 active:translate-y-0"
>
  <Eye
    size={17}
    className="transition-transform duration-300 group-hover:scale-110"
  />
  View Details
</button>

                    {isCompleted ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        <CheckCircle2 size={17} />
                        {t('admin.campaignDone', {
                          n: completedVolunteers.length,
                        })}
                      </div>
                    ) : canComplete ? (
                      <button
                        type="button"
                        onClick={() => openCompletionModal(campaign)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#174B35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#103A29]"
                      >
                        <CheckCircle2 size={17} />
                        {t('admin.completeCampaign')}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-400">
                        No action available
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Campaign completion modal */}
      <CampaignCompletionModal
        campaign={selectedCampaign}
        status={modalStatus}
        completing={completing}
        errorMessage={errorMessage}
        onClose={closeCompletionModal}
        onComplete={handleComplete}
        onRetry={() => {
          setModalStatus('confirm');
          setErrorMessage('');
        }}
      />

      {/* Campaign details modal */}
      <CampaignDetailsModal
        campaign={detailsCampaign}
        workers={workers}
        language={i18n.language}
        onClose={() => setDetailsCampaign(null)}
      />
    </div>
  );
}
