"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Kartu, KartuJudul } from "@/komponen/Kartu";
import { Users, FileQuestion, ActivitySquare } from "lucide-react";

export default function DasborAdmin() {
  const [statistik, setStatistik] = useState({ user: 0, pertanyaan: 0, hasil: 0 });

  useEffect(() => {
    const ambilStatistik = async () => {
      const [{ count: user }, { count: pertanyaan }, { count: hasil }] = await Promise.all([
        supabase.from("user").select("*", { count: "exact", head: true }),
        supabase.from("sikap").select("*", { count: "exact", head: true }),
        supabase.from("hasil").select("*", { count: "exact", head: true })
      ]);
      
      setStatistik({ user: user || 0, pertanyaan: pertanyaan || 0, hasil: hasil || 0 });
    };
    ambilStatistik();
  }, []);

  const KartuStat = ({ ikon: Ikon, judul, angka, warna }) => (
    <div className={`neobrutalism-box p-6 flex items-center gap-6 ${warna}`}>
      <div className="p-4 bg-white border-2 border-[var(--border)] rounded-full">
        <Ikon className="w-8 h-8 text-black" />
      </div>
      <div>
        <h3 className="font-bold uppercase text-sm">{judul}</h3>
        <p className="text-4xl font-black">{angka}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <KartuJudul className="text-4xl">Ringkasan Sistem</KartuJudul>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KartuStat 
          ikon={Users} 
          judul="Total Pengguna" 
          angka={statistik.user} 
          warna="bg-[var(--kedua)] text-[var(--kedua-foreground)]" 
        />
        <KartuStat 
          ikon={FileQuestion} 
          judul="Total Soal" 
          angka={statistik.pertanyaan} 
          warna="bg-[var(--aksen)] text-[var(--aksen-foreground)]" 
        />
        <KartuStat 
          ikon={ActivitySquare} 
          judul="Tes Diselesaikan" 
          angka={statistik.hasil} 
          warna="bg-[var(--utama)] text-[var(--utama-foreground)]" 
        />
      </div>

      <Kartu className="mt-8">
        <KartuJudul>Petunjuk Admin</KartuJudul>
        <p className="mb-4">Selamat datang di Panel Pakar MBTI. Di sini Anda dapat mengelola basis pengetahuan untuk sistem pakar Anda.</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Arahkan ke menu <strong>Soal / Sikap</strong> untuk menambah, mengedit, atau menghapus pertanyaan MBTI.</li>
          <li>Pastikan Anda telah memasukkan nilai (E/I, S/N, T/F, J/P) dengan benar pada setiap opsi.</li>
        </ul>
      </Kartu>
    </div>
  );
}
