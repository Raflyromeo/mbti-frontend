"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utilitas/supabase";
import { LayoutDashboard, FileText, ActivitySquare, User, LogOut, Sun, Moon, BrainCircuit } from "lucide-react";

export function SidebarUser({ dilipat, onTutup, profil, tema, setTema }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { nama: "Ringkasan",          href: "/dasbor",  ikon: LayoutDashboard },
    { nama: "Mulai Tes",          href: "/tes",      ikon: FileText        },
    { nama: "Riwayat Hasil",      href: "/hasil",    ikon: ActivitySquare  },
    { nama: "Pengaturan Profil",  href: "/profil",   ikon: User            },
  ];

  const keluar = async () => {
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <aside
      className={`
        bg-[var(--background)] flex flex-col transition-all duration-300 ease-in-out shrink-0 z-50 h-full
        lg:border-r-4 lg:border-[var(--border)]
        ${dilipat ? "lg:w-24" : "lg:w-72"}
      `}
    >
      <div className={`hidden lg:flex items-center ${dilipat ? "justify-center p-4" : "justify-start gap-2 px-8 py-4"} h-16 border-b-4 border-[var(--border)] bg-[var(--background)] shrink-0`}>
        {dilipat ? (
          <div className="w-10 h-10 bg-red-500 text-white font-black text-xl flex items-center justify-center border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <BrainCircuit className="w-5 h-5" />
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-red-500 shrink-0" />
            <h1 className="font-black text-xl uppercase tracking-tighter whitespace-nowrap text-[var(--foreground)]">
              MBTI Pakar
            </h1>
          </Link>
        )}
      </div>

      <div className="lg:hidden flex flex-col items-center pt-2 pb-4 relative w-full shrink-0">
        <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mb-4 opacity-50" />
        {profil && (
          <div className="flex items-center gap-4 px-6 w-full">
            <div className="w-12 h-12 rounded-xl bg-[var(--kedua)] text-[var(--kedua-foreground)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl shrink-0">
              {profil.avatar_url
                ? <img src={profil.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                : <span>{profil.nama?.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-lg text-[var(--foreground)] leading-tight">{profil.nama}</span>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden h-1 bg-[var(--border)] w-full mb-2 shrink-0" />

      <div className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {menu.map((item) => {
          const aktif = pathname === item.href;
          const Ikon = item.ikon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                p-3.5 font-bold text-sm flex items-center gap-4 transition-all relative border-2
                ${aktif
                  ? "bg-[var(--aksen)] text-[var(--aksen-foreground)] border-[var(--border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl lg:rounded-full"
                  : "hover:bg-[var(--muted)] hover:border-[var(--foreground)] rounded-xl lg:rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] border-transparent"}
                ${dilipat ? "lg:justify-center lg:px-0" : ""}
              `}
              title={item.nama}
              onClick={onTutup}
            >
              <Ikon className="w-5 h-5 shrink-0" />
              {!dilipat && <span className="whitespace-nowrap lg:uppercase tracking-wide text-inherit">{item.nama}</span>}
              {aktif && <div className="absolute right-4 w-1.5 h-1.5 bg-[var(--aksen-foreground)] rounded-full lg:hidden" />}
            </Link>
          );
        })}
      </div>

      <div className="lg:hidden px-4 py-4 mt-auto border-t-4 border-[var(--border)] shrink-0">
        <button
          onClick={keluar}
          className="w-full p-3 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all bg-red-500 text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="hidden lg:block px-4 py-4 mt-auto border-t-4 border-[var(--border)]">
        <button
          onClick={keluar}
          className={`w-full p-3 font-bold uppercase text-sm flex items-center gap-4 transition-all border-2 border-transparent hover:bg-red-500 hover:text-white rounded-full text-red-500 hover:border-black ${dilipat ? "justify-center px-0" : ""}`}
          title="Keluar"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          {!dilipat && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
