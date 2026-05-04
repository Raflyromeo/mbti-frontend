"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MasukAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const router = useRouter();

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-10" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[var(--kedua)] opacity-20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--utama)] opacity-10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm hover:text-[var(--kedua)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
        >
          <Kartu className="w-full p-8 border-4 border-black bg-[var(--kedua)] text-[var(--kedua-foreground)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
            <KartuJudul className="text-3xl text-center">Akses Pakar</KartuJudul>
            <KartuDeskripsi className="text-center mb-8 text-[var(--kedua-foreground)] opacity-80">
              Hanya staf pakar/admin yang diperbolehkan mengakses halaman ini.
            </KartuDeskripsi>

            <form onSubmit={tanganiMasukAdmin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
                className="space-y-2"
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
                className="space-y-2"
              >
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
              </motion.div>

              {pesanError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[var(--utama)] text-[var(--utama-foreground)] p-3 border-2 border-black font-bold text-sm"
                >
                  {pesanError}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Tombol varian="utama" className="w-full py-4 text-lg border-2 border-black" type="submit" disabled={loading}>
                  {loading ? "Memverifikasi..." : "Masuk ke Panel"}
                </Tombol>
              </motion.div>
            </form>
          </Kartu>
        </motion.div>
      </div>
    </main>
  );
}
