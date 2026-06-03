export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f8fa' }}>
      <div className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 10px 40px rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.10)' }}>
        <div className="relative mx-auto mb-5 w-14 h-14 flex items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
          <img src="/logo.svg" alt="" className="w-7 h-7" />
        </div>
        <p className="font-bold text-slate-900">Analyserer boligen…</p>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Henter salgsoppgaven og leser gjennom tilstandsrapporten. Dette tar vanligvis 20–40 sekunder.
        </p>
        <div className="mt-5 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.06)' }}>
          <span className="block h-full w-1/3 rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' }} />
        </div>
      </div>
    </div>
  );
}
