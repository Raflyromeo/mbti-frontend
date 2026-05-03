"use client";

export function Marquee({ children, reverse = false, pauseOnHover = false, className = "", speed = 40 }) {
  return (
    <div
      className={`group flex overflow-hidden [--duration:${speed}s] ${className}`}
      style={{ "--duration": `${speed}s` }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`flex shrink-0 gap-0 [animation-play-state:running] ${
            pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
          } ${reverse ? "animate-marquee-reverse" : "animate-marquee-track"}`}
          style={{ animationDuration: `var(--duration, ${speed}s)` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
