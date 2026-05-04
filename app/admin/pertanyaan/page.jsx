"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Kartu, KartuJudul } from "@/komponen/Kartu";
import { Tombol } from "@/komponen/Tombol";
import { NeoSelect } from "@/komponen/NeoSelect";
import { Plus, Trash2 } from "lucide-react";

const OPSI_NILAI_MBTI = [
  { value: "E", label: "Extraversion (E)" },
  { value: "I", label: "Introversion (I)" },
  { value: "S", label: "Sensing (S)" },
  { value: "N", label: "Intuition (N)" },
  { value: "T", label: "Thinking (T)" },
  { value: "F", label: "Feeling (F)" },
  { value: "J", label: "Judging (J)" },
  { value: "P", label: "Perceiving (P)" },
];

export default function KelolaPertanyaan() {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    sikap: "",
    opsi_a_teks: "",
    opsi_a_nilai: "E",
    opsi_b_teks: "",
    opsi_b_nilai: "I"
  });

  useEffect(() => {
    ambilSoal();
  }, []);

  const ambilSoal = async () => {
    const { data } = await supabase.from("sikap").select("*").order("idsikap", { ascending: true });
    setSoal(data || []);
    setLoading(false);
  };

  const tambahSoal = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("sikap").insert([form]);
    if (!error) {
      setForm({ sikap: "", opsi_a_teks: "", opsi_a_nilai: "E", opsi_b_teks: "", opsi_b_nilai: "I" });
      ambilSoal();
    } else {
      alert("Gagal menambah soal.");
    }
  };

  const hapusSoal = async (id) => {
    if (confirm("Yakin ingin menghapus soal ini?")) {
      await supabase.from("sikap").delete().eq("idsikap", id);
      ambilSoal();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <KartuJudul className="text-4xl mb-0">Kelola Soal</KartuJudul>
      </div>

      <Kartu className="bg-[var(--kedua)] text-[var(--kedua-foreground)]">
        <KartuJudul className="text-xl mb-4">Tambah Soal Baru</KartuJudul>
        <form onSubmit={tambahSoal} className="space-y-4">
          <div>
            <label className="font-bold text-sm uppercase block mb-1">Pertanyaan (Sikap)</label>
            <input
              required
              type="text"
              value={form.sikap}
              onChange={(e) => setForm({ ...form, sikap: e.target.value })}
              className="w-full p-3 neobrutalism-box bg-white text-black"
              placeholder="Tulis pertanyaan di sini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-bold text-sm uppercase block">Opsi A</label>
              <input
                required
                type="text"
                value={form.opsi_a_teks}
                onChange={(e) => setForm({ ...form, opsi_a_teks: e.target.value })}
                className="w-full p-3 neobrutalism-box bg-white text-black"
                placeholder="Teks Opsi A"
              />
              <div className="space-y-1">
                <label className="font-bold text-xs uppercase text-[var(--muted-foreground)]">Nilai Dimensi Opsi A</label>
                <NeoSelect
                  value={form.opsi_a_nilai}
                  onChange={(val) => setForm({ ...form, opsi_a_nilai: val })}
                  options={OPSI_NILAI_MBTI}
                  placeholder="Pilih dimensi..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-sm uppercase block">Opsi B</label>
              <input
                required
                type="text"
                value={form.opsi_b_teks}
                onChange={(e) => setForm({ ...form, opsi_b_teks: e.target.value })}
                className="w-full p-3 neobrutalism-box bg-white text-black"
                placeholder="Teks Opsi B"
              />
              <div className="space-y-1">
                <label className="font-bold text-xs uppercase text-[var(--muted-foreground)]">Nilai Dimensi Opsi B</label>
                <NeoSelect
                  value={form.opsi_b_nilai}
                  onChange={(val) => setForm({ ...form, opsi_b_nilai: val })}
                  options={OPSI_NILAI_MBTI}
                  placeholder="Pilih dimensi..."
                />
              </div>
            </div>
          </div>

          <Tombol varian="utama" type="submit" className="gap-2">
            <Plus className="w-4 h-4" /> Simpan Soal
          </Tombol>
        </form>
      </Kartu>

      <div className="space-y-4">
        <h3 className="font-black text-xl uppercase tracking-tight">Daftar Soal ({soal.length})</h3>
        {loading ? (
          <p className="font-bold">Memuat...</p>
        ) : soal.map((s, idx) => (
          <Kartu key={s.idsikap} className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span className="font-bold uppercase text-xs px-2 py-1 bg-[var(--aksen)] text-[var(--aksen-foreground)] mr-2 border border-black">#{idx + 1}</span>
              <span className="font-bold text-lg">{s.sikap}</span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-blue-50 border-2 border-black p-2 rounded">
                  <span className="font-black text-xs uppercase text-blue-700 block mb-0.5">Opsi A — {s.opsi_a_nilai}</span>
                  <span className="text-sm font-bold">{s.opsi_a_teks}</span>
                </div>
                <div className="bg-green-50 border-2 border-black p-2 rounded">
                  <span className="font-black text-xs uppercase text-green-700 block mb-0.5">Opsi B — {s.opsi_b_nilai}</span>
                  <span className="text-sm font-bold">{s.opsi_b_teks}</span>
                </div>
              </div>
            </div>
            <Tombol varian="outline" ukuran="sm" onClick={() => hapusSoal(s.idsikap)} className="bg-red-400 text-white border-black hover:bg-red-500 shrink-0">
              <Trash2 className="w-4 h-4" />
            </Tombol>
          </Kartu>
        ))}
      </div>
    </div>
  );
}
