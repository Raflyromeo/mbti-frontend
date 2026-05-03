"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utilitas/supabase";
import { SidebarUser } from "@/komponen/SidebarUser";
import { Loader2, PanelLeftClose, PanelLeftOpen, LogOut, Sun, Moon, Settings, X, Menu } from "lucide-react";
import { gunakanTema } from "@/komponen/PenyediaTema";
import Link from "next/link";

export default function UserLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarBuka, setSidebarBuka] = useState(false);
  const [dilipat, setDilipat] = useState(false);
  const [dropdownBuka, setDropdownBuka] = useState(false);
  const [profil, setProfil] = useState({ nama: "Memuat...", email: "", avatar_url: "", peran: "User" });
  const { tema, setTema } = gunakanTema();

  useEffect(() => {
    let langganan;

    const ambilProfil = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/masuk");
        return;
      }
      
      const { data, error } = await supabase
        .from("user")
        .select("nama, tipeuser, username, avatar_url")
        .eq("iduser", session.user.id)
        .single();
      
      if (data?.tipeuser === "admin") {
        router.push("/admin");
        return;
      }

      setProfil({
        nama: data?.nama || session.user.email.split("@")[0],
        peran: "User",
        email: session.user.email,
        avatar_url: data?.avatar_url || ""
      });
      setLoading(false);

      langganan = supabase
        .channel(`profil-realtime-${Date.now()}`)
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

    ambilProfil();

    return () => {
      if (langganan) {
        supabase.removeChannel(langganan);
      }
    };
  }, [router]);

  const keluar = async () => { await supabase.auth.signOut(); router.push("/masuk"); };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
      <Loader2 className="w-10 h-10 animate-spin text-[var(--foreground)]" />
    </div>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[var(--background)]">

      {sidebarBuka && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarBuka(false)}
        />
      )}

      <div className={`
        fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out bg-[var(--background)] rounded-t-3xl overflow-hidden border-t-4 border-[var(--border)]
        lg:bg-transparent lg:rounded-none lg:border-t-0 lg:top-0 lg:h-full lg:relative lg:translate-y-0 lg:z-auto lg:shrink-0 max-h-[90vh] lg:max-h-none
        ${sidebarBuka ? "translate-y-0" : "translate-y-full"}
        ${dilipat ? "lg:w-24" : "lg:w-72"}
      `}
      >
        <SidebarUser dilipat={dilipat} onTutup={() => setSidebarBuka(false)} profil={profil} tema={tema} setTema={setTema} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-[var(--background)] border-b-4 border-[var(--border)] px-4 flex items-center justify-between shrink-0 z-40" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 1024) setSidebarBuka(true); else setDilipat(!dilipat); }}
              className="p-2 hover:bg-black/10 rounded-md border-2 border-transparent hover:border-[var(--border)] transition-all">
              {window.innerWidth < 1024 ? <Menu className="w-6 h-6" /> : dilipat ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
            </button>
            <span className="font-black uppercase tracking-tighter text-[var(--muted-foreground)] text-sm hidden sm:block">Dasbor Pengguna</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setDropdownBuka(!dropdownBuka)}
              className="flex items-center gap-3 hover:bg-black/5 p-1 pr-3 rounded-full border-2 border-transparent hover:border-[var(--border)] transition-all">
              <div className="w-9 h-9 rounded-full border-2 border-black overflow-hidden bg-[var(--kedua)] text-[var(--kedua-foreground)] flex items-center justify-center font-black text-sm">
                {profil.avatar_url ? <img src={profil.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <span>{profil.nama.charAt(0).toUpperCase()}</span>}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-black text-sm leading-tight truncate max-w-[120px]">{profil.nama}</span>
                <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">{profil.peran}</span>
              </div>
            </button>
            {dropdownBuka && (
              <div className="absolute top-14 right-0 w-64 bg-[var(--background)] text-[var(--foreground)] border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col p-2 z-50">
                <div className="p-3 border-b-2 border-[var(--border)] mb-2">
                  <p className="font-black truncate">{profil.nama}</p>
                  <p className="text-xs font-bold opacity-50 truncate">{profil.email}</p>
                </div>
                <Link href="/profil" onClick={() => setDropdownBuka(false)} className="flex items-center gap-3 p-3 hover:bg-[var(--muted)] rounded-lg font-bold transition-colors">
                  <Settings className="w-5 h-5" /> Pengaturan
                </Link>
                <button onClick={() => setTema(tema === "light" ? "dark" : "light")}
                  className="flex items-center justify-between p-3 hover:bg-[var(--muted)] rounded-lg font-bold transition-colors w-full text-left">
                  <span className="flex items-center gap-3">
                    {tema === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    Ganti Tema
                  </span>
                  <span className="text-xs border-2 border-[var(--border)] px-2 rounded-full uppercase">{tema}</span>
                </button>
                <div className="h-px bg-[var(--border)] my-2" />
                <button onClick={keluar} className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg font-bold transition-colors w-full text-left text-red-500">
                  <LogOut className="w-5 h-5" /> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
