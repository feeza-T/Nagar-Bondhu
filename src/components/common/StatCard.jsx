export default function StatCard({ label, value, Icon, tone = 'bg-brand text-white' }) {
  return (
    <div className="panel flex items-center gap-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon size={22} /></span>
      <div><p className="font-display text-3xl leading-none text-forest">{value}</p><p className="mt-1 text-sm text-ink/65">{label}</p></div>
    </div>
  );
}
