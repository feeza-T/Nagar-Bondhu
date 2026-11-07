
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Leaf,
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
import CampaignCompletionModal from './components/CampaignCompletionModal';

const ITEMS_PER_PAGE = 6;

const CARD_STYLES = [
  {
    bg: 'bg-gradient-to-br from-[#EAF2DA] to-[#DCE9C7]',
    border: 'border-[#C9DDB0]',
    accent: 'from-[#668B42] to-[#A6C66C]',
    icon: 'bg-[#F7FAEF] text-[#54783A]',
  },
  {
    bg: 'bg-gradient-to-br from-[#FFF0DE] to-[#F8E2CB]',
    border: 'border-[#F0D1B1]',
    accent: 'from-[#D88A43] to-[#F2B76C]',
    icon: 'bg-[#FFF8EF] text-[#B87536]',
  },
  {
    bg: 'bg-gradient-to-br from-[#E0EFE8] to-[#D2E7DC]',
    border: 'border-[#C1DCCE]',
    accent: 'from-[#3D8063] to-[#8BBE9B]',
    icon: 'bg-[#F2F8F3] text-[#39775C]',
  },
  {
    bg: 'bg-gradient-to-br from-[#F0EDDF] to-[#E8E2CC]',
    border: 'border-[#DDD5B8]',
    accent: 'from-[#9B8951] to-[#C5B477]',
    icon: 'bg-[#FAF8EE] text-[#887640]',
  },
  {
    bg: 'bg-gradient-to-br from-[#EDEBFA] to-[#E0DFF2]',
    border: 'border-[#D4D1EC]',
    accent: 'from-[#7770B2] to-[#AAA4D9]',
    icon: 'bg-[#F7F6FF] text-[#6F68A9]',
  },
  {
    bg: 'bg-gradient-to-br from-[#F7E9E7] to-[#F1DCD7]',
    border: 'border-[#EACBC5]',
    accent: 'from-[#B96E5E] to-[#E3A08E]',
    icon: 'bg-[#FFF5F2] text-[#A85F50]',
  },
];

const formatStatus = (status = '') =>
  status.replaceAll('_', ' ').replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

