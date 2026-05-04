"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { SkeletonDasbor } from "@/komponen/Skeleton";
import Link from "next/link";
import { Play, ArrowRight, BrainCircuit, History, Clock, ChevronRight } from "lucide-react";

export function DasborUser() {
  const [nama, setNama] = useState("Pengguna");
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from("user")
          .select("nama")
          .eq("iduser", session.user.id)
          .maybeSingle();
        if (userData?.nama) setNama(userData.nama.split(" ")[0]);

        const { data: hasilData } = await supabase
          .from("hasil")
          .select(`idhasil, created_at, skor_persentase, tipe_kepribadian ( nama_tipe )`)
          .eq("iduser", session.user.id)
          .order("created_at", { ascending: false });

        if (hasilData) setRiwayat(hasilData);
      }
      setLoading(false);
    };
    ambilData();
  }, []);

  if (loading) return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-6" />
      <SkeletonDasbor />
    </div>
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 md:space-y-10">
        <Breadcrumb />

        <section className="neobrutalism-box bg-[var(--utama)] text-[var(--utama-foreground)] p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <div className="flex-1 space-y-4 text-center sm:text-left w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
              Halo,<br />{nama}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-bold max-w-xl mx-auto sm:mx-0 opacity-90">
              Selamat datang kembali. Kenali diri Anda lebih dalam dan temukan potensi tersembunyi Anda!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Link href="/tes">
                <Tombol varian="outline" className="bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--kedua)] text-base sm:text-lg py-3 sm:py-4 px-5 sm:px-8 gap-2 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Mulai Tes Baru
                </Tombol>
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex p-6 md:p-8 bg-[var(--background)] text-[var(--foreground)] border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <BrainCircuit className="w-24 h-24 md:w-36 md:h-36" />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Riwayat Tes</h2>
            </div>
            <div className="h-0.5 flex-1 bg-[var(--border)]" />
            {riwayat.length > 0 && (
              <span className="text-xs font-bold border-2 border-[var(--border)] px-2 py-0.5 rounded-full">{riwayat.length} tes</span>
            )}
          </div>

          {riwayat.length === 0 ? (
            <div className="neobrutalism-box rounded-2xl p-8 sm:p-12 bg-[var(--kedua)] text-[var(--kedua-foreground)] text-center">
              <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" />
              <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">Belum Ada Data</h3>
              <p className="font-bold text-sm sm:text-base opacity-70">Anda belum pernah mengikuti tes. Silakan mulai tes pertama Anda!</p>
              <Link href="/tes" className="inline-block mt-6">
                <Tombol varian="utama" className="gap-2">
                  <Play className="w-4 h-4 fill-current" /> Mulai Sekarang
                </Tombol>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {riwayat.map((item, idx) => (
                <Kartu key={item.idhasil} className={`${idx === 0 ? "bg-[var(--aksen)] text-[var(--aksen-foreground)]" : "bg-[var(--card)] text-[var(--card-foreground)]"} rounded-2xl`}>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      {idx === 0 && (
                        <span className="inline-block bg-[var(--foreground)] text-[var(--background)] text-[10px] font-bold uppercase px-2 py-0.5 mb-2 rounded-md">
                          Terbaru
                        </span>
                      )}
                      <h3 className="text-2xl sm:text-3xl font-black leading-none">{item.tipe_kepribadian?.nama_tipe || "—"}</h3>
                      <p className="text-xs font-bold opacity-60 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Link href={`/hasil?id=${item.idhasil}`} className="shrink-0">
                      <Tombol varian="outline" ukuran="sm" className="bg-[var(--background)] text-[var(--foreground)] border-2 gap-1 text-xs px-2 py-1.5">
                        Detail <ChevronRight className="w-3 h-3" />
                      </Tombol>
                    </Link>
                  </div>

                  {item.skor_persentase && (
                    <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t-2 border-black/10">
                      {["E-I", "S-N", "T-F", "J-P"].map((dim) => {
                        const hurufs = dim.split("-");
                        const skorA = item.skor_persentase[hurufs[0]] || 0;
                        const skorB = item.skor_persentase[hurufs[1]] || 0;
                        const dominan = skorA > skorB ? hurufs[0] : hurufs[1];
                        const persen = Math.round(Math.max(skorA, skorB));
                        return (
                          <div key={dim} className={`flex flex-col gap-1 p-2 rounded border-2 border-black/10 ${idx === 0 ? "bg-black/5" : "bg-[var(--muted)]/50"}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase opacity-60">{dim}</span>
                              <span className="text-[10px] font-black">{dominan} {persen}%</span>
                            </div>
                            <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--utama)] rounded-full"
                                style={{ width: `${persen}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Kartu>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
