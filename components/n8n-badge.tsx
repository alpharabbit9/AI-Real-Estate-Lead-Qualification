export function N8nBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/3">
      <div className="flex gap-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400/50" />
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
        n8n + Groq Powered
      </span>
    </div>
  );
}
