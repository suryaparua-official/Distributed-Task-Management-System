export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#080812]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#1a1a2e] border-t-indigo-500 animate-spin" />
        <p className="text-slate-600 text-sm">Loading…</p>
      </div>
    </div>
  );
}
