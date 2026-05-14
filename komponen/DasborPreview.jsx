import { LayoutDashboard, FileText, BarChart2 } from "lucide-react";

export function DasborPreview() {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-gray-800 border-b-4 border-black px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"/>
          <div className="w-3 h-3 rounded-full bg-yellow-400"/>
          <div className="w-3 h-3 rounded-full bg-green-400"/>
        </div>
        <div className="flex-1 bg-gray-700 rounded-full px-3 py-1 text-xs font-mono text-gray-300">mbti-pakar.app/dasbor</div>
      </div>
      <div className="flex h-56 bg-gray-50">
        <div className="w-14 bg-gray-900 flex flex-col items-center py-4 gap-5 shrink-0">
          <div className="w-7 h-7 bg-[var(--utama)] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <LayoutDashboard className="w-4 h-4 text-white"/>
          <FileText className="w-4 h-4 text-white opacity-40"/>
          <BarChart2 className="w-4 h-4 text-white opacity-40"/>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3"/>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--utama)] rounded-xl p-3 text-white">
              <div className="h-2 bg-white/30 rounded mb-2 w-2/3"/>
              <div className="font-black text-xl">INFJ</div>
              <div className="text-xs opacity-70 mt-1">Penganjur</div>
            </div>
            <div className="bg-[var(--aksen)] rounded-xl p-3">
              <div className="h-2 bg-black/20 rounded mb-2 w-1/2"/>
              <div className="font-black text-lg text-black">Tes ke-3</div>
              <div className="text-xs opacity-60 mt-1">3 Mei 2026</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-100 p-3 space-y-2">
            <div className="h-2 bg-gray-200 rounded w-1/3"/>
            <div className="flex gap-1 items-center">
              <div className="h-2 bg-[var(--utama)] rounded-full" style={{width:'62%'}}/>
              <span className="text-xs font-bold text-gray-400">62%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
