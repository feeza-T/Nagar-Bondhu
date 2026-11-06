
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  ClipboardList,
  Plus,
  ArrowRight,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <section className="min-h-[75vh] bg-mint2 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-teal">
            Citizen Account
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-olive sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-ink/60">
            Manage your account and access your submitted reports.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="bg-forest px-6 py-8 text-white sm:px-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime font-display text-3xl font-extrabold text-forest">
                {initials}
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">
                  {user?.name}
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  Citizen account
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  <ShieldCheck size={14} />
                  {t(`roles.${user?.role}`)}
                </span>
              </div>
            </div>
          </div>

          {/* Personal information */}
          <div className="p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-bold text-forest">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-mint2 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-ink/50">
                  <UserRound size={16} />
                  Full Name
                </div>

                <p className="font-bold text-ink">
                  {user?.name || 'Not provided'}
                </p>
              </div>

              <div className="rounded-2xl bg-mint2 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-ink/50">
                  <Mail size={16} />
                  Email Address
                </div>

                <p className="break-all font-bold text-ink">
                  {user?.email || 'Not provided'}
                </p>
              </div>

              <div className="rounded-2xl bg-mint2 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-ink/50">
                  <Phone size={16} />
                  Phone Number
                </div>

                <p className="font-bold text-ink">
                  {user?.phone || 'Not provided'}
                </p>
              </div>

              <div className="rounded-2xl bg-mint2 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-ink/50">
                  <ShieldCheck size={16} />
                  Account Type
                </div>

                <p className="font-bold capitalize text-ink">
                  {user?.role}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-forest">
            My Activities
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">

            <Link
              to="/my-reports"
              className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest text-lime">
                <ClipboardList size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-forest">
                  Track My Reports
                </h4>

                <p className="mt-1 text-sm text-ink/55">
                  View report status and cleanup progress.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="shrink-0 text-forest transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/report"
              className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime text-forest">
                <Plus size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-forest">
                  Report a Problem
                </h4>

                <p className="mt-1 text-sm text-ink/55">
                  Report waste and environmental issues.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="shrink-0 text-forest transition group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
