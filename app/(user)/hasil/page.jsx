"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { SkeletonHasil } from "@/komponen/Skeleton";
import { gsap } from "gsap";
import { Download, RotateCcw, BookOpen, Lightbulb } from "lucide-react";
import { supabase } from "@/utilitas/supabase";
import { useReactToPrint } from "react-to-print";

function KontenHasil() {
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kosong, setKosong] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refUtama = useRef(null);
  const pdfRef = useRef(null);

  const unduhPDF = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `Laporan_MBTI_${hasil?.tipe_dominan || "Default"}`,
    pageStyle: `
      @media print {
        @page { size: A4 portrait; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `
  });

  useEffect(() => {
    const ambilDataHasil = async () => {
      const idHasil = searchParams.get("id");
      let tipeDominan = "";
      let persentaseData = null;

      if (idHasil) {
        const { data, error } = await supabase
          .from("hasil")
          .select("skor_persentase, tipe_kepribadian(nama_tipe)")
          .eq("idhasil", idHasil)
          .maybeSingle();

        if (data && !error) {
          tipeDominan = data.tipe_kepribadian.nama_tipe;
          persentaseData = data.skor_persentase;
        } else {
          setKosong(true);
          setLoading(false);
          return;
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from("hasil")
            .select("skor_persentase, tipe_kepribadian(nama_tipe)")
            .eq("iduser", session.user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (data && !error) {
            tipeDominan = data.tipe_kepribadian.nama_tipe;
            persentaseData = data.skor_persentase;
          } else {
            setKosong(true);
            setLoading(false);
            return;
          }
        } else {
          const dataTersimpan = localStorage.getItem("hasilMBTI");
          if (dataTersimpan) {
            const parsed = JSON.parse(dataTersimpan);
            tipeDominan = parsed.tipe_dominan;
            persentaseData = parsed.persentase;
          } else {
            setKosong(true);
            setLoading(false);
            return;
          }
        }
      }

      const { data: detailData } = await supabase
        .from("tipe_kepribadian")
        .select(`
          keterangan(keterangan),
          saran(saran)
        `)
        .eq("nama_tipe", tipeDominan)
        .maybeSingle();

      let teksKeterangan = "Belum ada keterangan.";
      let teksSaran = "Belum ada saran.";

      if (detailData) {
        if (detailData.keterangan && detailData.keterangan.length > 0) teksKeterangan = detailData.keterangan[0].keterangan;
        if (detailData.saran && detailData.saran.length > 0) teksSaran = detailData.saran[0].saran;
      }

      setHasil({
        tipe_dominan: tipeDominan,
        persentase: persentaseData,
        keterangan: teksKeterangan,
        saran: teksSaran
      });

      setLoading(false);
    };

    ambilDataHasil();
  }, [router, searchParams]);

  useEffect(() => {
    if (!hasil) return;

    const ctx = gsap.context(() => {
      gsap.from(".animasi-hasil", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [hasil]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--muted)] p-6 md:p-12">
        <SkeletonHasil />
      </main>
    );
  }

  if (kosong) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-6 md:p-12 flex items-center justify-center">
        <Kartu className="text-center p-8 sm:p-12 bg-[var(--kedua)] text-[var(--kedua-foreground)] rounded-2xl border-4 border-[var(--border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full animasi-hasil">
          <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-40" />
          <KartuJudul className="text-3xl mb-4 uppercase tracking-tighter">Belum Ada Hasil</KartuJudul>
          <KartuDeskripsi className="text-lg font-bold opacity-80 mb-8 text-inherit">
            Anda belum mengerjakan tes atau data hasil tidak ditemukan. Silakan kerjakan tes terlebih dahulu untuk melihat tipe kepribadian Anda.
          </KartuDeskripsi>
          <Tombol varian="utama" onClick={() => router.push("/tes")} className="w-full gap-2 justify-center py-4 text-lg">
            Mulai Tes Sekarang
          </Tombol>
        </Kartu>
      </main>
    );
  }

  if (!hasil) return null;

  const ulangiTes = () => {
    localStorage.removeItem("hasilMBTI");
    router.push("/tes");
  };

  const BarDimensi = ({ label1, val1, label2, val2, warna }) => (
    <div className="mb-6">
      <div className="flex justify-between font-bold text-sm mb-2 uppercase">
        <span>{label1} ({val1}%)</span>
        <span>{label2} ({val2}%)</span>
      </div>
      <div className="w-full h-8 bg-[var(--muted)] neobrutalism-box overflow-hidden flex">
        <div 
          className="h-full border-r-2 border-[var(--border)] transition-all duration-1000"
          style={{ width: `${val1}%`, backgroundColor: warna }}
        ></div>
        <div className="h-full" style={{ width: `${val2}%` }}></div>
      </div>
    </div>
  );

  const BarDimensiCetak = ({ label1, val1, label2, val2, warna }) => (
    <div className="mb-6">
      <div className="flex justify-between font-black text-xl mb-3 uppercase text-black">
        <span>{label1} ({val1}%)</span>
        <span>{label2} ({val2}%)</span>
      </div>
      <div className="w-full h-12 bg-[#e2e8f0] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex overflow-hidden">
        <div 
          className="h-full border-r-4 border-black"
          style={{ width: `${val1}%`, backgroundColor: warna }}
        ></div>
        <div className="h-full bg-white" style={{ width: `${val2}%` }}></div>
      </div>
    </div>
  );

  return (
    <main ref={refUtama} className="min-h-screen p-6 md:p-12 flex flex-col items-center relative">
      <div className="w-full max-w-4xl space-y-8">
        <Breadcrumb />

        <Kartu className="text-center py-12 bg-[var(--aksen)] text-[var(--aksen-foreground)] animasi-hasil rounded-2xl border-4 border-[var(--border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <KartuDeskripsi className="text-xl uppercase font-bold opacity-90 mb-2">
            Tipe Kepribadian Anda
          </KartuDeskripsi>
          <KartuJudul className="text-6xl md:text-8xl tracking-tighter mb-4">
            {hasil.tipe_dominan}
          </KartuJudul>
          <div className="max-w-2xl mx-auto px-4 mt-6 border-t-4 border-[var(--border)] pt-6 opacity-90">
            <p className="text-lg md:text-xl font-bold leading-relaxed">
              {hasil.keterangan}
            </p>
          </div>
        </Kartu>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animasi-hasil">
          <Kartu className="h-full rounded-2xl border-4 border-[var(--border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <KartuJudul>Rincian Dimensi</KartuJudul>
            <div className="mt-8">
              <BarDimensi label1="E" val1={hasil.persentase.E} label2="I" val2={hasil.persentase.I} warna="var(--utama)" />
              <BarDimensi label1="S" val1={hasil.persentase.S} label2="N" val2={hasil.persentase.N} warna="var(--kedua)" />
              <BarDimensi label1="T" val1={hasil.persentase.T} label2="F" val2={hasil.persentase.F} warna="var(--utama)" />
              <BarDimensi label1="J" val1={hasil.persentase.J} label2="P" val2={hasil.persentase.P} warna="var(--kedua)" />
            </div>

            <div className="mt-8 pt-6 border-t-4 border-[var(--border)]">
              <h4 className="font-black text-lg mb-4 uppercase">Kamus Dimensi MBTI</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <strong className="font-black text-base uppercase">E (Extrovert) vs I (Introvert):</strong> Fokus perhatian dan energi. Extrovert mendapat energi dari interaksi sosial dan dunia luar, sedangkan Introvert mengisi ulang energi melalui waktu sendiri dan refleksi internal.
                </li>
                <li>
                  <strong className="font-black text-base uppercase">S (Sensing) vs N (Intuition):</strong> Cara menerima informasi. Sensing berfokus pada fakta, kelima indera, dan realitas masa kini. Intuition berfokus pada pola, makna tersembunyi, dan kemungkinan masa depan.
                </li>
                <li>
                  <strong className="font-black text-base uppercase">T (Thinking) vs F (Feeling):</strong> Cara mengambil keputusan. Thinking mengutamakan logika murni, objektivitas, dan analisis. Feeling mengutamakan nilai-nilai personal, harmoni, dan empati terhadap perasaan orang lain.
                </li>
                <li>
                  <strong className="font-black text-base uppercase">J (Judging) vs P (Perceiving):</strong> Gaya hidup dan cara bertindak. Judging lebih menyukai rencana yang terstruktur, keteraturan, dan kejelasan. Perceiving lebih menyukai spontanitas, fleksibilitas, dan membiarkan opsi tetap terbuka.
                </li>
              </ul>
            </div>
          </Kartu>

          <Kartu className="flex flex-col justify-start gap-6 h-full rounded-2xl border-4 border-[var(--border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[var(--kedua)] text-[var(--kedua-foreground)]">
            <KartuJudul className="flex items-center gap-3"><Lightbulb className="w-8 h-8" /> Saran Pengembangan</KartuJudul>
            <KartuDeskripsi className="text-lg font-bold opacity-100 text-inherit">
              {hasil.saran}
            </KartuDeskripsi>
            <div className="h-1 w-full bg-[var(--kedua-foreground)] opacity-20 my-2"></div>
            <KartuJudul>Aksi Lanjutan</KartuJudul>
            <KartuDeskripsi className="opacity-90 font-medium text-inherit">
              Unduh hasil tes Anda sebagai file PDF atau ulangi kuesioner jika Anda merasa ada yang kurang tepat.
            </KartuDeskripsi>

            <Tombol varian="utama" ukuran="lg" onClick={unduhPDF} className="w-full gap-2 justify-center bg-[var(--utama)] text-[var(--utama-foreground)] border-4 border-[var(--border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <Download className="w-5 h-5" /> Unduh Laporan PDF
            </Tombol>

            <Tombol varian="outline" ukuran="lg" onClick={ulangiTes} className="w-full gap-2 justify-center bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)] border-4 border-[var(--border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <RotateCcw className="w-5 h-5" /> Ulangi Tes
            </Tombol>
          </Kartu>
        </div>
      </div>

      {}
      <div style={{ display: "none" }}>
        <div ref={pdfRef} className="w-full bg-white text-black absolute top-0 left-0 print:static">
          <div className="w-[794px] min-h-[1123px] mx-auto p-12 font-sans flex flex-col box-border">

          <div className="border-4 border-black p-6 bg-[#ff5252] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10">
            <h1 className="text-5xl font-black uppercase text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">Laporan Hasil Tes</h1>
            <p className="text-xl font-black mt-2 text-white">Sistem Pakar MBTI</p>
          </div>

          <div className="border-4 border-black p-8 bg-[#ffe66d] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10 text-center">
            <h2 className="text-xl font-black uppercase mb-2 opacity-80 tracking-widest">Tipe Kepribadian Anda:</h2>
            <div className="text-[100px] font-black uppercase leading-none tracking-tighter mb-4">{hasil.tipe_dominan}</div>
            <p className="text-lg font-bold px-8">{hasil.keterangan}</p>
          </div>

          <div className="flex-1 border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col mb-10">
            <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 tracking-tighter">Rincian Dimensi</h3>
            <div className="space-y-6 mt-2">
              <BarDimensiCetak label1="E (Extraversion)" val1={hasil.persentase.E} label2="I (Introversion)" val2={hasil.persentase.I} warna="#ff5252" />
              <BarDimensiCetak label1="S (Sensing)" val1={hasil.persentase.S} label2="N (Intuition)" val2={hasil.persentase.N} warna="#4ecdc4" />
              <BarDimensiCetak label1="T (Thinking)" val1={hasil.persentase.T} label2="F (Feeling)" val2={hasil.persentase.F} warna="#ff5252" />
              <BarDimensiCetak label1="J (Judging)" val1={hasil.persentase.J} label2="P (Perceiving)" val2={hasil.persentase.P} warna="#4ecdc4" />
            </div>
          </div>

          <div className="border-4 border-black p-8 bg-[#4ecdc4] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10">
            <h3 className="text-2xl font-black uppercase mb-2 tracking-tighter">Saran Pengembangan:</h3>
            <p className="text-lg font-bold">{hasil.saran}</p>
          </div>

          <div className="mt-auto text-center font-black text-gray-400 uppercase tracking-widest text-xs border-t-4 border-gray-200 pt-6">
            Dihasilkan oleh MBTI Pakar pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

        </div>
      </div>
      </div>
    </main>
  );
}

export default function Hasil() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase text-xl">Memuat...</div>}>
      <KontenHasil />
    </Suspense>
  );
}
