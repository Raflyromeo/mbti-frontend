"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

export default function MasukAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-admin-back", { x: -30, opacity: 0, duration: 0.5, ease: "power3.out", delay: 0.1 });
      gsap.from(".gsap-admin-icon", { y: -25, opacity: 0, scale: 0.8, duration: 0.6, ease: "back.out(1.5)", delay: 0.2 });
      gsap.from(".gsap-admin-kartu", { y: 40, opacity: 0, scale: 0.97, duration: 0.7, ease: "power3.out", delay: 0.35 });
    });
    return () => ctx.revert();
  }, []);

  const tanganiMasukAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesanError("");

    
    const emailSistem = `${username}@sistem.local`;
    
    const { error } = await supabase.auth.signInWithPassword({
      email: emailSistem,
      password: password,
    });

    if (error) {
      setPesanError("Kredensial salah atau Anda bukan admin.");
      setLoading(false);
      return;
    }

    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error: errCek } = await supabase
        .from("user")
        .select("tipeuser")
        .eq("iduser", session.user.id)
        .maybeSingle();

      if (!errCek && data?.tipeuser === "admin") {
        router.push("/admin");
      } else {
        await supabase.auth.signOut();
        setPesanError("Akses ditolak! Anda bukan administrator.");
      }
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative">
      <div className="absolute inset-0 pattern-dots opacity-10"></div>
      
      <div className="max-w-md w-full relative z-10 space-y-4">
        <Link href="/" className="gsap-admin-back inline-flex items-center gap-2 font-black uppercase text-sm hover:text-[var(--kedua)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <Kartu className="gsap-admin-kartu w-full p-8 border-4 border-black bg-[var(--kedua)] text-[var(--kedua-foreground)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <div className="gsap-admin-icon flex justify-center mb-6">
          <div className="p-4 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ShieldAlert className="w-10 h-10 text-black" />
          </div>
        </div>
        
        <KartuJudul className="text-3xl text-center">Akses Pakar</KartuJudul>
        <KartuDeskripsi className="text-center mb-8 text-[var(--kedua-foreground)] opacity-80">
          Hanya staf pakar/admin yang diperbolehkan mengakses halaman ini.
        </KartuDeskripsi>

        <form onSubmit={tanganiMasukAdmin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="font-black text-sm uppercase">Username Admin</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="adminmbti"
              required
              className="w-full neobrutalism-box p-3 bg-white text-black focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="font-black text-sm uppercase">Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full neobrutalism-box p-3 bg-white text-black focus:outline-none"
            />
          </div>

          {pesanError && (
            <div className="bg-[var(--utama)] text-[var(--utama-foreground)] p-3 border-2 border-black font-bold text-sm">
              {pesanError}
            </div>
          )}

          <Tombol varian="utama" className="w-full py-4 text-lg border-2 border-black" type="submit" disabled={loading}>
            {loading ? "Memverifikasi..." : "Masuk ke Panel"}
          </Tombol>
        </form>
        </Kartu>
      </div>
    </main>
  );
}
