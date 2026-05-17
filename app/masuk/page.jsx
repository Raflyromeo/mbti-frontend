"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { adaHashOAuth, bersihkanHashOAuth } from "@/utilitas/auth";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Masuk() {
  const router = useRouter();
  const [memprosesOAuth, setMemprosesOAuth] = useState(false);

  useEffect(() => {
    let unmounted = false;

    const arahkanKeDasbor = () => {
      if (unmounted) return;
      bersihkanHashOAuth();
      router.replace("/dasbor");
    };

    const tanganiCallback = async () => {
      const dariOAuth = adaHashOAuth();
      if (dariOAuth) setMemprosesOAuth(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (unmounted) return;

      if (session) {
        arahkanKeDasbor();
        return;
      }

      if (dariOAuth) setMemprosesOAuth(false);
    };

    tanganiCallback();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) arahkanKeDasbor();
    });

    return () => {
      unmounted = true;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const tanganiMasukGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/masuk` }
    });
  };

  if (memprosesOAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--muted)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--foreground)]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--muted)] relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-10" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--utama)] opacity-10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--aksen)] opacity-15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm hover:text-[var(--utama)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
        >
          <Kartu className="w-full p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
            <KartuJudul className="text-3xl text-center">Masuk</KartuJudul>
            <KartuDeskripsi className="text-center mb-8">
              Masuk dengan akun Google Anda untuk memulai tes MBTI dan menyimpan profil.
            </KartuDeskripsi>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Tombol
                  varian="utama"
                  ukuran="lg"
                  className="w-full text-lg gap-3 py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform bg-white text-black hover:bg-gray-50"
                  onClick={tanganiMasukGoogle}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Masuk dengan Google
                </Tombol>
              </motion.div>
            </div>
          </Kartu>
        </motion.div>
      </div>
    </main>
  );
}
