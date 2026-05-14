"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Tombol } from "@/komponen/Tombol";
import { Kartu, KartuJudul, KartuDeskripsi } from "@/komponen/Kartu";
import { Breadcrumb } from "@/komponen/Breadcrumb";
import { NeoSelect, NeoDatePicker } from "@/komponen/NeoSelect";
import { SkeletonProfil } from "@/komponen/Skeleton";
import { useRouter } from "next/navigation";
import { User, Save, Upload, X, Mail } from "lucide-react";

const OPSI_KELAMIN = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
];

export default function Profil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState({ teks: "", tipe: "" });
  const [userId, setUserId] = useState(null);
  const [emailSession, setEmailSession] = useState("");
  const [fileAvatar, setFileAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const inputFileRef = useRef(null);

  const [profil, setProfil] = useState({
    nama: "",
    username: "",
    tgllahir: null,
    jenis_kelamin: "",
    pekerjaan: "",
    tlp: "",
    alamat: "",
    avatar_url: ""
  });

  useEffect(() => {
    const ambilProfil = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/masuk"); return; }
      setUserId(session.user.id);
      setEmailSession(session.user.email || "");

      const { data, error } = await supabase
        .from("user")
        .select("nama, username, email, tgllahir, jenis_kelamin, pekerjaan, tlp, alamat, avatar_url")
        .eq("iduser", session.user.id)
        .maybeSingle();

      if (!error && data) {
        setProfil({
          nama: data.nama || "",
          username: data.username || "",
          tgllahir: data.tgllahir || null,
          jenis_kelamin: data.jenis_kelamin || "",
          pekerjaan: data.pekerjaan || "",
          tlp: data.tlp || "",
          alamat: data.alamat || "",
          avatar_url: data.avatar_url || ""
        });
        setEmailSession(data.email || session.user.email || "");
        if (data.avatar_url) setPreviewAvatar(data.avatar_url);
      } else {
        setEmailSession(session.user.email || "");
      }
      setLoading(false);
    };
    ambilProfil();
  }, [router]);

  const tanganiPilihFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const hapusAvatar = () => {
    setFileAvatar(null);
    setPreviewAvatar(null);
    setProfil(prev => ({ ...prev, avatar_url: "" }));
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  const tanganiSimpan = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setMenyimpan(true);
    setPesan({ teks: "", tipe: "" });

    let finalAvatarUrl = profil.avatar_url;

    if (fileAvatar) {
      try {
        const ekstensi = fileAvatar.name.split(".").pop();
        const namaFile = `avatar-${userId}-${Date.now()}.${ekstensi}`;

        const { error: errUpload } = await supabase.storage
          .from("avatars")
          .upload(namaFile, fileAvatar, { upsert: true, contentType: fileAvatar.type });

        if (errUpload) {
          setPesan({ teks: `Gagal upload foto (${errUpload.message}). Cek bucket 'avatars' di Supabase Storage.`, tipe: "error" });
          setMenyimpan(false);
          return;
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(namaFile);
        finalAvatarUrl = urlData.publicUrl;
      } catch (err) {
        setPesan({ teks: "Gagal upload foto: " + err.message, tipe: "error" });
        setMenyimpan(false);
        return;
      }
    }

    const profilUpdate = {
      ...profil,
      avatar_url: finalAvatarUrl,
      tgllahir: profil.tgllahir || null,
    };
    delete profilUpdate.email;

    const { error } = await supabase
      .from("user")
      .update(profilUpdate)
      .eq("iduser", userId);

    if (error) {
      setPesan({ teks: "Gagal menyimpan profil: " + error.message, tipe: "error" });
    } else {
      setProfil(profilUpdate);
      if (finalAvatarUrl) setPreviewAvatar(finalAvatarUrl);
      setFileAvatar(null);
      setPesan({ teks: "Profil berhasil diperbarui!", tipe: "sukses" });
    }
    setMenyimpan(false);
  };

  if (loading) return (
    <main className="min-h-screen bg-[var(--muted)] p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
        <Kartu className="border-4 border-black">
          <SkeletonProfil />
        </Kartu>
      </div>
    </main>
  );

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

            <div className="space-y-2">
              <label className="font-bold text-sm uppercase">Foto Profil</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-4 border-black rounded-full overflow-hidden bg-[var(--kedua)] flex items-center justify-center shrink-0">
                  {previewAvatar
                    ? <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                    : <span className="font-black text-2xl">{profil.nama.charAt(0).toUpperCase() || "?"}</span>
                  }
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => inputFileRef.current?.click()}
                    className="neobrutalism-box px-4 py-2 bg-[var(--kedua)] font-bold text-sm flex items-center gap-2 hover:bg-[var(--aksen)] transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Pilih Foto
                  </button>
                  {previewAvatar && (
                    <button
                      type="button"
                      onClick={hapusAvatar}
                      className="neobrutalism-box px-4 py-2 bg-red-400 text-white font-bold text-sm flex items-center gap-2 hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" /> Hapus Foto
                    </button>
                  )}
                  <p className="text-xs text-[var(--muted-foreground)] font-bold">JPG, PNG, WEBP (maks. 2MB)</p>
                </div>
              </div>
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={tanganiPilihFile}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">Nama Lengkap</label>
                <input
                  type="text"
                  value={profil.nama}
                  onChange={(e) => setProfil({ ...profil, nama: e.target.value })}
                  className="w-full neobrutalism-box p-3 min-h-[48px] bg-white text-black"
                  placeholder="Cth: Rafly Ganteng"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">
                  Email <span className="normal-case font-normal text-gray-400 text-[11px]">(dari akun Google, tidak bisa diubah)</span>
                </label>
                <div className="w-full neobrutalism-box p-3 min-h-[48px] bg-gray-100 text-gray-500 font-bold text-sm flex items-center gap-2 cursor-not-allowed">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{emailSession || "—"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">
                  Username <span className="normal-case font-normal text-gray-400 text-[11px]">(huruf kecil, tanpa spasi)</span>
                </label>
                <input
                  type="text"
                  value={profil.username}
                  onChange={(e) => setProfil({ ...profil, username: e.target.value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "") })}
                  className="w-full neobrutalism-box p-3 min-h-[48px] bg-white text-black"
                  placeholder="Cth: raflygantengbanget"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">Nomor Telepon</label>
                <input
                  type="text"
                  value={profil.tlp}
                  onChange={(e) => setProfil({ ...profil, tlp: e.target.value })}
                  className="w-full neobrutalism-box p-3 min-h-[48px] bg-white text-black"
                  placeholder="Cth: 08123456789"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">Tanggal Lahir</label>
                <NeoDatePicker
                  value={profil.tgllahir}
                  onChange={(val) => setProfil({ ...profil, tgllahir: val })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wide">Jenis Kelamin</label>
                <NeoSelect
                  value={profil.jenis_kelamin}
                  onChange={(val) => setProfil({ ...profil, jenis_kelamin: val })}
                  options={OPSI_KELAMIN}
                  placeholder="Pilih Jenis Kelamin..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-bold text-sm uppercase">Pekerjaan</label>
                <input
                  type="text"
                  value={profil.pekerjaan}
                  onChange={(e) => setProfil({ ...profil, pekerjaan: e.target.value })}
                  className="w-full neobrutalism-box p-3 bg-white text-black"
                  placeholder="Cth: Mahasiswa / Software Engineer"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-bold text-sm uppercase">Alamat Lengkap</label>
                <textarea
                  rows="3"
                  value={profil.alamat}
                  onChange={(e) => setProfil({ ...profil, alamat: e.target.value })}
                  className="w-full neobrutalism-box p-3 bg-white text-black"
                  placeholder="Cth: Jl. Raya Pekayon"
                />
              </div>
            </div>

            {pesan.teks && (
              <div className={`p-4 border-2 border-black font-bold uppercase text-sm ${pesan.tipe === "error" ? "bg-red-400 text-white" : "bg-[var(--kedua)] text-black"}`}>
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
