"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { User, Save, Upload } from "lucide-react";
import Image from "next/image";

export function ProfilUser() {
  const [sesi, setSesi] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [nama, setNama] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [tlp, setTlp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ambilProfil = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSesi(session);

      if (session) {
        const { data } = await supabase
          .from("user")
          .select("*")
          .eq("iduser", session.user.id)
          .maybeSingle();

        if (data) {
          setDataUser(data);
          setNama(data.nama || "");
          setTglLahir(data.tgllahir || "");
          setJenisKelamin(data.jenis_kelamin || "");
          setPekerjaan(data.pekerjaan || "");
          setTlp(data.tlp || "");
          setAlamat(data.alamat || "");
          setAvatarUrl(data.avatar_url || "");
        }
      }
    };
    ambilProfil();
  }, []);

  const simpanProfil = async () => {
    if (!sesi) return;
    setLoading(true);
    setPesan("");

    const { error } = await supabase
      .from("user")
      .update({
        nama,
        tgllahir: tglLahir || null,
        jenis_kelamin: jenisKelamin,
        pekerjaan,
        tlp,
        alamat,
        avatar_url: avatarUrl
      })
      .eq("iduser", sesi.user.id);

    if (error) {
      setPesan("Gagal menyimpan: " + error.message);
    } else {
      setPesan("Profil berhasil diperbarui!");
      window.dispatchEvent(new Event('profilDiperbarui')); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
      <Breadcrumb />

      <Kartu className="border-4 border-black relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <User className="w-64 h-64" />
        </div>
        
        <div className="bg-[var(--utama)] text-[var(--utama-foreground)] p-6 md:p-8 border-b-4 border-black flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black overflow-hidden bg-white shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-black text-4xl">
                {nama ? nama.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <KartuJudul className="text-3xl md:text-4xl mb-2">{nama || "Nama Belum Diatur"}</KartuJudul>
            <KartuDeskripsi className="text-[var(--utama-foreground)] opacity-90 font-bold text-lg">
              {sesi?.user?.email}
            </KartuDeskripsi>
            <span className="inline-block mt-2 bg-black text-white text-xs font-bold uppercase px-2 py-1 rounded-md">
              {dataUser?.tipeuser || "User"}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 bg-white relative z-10 text-black">
          {pesan && (
            <div className={`p-4 font-bold border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${pesan.includes("Gagal") ? "bg-red-400" : "bg-green-400"}`}>
              {pesan}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-black uppercase text-sm">URL Foto Profil (Avatar)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https:
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
            <p className="text-xs font-bold text-gray-500">Tempelkan tautan gambar dari internet untuk mengubah foto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Pekerjaan</label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Tanggal Lahir</label>
              <input
                type="date"
                value={tglLahir}
                onChange={(e) => setTglLahir(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Jenis Kelamin</label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              >
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">No. Telepon</label>
              <input
                type="tel"
                value={tlp}
                onChange={(e) => setTlp(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Alamat</label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-[var(--utama)] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-6 border-t-4 border-black">
            <Tombol 
              onClick={simpanProfil} 
              disabled={loading}
              varian="utama" 
              className="w-full py-4 text-xl bg-[var(--aksen)] text-black hover:bg-yellow-400 gap-3 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg"
            >
              {loading ? "Menyimpan..." : <><Save className="w-6 h-6" /> Simpan Perubahan</>}
            </Tombol>
          </div>
        </div>
      </Kartu>
    </div>
  );
}