export default function AdminCampaigns() {
  const { t, i18n } = useTranslation();

  const { data, loading, reload } = useFetch(listCampaigns);
  const { data: workers } = useFetch(listWorkers);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsCampaign, setDetailsCampaign] = useState(null);

  const [modalStatus, setModalStatus] = useState('confirm');
  const [completing, setCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Search, filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const campaigns = data || [];

  const getVolunteerName = (id) =>
    workers?.find((worker) => worker.id === id)?.name || 'Volunteer';

  const statuses = useMemo(
    () => [...new Set(campaigns.map((campaign) => campaign.status).filter(Boolean))],
    [campaigns]
  );

  const filteredCampaigns = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let result = campaigns.filter((campaign) => {
      const matchesSearch =
        !query ||
        [
          campaign.title,
          campaign.meetingPoint,
          campaign.note,
          campaign.time,
          campaign.status,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'all' || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at || a.date || 0) -
          new Date(b.created_at || b.date || 0);
      }

      if (sortBy === 'volunteers') {
        return (b.volunteers?.length || 0) -
          (a.volunteers?.length || 0);
      }

      return new Date(b.created_at || b.date || 0) -
        new Date(a.created_at || a.date || 0);
    });

    return result;
  }, [campaigns, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <div className="space-y-7 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#84A83D]">
            <Leaf size={14} />
            NagarBondhu / Administration
          </p>

          <h1 className="font-display text-3xl font-bold leading-tight text-[#174B35] sm:text-4xl">
            {t('admin.campaignsTitle')}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718073]">
            {t('admin.campaignsSub')}
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#D8E5C9] bg-[#EDF4E3] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCEBC9] text-[#527A37]">
            <Users size={19} />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none text-[#174B35]">
              {campaigns.length}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#71836A]">
              Total campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <section className="rounded-2xl border border-[#DCE6D3] bg-gradient-to-r from-[#F0F5E9] via-[#F7F6E9] to-[#FCEFE2] p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-[#527A37]" />
          <h2 className="text-sm font-bold text-[#174B35]">
            Find a campaign
          </h2>
          <span className="ml-auto text-xs text-[#829080]">
            {filteredCampaigns.length} results
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(160px,1fr)_minmax(160px,1fr)]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82917D]"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, location, or details..."
              className="h-12 w-full rounded-xl border border-[#D7E1CF] bg-[#FFFFFF]/75 pl-10 pr-10 text-sm text-[#294C37] outline-none transition placeholder:text-[#9AA594] focus:border-[#83A94A] focus:ring-2 focus:ring-[#83A94A]/15"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82917D] hover:text-[#174B35]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#D7E1CF] bg-[#FFFFFF]/75 px-3 text-sm font-medium text-[#45634D] outline-none focus:border-[#83A94A] focus:ring-2 focus:ring-[#83A94A]/15"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82917D]"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-[#D7E1CF] bg-[#FFFFFF]/75 pl-10 pr-3 text-sm font-medium text-[#45634D] outline-none focus:border-[#83A94A] focus:ring-2 focus:ring-[#83A94A]/15"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="volunteers">Most volunteers</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSortBy('newest');
            }}
            className="mt-3 text-xs font-bold text-[#638344] transition hover:text-[#174B35]"
          >
            Clear filters
          </button>
        )}
      </section>

      {/* Campaign list heading */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#174B35]">
            Campaign overview
          </h2>
          <p className="mt-1 text-xs text-[#8A9789]">
            Showing {filteredCampaigns.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            {' – '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)}
            {' '}of {filteredCampaigns.length} campaigns
          </p>
        </div>
      </div>

      {/* Empty state */}
      {filteredCampaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#BFD1AD] bg-gradient-to-br from-[#EFF5E6] to-[#F9F0E5] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDEBCB] text-[#527A37]">
            <CalendarDays size={26} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-[#174B35]">
            {campaigns.length === 0
              ? t('admin.noCampaigns')
              : 'No matching campaigns'}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819080]">
            {campaigns.length === 0
              ? 'Campaigns created from confirmed waste reports will appear here.'
              : 'Try changing your search or filters to find a campaign.'}
          </p>

          {campaigns.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('newest');
              }}
              className="mt-5 rounded-xl bg-[#174B35] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#103A29]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Campaign cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {paginatedCampaigns.map((campaign, index) => {
              const volunteers = campaign.volunteers || [];
              const completedVolunteers = campaign.done || [];

              const percentage = campaign.needed
                ? Math.min(
                    100,
                    Math.round((volunteers.length / campaign.needed) * 100)
                  )
                : 0;

              const isCompleted = campaign.status === 'completed';

              const canComplete = [
                'open',
                'ongoing',
                'pending_verification',
              ].includes(campaign.status);

              const style = CARD_STYLES[
                ((currentPage - 1) * ITEMS_PER_PAGE + index) % CARD_STYLES.length
              ];

              return (
                <article
                  key={campaign.id}
                  className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border ${style.border} ${style.bg} shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  {/* Card accent */}
                  <div className={`h-1.5 bg-gradient-to-r ${style.accent}`} />

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    {/* Title and status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#7D8C77]">
                          Volunteer campaign
                        </p>

                        <h3 className="break-words text-base font-extrabold leading-snug text-[#214B35] sm:text-lg">
                          {campaign.title}
                        </h3>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={campaign.status} />
                      </div>
                    </div>

                    {/* Campaign information */}
                    <div className="mt-4 grid gap-3 rounded-xl border border-white/60 bg-white/35 p-3 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                          <CalendarDays size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-[#829080]">
                            Date
                          </p>
                          <p className="break-words text-xs font-bold text-[#3F5946]">
                            {fmtDate(campaign.date, i18n.language)}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                          <Clock size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-[#829080]">
                            Time
                          </p>
                          <p className="break-words text-xs font-bold text-[#3F5946]">
                            {campaign.time || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5 sm:col-span-2">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                          <MapPin size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-[#829080]">
                            Meeting point
                          </p>
                          <p className="break-words text-xs font-bold leading-5 text-[#3F5946]">
                            {campaign.meetingPoint || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Campaign note */}
                    {campaign.note && (
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#718071]">
                        {campaign.note}
                      </p>
                    )}

                    {/* Volunteer progress */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#31563D]">
                          <Users size={15} />
                          Volunteer progress
                        </div>

                        <span className="text-xs font-extrabold text-[#31563D]">
                          {volunteers.length}/{campaign.needed || 0}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/70">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${style.accent} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between gap-2 text-[10px] font-medium text-[#829080]">
                        <span>{completedVolunteers.length} completed</span>
                        <span>{percentage}% of target</span>
                      </div>
                    </div>

                    {/* Volunteer list */}
                    <div className="mt-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#829080]">
                        Joined volunteers
                      </p>

                      {volunteers.length === 0 ? (
                        <p className="rounded-lg border border-white/50 bg-white/35 px-3 py-2.5 text-xs text-[#899487]">
                          {t('admin.noVolunteers')}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {volunteers.slice(0, 4).map((id) => {
                            const isDone = completedVolunteers.includes(id);

                            return (
                              <span
                                key={id}
                                className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-[#D9EEDB] text-[#39734A]'
                                    : 'border border-white/60 bg-white/55 text-[#5E7160]'
                                }`}
                              >
                                {isDone && <CheckCircle2 size={11} />}
                                <span className="truncate">
                                  {getVolunteerName(id)}
                                </span>
                              </span>
                            );
                          })}

                          {volunteers.length > 4 && (
                            <span className="rounded-full bg-white/55 px-2.5 py-1.5 text-[10px] font-bold text-[#718071]">
                              +{volunteers.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-1 gap-2.5 pt-5 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setDetailsCampaign(campaign)}
                        className="group flex items-center justify-center gap-2 rounded-xl border border-[#174B35]/10 bg-gradient-to-r from-[#174B35] via-[#477B3D] to-[#E99A43] px-3 py-3 text-xs font-bold text-white shadow-md shadow-[#174B35]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#174B35]/25 active:translate-y-0"  >
                        <Eye
                          size={15}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        View Details
                      </button>

                      {isCompleted ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-[#B9D9BD] bg-[#E0F0DF] px-3 py-3 text-xs font-bold text-[#39734A]">
                          <CheckCircle2 size={15} />
                          {t('admin.campaignDone', {
                            n: completedVolunteers.length,
                          })}
                        </div>
                      ) : canComplete ? (
                        <button
                          type="button"
                          onClick={() => openCompletionModal(campaign)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-[#D8B77F]/60 bg-[#F8E5C8] px-3 py-3 text-xs font-bold text-[#80552B] transition hover:bg-[#F3D9B1] active:scale-[0.98]"
                        >
                          <CheckCircle2 size={15} />
                          {t('admin.completeCampaign')}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl bg-white/40 px-3 py-3 text-xs font-semibold text-[#899487]">
                          No action available
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#DCE6D3] bg-[#F2F6EB] px-4 py-4 sm:flex-row">
              <p className="text-xs font-medium text-[#758473]">
                Page <span className="font-bold text-[#31563D]">{currentPage}</span>
                {' '}of <span className="font-bold text-[#31563D]">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="flex h-9 items-center gap-1 rounded-lg border border-[#D2DEC8] bg-white/70 px-3 text-xs font-bold text-[#426344] transition hover:bg-[#E3EDD9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, visiblePages) => (
                      <span key={page} className="contents">
                        {index > 0 && page - visiblePages[index - 1] > 1 && (
                          <span className="px-1 text-xs text-[#879583]">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? 'page' : undefined}
                          className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                            currentPage === page
                              ? 'bg-[#174B35] text-white shadow-sm'
                              : 'border border-[#D2DEC8] bg-white/70 text-[#557052] hover:bg-[#E3EDD9]'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="flex h-9 items-center gap-1 rounded-lg border border-[#D2DEC8] bg-white/70 px-3 text-xs font-bold text-[#426344] transition hover:bg-[#E3EDD9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
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
