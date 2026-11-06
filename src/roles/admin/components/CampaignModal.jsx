
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';

export default function CampaignCompletionModal({
  campaign,
  status,
  completing,
  errorMessage,
  onClose,
  onComplete,
  onRetry,
}) {
  if (!campaign) return null;

  const volunteers = campaign.volunteers || [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-title"
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-[#123D2B] px-6 py-7 text-white">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-lime-300/10" />

          {!completing && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          )}

          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-300">
              {status === 'success' ? (
                <CheckCircle2 size={26} />
              ) : status === 'error' ? (
                <AlertTriangle size={26} />
              ) : (
                <Sparkles size={26} />
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              NagarBondhu / Admin
            </p>

            <h2 id="completion-title" className="mt-2 text-2xl font-bold">
              {status === 'success'
                ? 'Campaign completed!'
                : status === 'error'
                  ? 'Completion failed'
                  : 'Complete campaign?'}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {campaign.title}
            </p>
          </div>
        </div>

        <div className="p-6">
          {status === 'confirm' && (
            <>
              <p className="text-sm leading-6 text-gray-600">
                Confirm that the cleanup activity has been completed and
                verified. The campaign will close, and its linked waste
                report will be marked as resolved.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Final verification
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      {volunteers.length} of {campaign.needed} volunteers
                      joined. Reaching the volunteer target is not required
                      to complete the campaign.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={completing}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onComplete}
                  disabled={completing}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#174B35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#103A29] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {completing ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Complete
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="rounded-2xl bg-emerald-50 p-5 text-center">
                <CheckCircle2
                  size={40}
                  className="mx-auto text-emerald-600"
                />
                <p className="mt-3 font-bold text-emerald-900">
                  Successfully completed
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  The campaign is closed and its linked report has been
                  marked as resolved.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-[#174B35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#103A29]"
              >
                Done
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
                {errorMessage || 'Something went wrong. Please try again.'}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-xl bg-[#174B35] px-4 py-3 text-sm font-bold text-white hover:bg-[#103A29]"
                >
                  Try again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
