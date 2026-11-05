export default function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-screen' : 'py-16'}`} role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
    </div>
  );
}
