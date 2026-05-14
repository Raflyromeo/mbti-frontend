"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 300;
      
      if (scrollPosition >= threshold) {
        setTampil(true);
      } else {
        setTampil(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const keAtas = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={keAtas}
      className={`group fixed bottom-8 right-8 z-50 flex items-center bg-[var(--utama)] text-white font-black text-sm p-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out ${
        tampil ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        <ArrowUp className="w-5 h-5" />
      </div>
      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
        <span className="overflow-hidden whitespace-nowrap pl-0 group-hover:pl-1 pr-0 group-hover:pr-3">Kembali ke Atas</span>
      </div>
    </button>
  );
}
