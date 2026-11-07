
import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  X,
  Loader2,
  Megaphone,
} from 'lucide-react';

import { createCampaign } from '../../../services/campaignService';

export default function CampaignModal({ report, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: report?.title || '',
    date: '',
    time: '',
    meetingPoint: report?.location || '',
    needed: 5,
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!report) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.meetingPoint.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await createCampaign({
        ...form,
        reportId: report.id,
        needed: Number(form.needed),
      });

      if (error) throw error;
      if (!data) throw new Error('Campaign could not be created.');

      onCreated?.();
    } catch (err) {
      console.error('Campaign creation failed:', err);
      setError(err.message || 'Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const fieldClass =
    'w-full rounded-xl border border-[#174B35]/15 bg-[#F8FAF5] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#6F9D42] focus:ring-2 focus:ring-[#A7C96B]/20';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#10251A]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-campaign-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-[#174B35] via-[#28613D] to-[#739A43] px-6 py-6 text-white sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-5 top-5 rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/20 text-lime-200">
            <Megaphone size={25} />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
            NagarBondhu / Admin
          </p>

          <h2
            id="create-campaign-title"
            className="mt-2 text-2xl font-bold"
          >
            Create Cleanup Campaign
          </h2>

          <p className="mt-2 text-sm text-white/75">
            Turn this confirmed report into a community cleanup activity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          <div className="rounded-xl border border-[#DCE9C9] bg-[#F3F8E9] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64813D]">
              Based on confirmed report
            </p>
            <p className="mt-1 font-bold text-[#174B35]">
              {report.title}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={15} />
              {report.location}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Campaign title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Enter campaign title"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CalendarDays size={16} />
                Campaign date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={minDate}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock size={16} />
                Start time *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin size={16} />
              Meeting point *
            </label>
            <input
              name="meetingPoint"
              value={form.meetingPoint}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Enter meeting point"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users size={16} />
              Required volunteers *
            </label>
            <input
              type="number"
              name="needed"
              value={form.needed}
              onChange={handleChange}
              min="1"
              max="500"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Additional instructions
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className={fieldClass}
              placeholder="Add cleanup instructions or other details..."
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#174B35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#103A29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Megaphone size={17} />
                  Create Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
