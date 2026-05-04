"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { SkeletonTes } from "@/komponen/Skeleton";
import { gsap } from "gsap";
import { Loader2, User } from "lucide-react";
import Link from "next/link";

export default function TesMBTI() {
  const [dataPertanyaan, setDataPertanyaan] = useState([]);
  const [indeks, setIndeks] = useState(0);
  const [jawaban, setJawaban] = useState([]);
  const [sedangMemuatSoal, setSedangMemuatSoal] = useState(true);
  const [memprosesAPI, setMemprosesAPI] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const kartuRef = useRef(null);
  const preloaderRef = useRef(null);

  useEffect(() => {
    const ambilUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/masuk");
      } else {
        setUser(session.user);
      }
    };
    ambilUser();
  }, [router]);

  useEffect(() => {
    const ambilData = async () => {
      const { data, error } = await supabase.from("sikap").select("*").order("idsikap", { ascending: true });
      if (!error && data) {
        setDataPertanyaan(data);
      }
      setSedangMemuatSoal(false);
    };
    ambilData();
  }, []);

  useEffect(() => {
    if (dataPertanyaan.length > 0 && !sedangMemuatSoal) {

      gsap.to(preloaderRef.current, { display: "flex", opacity: 1, duration: 0.2 });
      gsap.to(kartuRef.current, { opacity: 0, x: -50, duration: 0.2, onComplete: () => {

        setTimeout(() => {
          gsap.to(preloaderRef.current, { opacity: 0, display: "none", duration: 0.2 });
          gsap.fromTo(kartuRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
        }, 600); 
      }});
    }
  }, [indeks, dataPertanyaan]);

  const pilihJawaban = async (nilai) => {
    const jawabanBaru = [...jawaban, nilai];
    setJawaban(jawabanBaru);

    if (indeks < dataPertanyaan.length - 1) {
      setIndeks(indeks + 1);
    } else {
      setMemprosesAPI(true);
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
        const res = await fetch(`${apiUrl}/api/diagnosa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jawaban: jawabanBaru })
        });
        const hasilApi = await res.json();
        const hasil = hasilApi.data;

        if (user) {

          await supabase.from("user").upsert({
            iduser: user.id,
            nama: user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna",
            username: user.email,
            tipeuser: "user"
          }, { onConflict: "iduser", ignoreDuplicates: true });

          const { data: tipeData, error: errTipe } = await supabase
            .from("tipe_kepribadian")
            .select("idtipe")
            .eq("nama_tipe", hasil.tipe_dominan)
            .maybeSingle();

          if (errTipe || !tipeData) {
            console.error("Error mengambil idtipe:", errTipe);
            alert("Gagal menyimpan hasil: Tipe kepribadian tidak ditemukan di database. Pastikan seeder sudah dijalankan.");
          } else {
            const { data: hasilData, error: errHasil } = await supabase.from("hasil").insert({
              iduser: user.id,
              idtipe: tipeData.idtipe,
              skor_persentase: hasil.persentase
            }).select("idhasil").single();

            if (errHasil) {
              console.error("Error insert hasil:", errHasil);
              alert("Gagal menyimpan ke tabel hasil: " + errHasil.message);
            }

            if (hasilData && !errHasil) {
              const h = hasil.persentase;
              const skor_dominan = ((h.E > h.I ? h.E : h.I) + (h.S > h.N ? h.S : h.N) + (h.T > h.F ? h.T : h.F) + (h.J > h.P ? h.J : h.P)) / 4;

              const { error: errScore } = await supabase.from("score").insert({
                idhasil: hasilData.idhasil,
                idtipe: tipeData.idtipe,
                score: skor_dominan
              });

              if (errScore) {
                console.error("Error insert score:", errScore);
              }

              hasil.idhasil = hasilData.idhasil; 
            }
          }
        }

        localStorage.setItem("hasilMBTI", JSON.stringify(hasil));
        router.push(hasil.idhasil ? `/hasil?id=${hasil.idhasil}` : "/hasil");
      } catch (error) {
        console.error("Gagal terhubung ke API Pakar", error);
        alert("Gagal terhubung ke Sistem Pakar. Pastikan backend Python berjalan.");
        setMemprosesAPI(false);
      }
    }
  };

  if (memprosesAPI) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <Kartu className="text-center w-full max-w-md">
          <KartuJudul className="animate-pulse">Menganalisis Kepribadian...</KartuJudul>
          <div className="w-full bg-[var(--muted)] h-4 neobrutalism-box mt-6 overflow-hidden">
            <div className="bg-[var(--utama)] h-full animate-pulse w-full"></div>
          </div>
        </Kartu>
      </main>
    );
  }

  if (sedangMemuatSoal) {
    return (
      <main className="min-h-screen p-6 md:p-12">
        <div className="w-full max-w-2xl mx-auto">
          <SkeletonTes />
        </div>
      </main>
    );
  }

  if (dataPertanyaan.length === 0 && !sedangMemuatSoal) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <Kartu className="text-center w-full max-w-md bg-[var(--utama)] text-[var(--utama-foreground)]">
          <KartuJudul>Belum Ada Pertanyaan</KartuJudul>
          <p>Admin belum memasukkan soal sikap ke dalam database.</p>
        </Kartu>
      </main>
    );
  }

  const pertanyaanSaaIni = dataPertanyaan[indeks] || {};
  const persentase = dataPertanyaan.length > 0 ? Math.round(((indeks) / dataPertanyaan.length) * 100) : 0;

  return (
    <main className="min-h-screen flex flex-col items-center p-6 relative">
      <div className="w-full max-w-2xl text-left self-center mb-4">
        <Breadcrumb />
      </div>

      <div 
        ref={preloaderRef} 
        className="absolute inset-0 flex items-center justify-center z-50 bg-[var(--background)]/80 backdrop-blur-sm"
        style={{ display: "none", opacity: 0 }}
      >
        <div className="neobrutalism-box bg-[var(--kedua)] p-6 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--foreground)]" />
          <h2 className="font-black uppercase tracking-tight text-xl text-[var(--foreground)]">Menyiapkan Soal...</h2>
        </div>
      </div>

      <div className="w-full max-w-2xl mb-8 z-10">
        <div className="flex justify-between mb-2 font-bold uppercase text-sm">
          <span>Progres</span>
          <span>{persentase}%</span>
        </div>
        <div className="w-full bg-[var(--muted)] h-4 neobrutalism-box overflow-hidden">
          <div 
            className="bg-[var(--utama)] h-full transition-all duration-500 ease-out"
            style={{ width: `${persentase}%` }}
          ></div>
        </div>
      </div>

      <Kartu ref={kartuRef} className="w-full max-w-2xl p-8 z-10 opacity-0">
        <div className="mb-8">
          <span className="inline-block bg-[var(--aksen)] text-[var(--aksen-foreground)] px-3 py-1 font-bold text-sm uppercase border-2 border-[var(--border)] mb-4 shadow-[2px_2px_0px_0px_var(--border)]">
            Pertanyaan {indeks + 1} / {dataPertanyaan.length}
          </span>
          <KartuJudul className="text-2xl md:text-3xl leading-tight">
            {pertanyaanSaaIni.sikap}
          </KartuJudul>
        </div>

        <div className="space-y-4 flex flex-col">
          <Tombol 
            varian="outline" 
            className="w-full justify-start text-left h-auto py-4 px-6 text-lg hover:bg-[var(--utama)] hover:text-[var(--utama-foreground)]"
            onClick={() => pilihJawaban(pertanyaanSaaIni.opsi_a_nilai)}
          >
            {pertanyaanSaaIni.opsi_a_teks}
          </Tombol>
          <Tombol 
            varian="outline" 
            className="w-full justify-start text-left h-auto py-4 px-6 text-lg hover:bg-[var(--kedua)] hover:text-[var(--kedua-foreground)]"
            onClick={() => pilihJawaban(pertanyaanSaaIni.opsi_b_nilai)}
          >
            {pertanyaanSaaIni.opsi_b_teks}
          </Tombol>
        </div>
      </Kartu>
    </main>
  );
}
