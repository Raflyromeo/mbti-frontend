"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import Link from "next/link";
import { Play, ArrowRight, BrainCircuit, History } from "lucide-react";

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
          .select(`
            idhasil, 
            created_at, 
            skor_persentase,
            tipe_kepribadian ( nama_tipe )
          `)
          .eq("iduser", session.user.id)
          .order("created_at", { ascending: false });

        if (hasilData) {
          setRiwayat(hasilData);
        }
      }
      setLoading(false);
    };
    ambilData();
  }, []);

  return (
    <div className="flex flex-col min-h-full relative overflow-x-hidden">
      
      <div className="absolute inset-0 pattern-dots opacity-5 pointer-events-none z-0"></div>

      <div className="flex-1 p-6 md:p-12 space-y-12 relative z-10">
        <Breadcrumb />
        
        
        <section className="neobrutalism-box bg-[var(--utama)] text-[var(--utama-foreground)] p-6 lg:p-16 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-tight">
              Halo, <br/> {nama}!
            </h1>
            <p className="text-lg lg:text-2xl font-bold max-w-xl mx-auto lg:mx-0">
              Selamat datang kembali. Kenali diri Anda lebih dalam dan temukan potensi tersembunyi Anda!
            </p>
            <Link href="/tes" className="inline-block mt-2">
              <Tombol varian="outline" className="bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--kedua)] hover:text-[var(--kedua-foreground)] text-lg lg:text-xl py-4 lg:py-6 px-6 lg:px-8 gap-3 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current" /> Mulai Tes Baru
              </Tombol>
            </Link>
          </div>
          <div className="hidden lg:flex p-8 bg-[var(--background)] text-[var(--foreground)] border-4 border-black rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <BrainCircuit className="w-48 h-48" />
          </div>
        </section>

        
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">Riwayat Tes Anda</h2>
            <div className="h-1 flex-1 bg-[var(--foreground)] hidden lg:block"></div>
          </div>
          
          {loading ? (
            <p className="font-bold">Memuat riwayat...</p>
          ) : riwayat.length === 0 ? (
            <div className="neobrutalism-box rounded-2xl p-8 bg-[var(--kedua)] text-[var(--kedua-foreground)] text-center">
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-black uppercase mb-2">Belum Ada Data</h3>
              <p className="font-bold">Anda belum pernah mengikuti tes. Silakan mulai tes pertama Anda!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riwayat.map((item, idx) => (
                <Kartu key={item.idhasil} className={`${idx === 0 ? 'bg-[var(--aksen)] text-[var(--aksen-foreground)]' : 'bg-[var(--card)] text-[var(--card-foreground)]'} rounded-2xl`}>
                  {idx === 0 && <span className="inline-block bg-[var(--foreground)] text-[var(--background)] text-xs font-bold uppercase px-2 py-1 mb-2 rounded-md">Terbaru</span>}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-3xl font-black">{item.tipe_kepribadian?.nama_tipe || "Menghitung..."}</h3>
                      <p className="text-sm font-bold opacity-70">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link href={`/hasil?id=${item.idhasil}`}>
                        <Tombol varian="outline" ukuran="sm" className="bg-[var(--background)] text-[var(--foreground)] border-2 gap-2">
                          Detail <ArrowRight className="w-4 h-4" />
                        </Tombol>
                      </Link>
                    </div>
                  </div>
                  
                  
                  {item.skor_persentase && (
                    <div className="space-y-2 mt-4 pt-4 border-t-2 border-black/20">
                      <p className="text-xs font-bold uppercase">Ringkasan Dimensi:</p>
                      {['E-I', 'S-N', 'T-F', 'J-P'].map((dim) => {
                        const hurufs = dim.split('-');
                        const skorA = item.skor_persentase[hurufs[0]] || 0;
                        const skorB = item.skor_persentase[hurufs[1]] || 0;
                        const dominan = skorA > skorB ? hurufs[0] : hurufs[1];
                        return (
                          <div key={dim} className={`flex justify-between text-sm font-bold border border-black p-1 px-2 rounded-md ${idx === 0 ? 'bg-[var(--aksen-foreground)]/10' : 'bg-[var(--muted)]/50'}`}>
                            <span>{dim}</span>
                            <span className="text-[var(--utama)]">{dominan} Dominan</span>
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
