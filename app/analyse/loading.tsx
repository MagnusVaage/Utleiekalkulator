export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f8fa' }}>
      <div className="text-center">
        <span className="animate-spin inline-block w-7 h-7 border-2 border-slate-200 border-t-blue-600 rounded-full mb-3" />
        <p className="text-slate-500 text-sm">Analyserer boligen…</p>
      </div>
    </div>
  );
}
