"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { useRouter } from "next/navigation";
import { User, Save, ArrowLeft, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Profil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState({ teks: "", tipe: "" });
  const [dropdownBukaKelamin, setDropdownBukaKelamin] = useState(false);
  const [profil, setProfil] = useState({
    nama: "",
    tgllahir: "",
    jenis_kelamin: "",
    pekerjaan: "",
    tlp: "",
    alamat: "",
    avatar_url: ""
  });

  useEffect(() => {
    const ambilProfil = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/masuk");
        return;
      }

      const { data, error } = await supabase
        .from("user")
        .select("nama, tgllahir, jenis_kelamin, pekerjaan, tlp, alamat, avatar_url")
        .eq("iduser", session.user.id)
        .single();

      if (!error && data) {
        setProfil({
          nama: data.nama || "",
          tgllahir: data.tgllahir || "",
          jenis_kelamin: data.jenis_kelamin || "",
          pekerjaan: data.pekerjaan || "",
          tlp: data.tlp || "",
          alamat: data.alamat || "",
          avatar_url: data.avatar_url || ""
        });
      }
      setLoading(false);
    };
    ambilProfil();
  }, [router]);

  const tanganiSimpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan({ teks: "", tipe: "" });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("user")
      .update(profil)
      .eq("iduser", session.user.id);

    if (error) {
      setPesan({ teks: "Gagal menyimpan profil.", tipe: "error" });
    } else {
      setPesan({ teks: "Profil berhasil diperbarui!", tipe: "sukses" });
    }
    setMenyimpan(false);
  };

  const keluar = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <main className="min-h-screen bg-[var(--background)]"></main>;

  return (
    <main className="min-h-screen bg-[var(--muted)] p-6 md:p-12 relative">
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <Breadcrumb />

        <Kartu className="border-4 border-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User className="w-64 h-64" />
          </div>
          
          <KartuJudul className="text-4xl mb-2 relative z-10">Profil Saya</KartuJudul>
          <KartuDeskripsi className="text-lg relative z-10">
            Lengkapi data diri Anda agar hasil tes MBTI bisa disesuaikan dengan latar belakang Anda.
          </KartuDeskripsi>

          <form onSubmit={tanganiSimpan} className="mt-8 space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase">Nama Lengkap</label>
                <input type="text" value={profil.nama} onChange={(e) => setProfil({...profil, nama: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" placeholder="Cth: Budi Utami" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase">Nomor Telepon</label>
                <input type="text" value={profil.tlp} onChange={(e) => setProfil({...profil, tlp: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" placeholder="Cth: 08123456789" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-bold text-sm uppercase">Link Foto Profil (Avatar URL)</label>
                <input type="url" value={profil.avatar_url} onChange={(e) => setProfil({...profil, avatar_url: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" placeholder="Cth: https://example.com/foto.jpg" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase">Tanggal Lahir</label>
                <input type="date" value={profil.tgllahir} onChange={(e) => setProfil({...profil, tgllahir: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" />
              </div>
              <div className="space-y-2 relative">
                <label className="font-bold text-sm uppercase">Jenis Kelamin</label>
                <div 
                  className="w-full neobrutalism-box p-3 bg-white text-black cursor-pointer flex justify-between items-center"
                  onClick={() => setDropdownBukaKelamin(!dropdownBukaKelamin)}
                >
                  <span>{profil.jenis_kelamin || "Pilih Kelamin"}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownBukaKelamin ? "rotate-180" : ""}`} />
                </div>
                {dropdownBukaKelamin && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white text-black border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden flex flex-col">
                    <button type="button" className="p-3 text-left hover:bg-[var(--aksen)] font-bold transition-colors border-b-2 border-black" onClick={() => { setProfil({...profil, jenis_kelamin: "Laki-laki"}); setDropdownBukaKelamin(false); }}>Laki-laki</button>
                    <button type="button" className="p-3 text-left hover:bg-[var(--aksen)] font-bold transition-colors" onClick={() => { setProfil({...profil, jenis_kelamin: "Perempuan"}); setDropdownBukaKelamin(false); }}>Perempuan</button>
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-bold text-sm uppercase">Pekerjaan</label>
                <input type="text" value={profil.pekerjaan} onChange={(e) => setProfil({...profil, pekerjaan: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" placeholder="Cth: Mahasiswa / Software Engineer" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-bold text-sm uppercase">Alamat Lengkap</label>
                <textarea rows="3" value={profil.alamat} onChange={(e) => setProfil({...profil, alamat: e.target.value})} className="w-full neobrutalism-box p-3 bg-white text-black" placeholder="Cth: Jl. Margonda Raya..."></textarea>
              </div>
            </div>

            {pesan.teks && (
              <div className={`p-4 border-2 border-black font-bold uppercase text-sm ${pesan.tipe === "error" ? "bg-red-400" : "bg-[var(--kedua)] text-black"}`}>
                {pesan.teks}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Tombol varian="utama" type="submit" disabled={menyimpan} className="gap-2 text-lg py-4 px-8 bg-[var(--aksen)] text-black hover:bg-yellow-400">
                <Save className="w-5 h-5" /> {menyimpan ? "Menyimpan..." : "Simpan Profil"}
              </Tombol>
            </div>
          </form>
        </Kartu>
      </div>
    </main>
  );
}
