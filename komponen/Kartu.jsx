import { forwardRef } from "react";
import { cn } from "@/utilitas/cn";

export const Kartu = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "neobrutalism-box bg-[var(--background)] text-[var(--foreground)] p-6",
      className
    )}
    {...props}
  />
));
Kartu.displayName = "Kartu";

export const KartuJudul = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-black uppercase tracking-tight mb-2", className)}
    {...props}
  />
));
KartuJudul.displayName = "KartuJudul";

export const KartuDeskripsi = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--muted-foreground)] mb-4", className)}
    {...props}
  />
));
KartuDeskripsi.displayName = "KartuDeskripsi";
