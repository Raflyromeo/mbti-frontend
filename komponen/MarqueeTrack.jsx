export const MARQUEE_TIPE = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

export function MarqueeTrack() {
  return (
    <div className="overflow-hidden border-y-4 border-black bg-[var(--aksen)] py-3 md:py-4" style={{"--duration":"30s"}}>
      <div className="flex">
        {[0, 1].map((i) => (
          <div key={i} className="flex shrink-0 gap-8 md:gap-12 animate-marquee-track select-none" style={{animationDuration:"30s"}}>
            {MARQUEE_TIPE.map((t, j) => (
              <span key={j} className="font-black text-xl md:text-2xl uppercase text-black tracking-widest px-2 whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
