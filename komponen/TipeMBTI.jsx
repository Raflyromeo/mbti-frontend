import { useState } from "react";

export function TipeMBTI({ dataMBTI }) {
  const [aktif, setAktif] = useState(0);
  const [mulaiX, setMulaiX] = useState(null);
  const total = dataMBTI.length;

  const prev = () => setAktif((p) => (p - 1 + total) % total);
  const next = () => setAktif((p) => (p + 1) % total);

  if (total === 0) {
    return <div className="text-center font-bold text-lg p-8">Memuat data tipe kepribadian...</div>;
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        onTouchStart={(e) => setMulaiX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!mulaiX) return;
          const d = mulaiX - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) d > 0 ? next() : prev();
          setMulaiX(null);
        }}
      >
        <div
          className={`w-full border-4 rounded-2xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-[var(--background)]`}
          style={{ borderColor: dataMBTI[aktif].accent }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-black text-6xl md:text-8xl tracking-tighter block leading-none" style={{ color: dataMBTI[aktif].accent }}>
                {dataMBTI[aktif].tipe}
              </span>
              <span className="font-black text-base md:text-lg uppercase mt-1 block text-[var(--foreground)] opacity-60">
                {dataMBTI[aktif].nama}
              </span>
            </div>
            <span className="font-black text-sm bg-[var(--foreground)] text-[var(--background)] px-3 py-1.5 rounded-full shrink-0">
              {aktif + 1}/{total}
            </span>
          </div>
          <p className="font-semibold text-[var(--foreground)] opacity-70 text-sm md:text-base leading-relaxed mb-6">
            {dataMBTI[aktif].desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {["E","I","S","N","T","F","J","P"].filter(c => dataMBTI[aktif].tipe.includes(c)).map(c => (
              <span key={c} className="font-black text-xs md:text-sm px-3 py-1.5 rounded-lg border-2" style={{ borderColor: dataMBTI[aktif].accent, color: dataMBTI[aktif].accent }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          className="flex gap-3 mt-4 overflow-x-auto pb-1"
          style={{scrollbarWidth:'none', msOverflowStyle:'none', WebkitOverflowScrolling:'touch'}}
          onMouseEnter={e => e.currentTarget.style.setProperty('--show-scroll','none')}
        >
          {dataMBTI.map((item, i) => (
            <button
              key={item.tipe}
              onClick={() => setAktif(i)}
              className={`shrink-0 border-4 rounded-xl px-3 py-2 md:px-4 md:py-3 font-black text-sm md:text-base transition-all duration-200 ${
                i === aktif
                  ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                  : 'bg-[var(--background)] text-[var(--foreground)] opacity-50 hover:opacity-100 hover:scale-105'
              }`}
              style={{ borderColor: i === aktif ? 'var(--foreground)' : item.accent }}
            >
              {item.tipe}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="w-12 h-12 md:w-14 md:h-14 border-4 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--aksen)] hover:text-black font-black text-xl rounded-full shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">←</button>
        <span className="font-black text-sm text-[var(--muted-foreground)]">{aktif + 1} / {total}</span>
        <button onClick={next} className="w-12 h-12 md:w-14 md:h-14 border-4 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--aksen)] hover:text-black font-black text-xl rounded-full shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">→</button>
      </div>
    </div>
  );
}
