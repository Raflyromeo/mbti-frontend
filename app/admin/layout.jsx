"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utilitas/supabase";
import Link from "next/link";
import { LayoutDashboard, ListTodo, LogOut, Sun, Moon, Loader2, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { gunakanTema } from "@/komponen/PenyediaTema";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarBuka, setSidebarBuka] = useState(false);
  const [dilipat, setDilipat] = useState(false);
  const [dropdownBuka, setDropdownBuka] = useState(false);
  const [profil, setProfil] = useState({ nama: "Admin", email: "", avatar_url: "" });
  const { tema, setTema } = gunakanTema();

  useEffect(() => {
    let langganan;

    const periksaAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/masuk-admin"); return; }
      const { data, error } = await supabase.from("user").select("nama, tipeuser, avatar_url").eq("iduser", session.user.id).maybeSingle();

      if (error || data?.tipeuser !== "admin") { 
        router.push("/tes"); 
      } else { 
        setProfil({ nama: data.nama || "Admin", email: session.user.email, avatar_url: data.avatar_url || "" }); 
        setLoading(false); 
      }

      langganan = supabase
        .channel(`profil-realtime-admin-${Date.now()}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'user', filter: `iduser=eq.${session.user.id}` },
          (payload) => {
            setProfil(prev => ({
              ...prev,
              nama: payload.new.nama || prev.nama,
              avatar_url: payload.new.avatar_url || ""
            }));
          }
        )
        .subscribe();
    };

    periksaAdmin();

    return () => {
      if (langganan) supabase.removeChannel(langganan);
    };
  }, [router]);

  const keluar = async () => { await supabase.auth.signOut(); router.push("/masuk-admin"); };

  const menu = [
    { nama: "Ringkasan", href: "/admin", ikon: LayoutDashboard },
    { nama: "Soal / Sikap", href: "/admin/pertanyaan", ikon: ListTodo },
  ];

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
      <Loader2 className="w-10 h-10 animate-spin text-[var(--utama)]" />
    </div>
  );

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[var(--background)] lg:border-r-4 lg:border-[var(--border)]">

      {}
      <div className={`hidden lg:flex p-4 items-center ${dilipat ? "justify-center" : "justify-between"} h-16 border-b-4 border-[var(--border)] bg-[var(--kedua)] shrink-0`}>
        {dilipat ? (
          <div className="w-10 h-10 bg-[var(--utama)] text-[var(--utama-foreground)] font-black text-xl flex items-center justify-center border-4 border-[var(--border)] rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            P
          </div>
        ) : (
          <h1 className="font-black text-2xl uppercase tracking-tighter whitespace-nowrap text-[var(--utama)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Panel Pakar
          </h1>
        )}
      </div>

      {}
      <div className="lg:hidden flex flex-col items-center pt-2 pb-4 relative w-full shrink-0">
        <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mb-4 opacity-50"></div>
        {profil && (
          <div className="flex items-center gap-4 px-6 w-full">
            <div className="w-12 h-12 rounded-xl bg-[var(--kedua)] text-[var(--kedua-foreground)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl shrink-0">
              {profil.avatar_url ? <img src={profil.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" /> : <span>{profil.nama?.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-lg text-[var(--foreground)] leading-tight">{profil.nama}</span>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden h-1 bg-[var(--border)] w-full mb-2 shrink-0"></div>

      <div className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {menu.map((item) => {
          const aktif = pathname === item.href;
          const Ikon = item.ikon;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarBuka(false)}
              className={`
                p-3.5 font-bold text-sm flex items-center gap-4 transition-all relative border-2
                ${aktif ? 'bg-[var(--aksen)] text-[var(--aksen-foreground)] border-[var(--border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl lg:rounded-full' : 'hover:bg-[var(--muted)] hover:border-[var(--foreground)] rounded-xl lg:rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] border-transparent'}
                ${dilipat ? 'lg:justify-center lg:px-0' : ''}
              `}
              title={item.nama}>
              <Ikon className="w-5 h-5 shrink-0" />
              {!dilipat && <span className="whitespace-nowrap lg:uppercase tracking-wide text-inherit">{item.nama}</span>}
              {aktif && <div className="absolute right-4 w-1.5 h-1.5 bg-[var(--aksen-foreground)] rounded-full lg:hidden"></div>}
            </Link>
          );
        })}
      </div>

      {}
      <div className="lg:hidden px-4 py-4 mt-auto border-t-4 border-[var(--border)] bg-[var(--kedua)] shrink-0">
        <button 
          onClick={keluar}
          className="w-full p-3 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all bg-red-500 text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {}
      <div className="hidden lg:block px-4 py-4 mt-auto border-t-4 border-[var(--border)] shrink-0">
        <button onClick={keluar}
          className={`w-full flex items-center gap-3 p-3 font-bold uppercase text-sm rounded-full border-2 border-transparent hover:bg-red-500 hover:text-white text-red-500 hover:border-black transition-all ${dilipat ? "justify-center" : ""}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!dilipat && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[var(--background)]">

      {sidebarBuka && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarBuka(false)} />
      )}

      <div className={`
        fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out bg-[var(--background)] rounded-t-3xl overflow-hidden border-t-4 border-[var(--border)]
        lg:bg-transparent lg:rounded-none lg:border-t-0 lg:top-0 lg:h-full lg:relative lg:translate-y-0 lg:z-auto lg:shrink-0 max-h-[90vh] lg:max-h-none
        ${sidebarBuka ? "translate-y-0" : "translate-y-full"}
        ${dilipat ? "lg:w-24" : "lg:w-72"}
      `}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-[var(--background)] border-b-4 border-black px-4 flex items-center justify-between shrink-0 z-40" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (window.innerWidth < 1024) setSidebarBuka(true); else setDilipat(!dilipat); }}
              className="p-2 hover:bg-black/10 rounded-md border-2 border-transparent hover:border-[var(--border)] transition-all">
              {window.innerWidth < 1024 ? <Menu className="w-6 h-6" /> : dilipat ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
            </button>
            <span className="font-black uppercase tracking-tight text-sm text-[var(--muted-foreground)] hidden sm:block">Panel Admin</span>
          </div>
          <div className="relative">
            <button onClick={() => setDropdownBuka(!dropdownBuka)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full border-2 border-transparent hover:border-black hover:bg-black/5 transition-all">
              <div className="w-9 h-9 rounded-full border-2 border-black overflow-hidden bg-[var(--kedua)] flex items-center justify-center font-black text-sm">
                {profil.avatar_url ? <img src={profil.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <span>{profil.nama.charAt(0).toUpperCase()}</span>}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-black text-sm leading-tight">{profil.nama}</span>
                <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Admin</span>
              </div>
            </button>
            {dropdownBuka && (
              <div className="absolute top-14 right-0 w-56 bg-[var(--background)] text-[var(--foreground)] border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col p-2 z-50">
                <div className="p-3 border-b-2 border-[var(--border)] mb-1">
                  <p className="font-black text-sm truncate">{profil.nama}</p>
                  <p className="text-xs font-bold opacity-50 truncate">{profil.email}</p>
                </div>
                <button onClick={() => setTema(tema === "light" ? "dark" : "light")}
                  className="flex items-center justify-between p-3 hover:bg-[var(--muted)] rounded-lg font-bold transition-colors w-full text-left text-sm">
                  <span className="flex items-center gap-2">
                    {tema === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    Ganti Tema
                  </span>
                  <span className="text-xs border-2 border-[var(--border)] px-2 rounded-full uppercase">{tema}</span>
                </button>
                <div className="h-px bg-[var(--border)] my-1" />
                <button onClick={keluar}
                  className="flex items-center gap-2 p-3 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg font-bold transition-colors w-full text-left text-sm text-red-500">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--background)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
