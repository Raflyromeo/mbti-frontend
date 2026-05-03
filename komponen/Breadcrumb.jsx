"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  
  if (pathname === "/dasbor" || pathnames.length === 0) {
    return (
      <nav className="flex items-center gap-2 text-sm md:text-base font-bold uppercase w-full relative z-20">
        <Home className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
        <span className="truncate">Dasbor</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm md:text-base font-bold uppercase w-full overflow-x-auto whitespace-nowrap relative z-20 pb-2 custom-scrollbar">
      <Link href="/dasbor" className="hover:text-[var(--utama)] flex items-center gap-2 shrink-0">
        <Home className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> <span className="hidden sm:inline">Dasbor</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const judul = value === "tes" ? "Tes MBTI" : value; 

        return (
          <div key={to} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--muted-foreground)] shrink-0" />
            {isLast ? (
              <span className="text-[var(--utama)] border-b-2 border-[var(--utama)] pb-1 truncate max-w-[150px] sm:max-w-none">{judul}</span>
            ) : (
              <Link href={to} className="hover:text-[var(--utama)] truncate max-w-[100px] sm:max-w-none">
                {judul}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
