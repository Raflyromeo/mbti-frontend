import { forwardRef } from "react";
import { cn } from "@/utilitas/cn";

export const Tombol = forwardRef(({ className, varian = "utama", ukuran = "md", asChild = false, ...props }, ref) => {
  const varianKelas = {
    utama: "bg-[var(--utama)] text-[var(--utama-foreground)]",
    kedua: "bg-[var(--kedua)] text-[var(--kedua-foreground)]",
    aksen: "bg-[var(--aksen)] text-[var(--aksen-foreground)]",
    outline: "bg-transparent text-[var(--foreground)]",
  };

  const ukuranKelas = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-bold uppercase tracking-wider",
        "neobrutalism-box focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        varianKelas[varian],
        ukuranKelas[ukuran],
        className
      )}
      {...props}
    />
  );
});

Tombol.displayName = "Tombol";
