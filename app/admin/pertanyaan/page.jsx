"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utilitas/supabase";
import { Kartu, KartuJudul } from "@/komponen/Kartu";
import { Tombol } from "@/komponen/Tombol";
import { Plus, Trash2 } from "lucide-react";

export default function KelolaPertanyaan() {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ sikap: "", opsi_a_teks: "", opsi_a_nilai: "E", opsi_b_teks: "", opsi_b_nilai: "I" });

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
            <input required type="text" value={form.sikap} onChange={(e) => setForm({...form, sikap: e.target.value})} className="w-full p-2 neobrutalism-box bg-white text-black" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-sm uppercase block mb-1">Opsi A</label>
              <input required type="text" value={form.opsi_a_teks} onChange={(e) => setForm({...form, opsi_a_teks: e.target.value})} className="w-full p-2 mb-2 neobrutalism-box bg-white text-black" placeholder="Teks Opsi A" />
              <select value={form.opsi_a_nilai} onChange={(e) => setForm({...form, opsi_a_nilai: e.target.value})} className="w-full p-2 neobrutalism-box bg-white text-black">
                <option value="E">Extraversion (E)</option>
                <option value="I">Introversion (I)</option>
                <option value="S">Sensing (S)</option>
                <option value="N">Intuition (N)</option>
                <option value="T">Thinking (T)</option>
                <option value="F">Feeling (F)</option>
                <option value="J">Judging (J)</option>
                <option value="P">Perceiving (P)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-sm uppercase block mb-1">Opsi B</label>
              <input required type="text" value={form.opsi_b_teks} onChange={(e) => setForm({...form, opsi_b_teks: e.target.value})} className="w-full p-2 mb-2 neobrutalism-box bg-white text-black" placeholder="Teks Opsi B" />
              <select value={form.opsi_b_nilai} onChange={(e) => setForm({...form, opsi_b_nilai: e.target.value})} className="w-full p-2 neobrutalism-box bg-white text-black">
                <option value="E">Extraversion (E)</option>
                <option value="I">Introversion (I)</option>
                <option value="S">Sensing (S)</option>
                <option value="N">Intuition (N)</option>
                <option value="T">Thinking (T)</option>
                <option value="F">Feeling (F)</option>
                <option value="J">Judging (J)</option>
                <option value="P">Perceiving (P)</option>
              </select>
            </div>
          </div>
          <Tombol varian="utama" type="submit" className="gap-2">
            <Plus className="w-4 h-4" /> Simpan Soal
          </Tombol>
        </form>
      </Kartu>

      <div className="space-y-4">
        <h3 className="font-black text-xl uppercase tracking-tight">Daftar Soal ({soal.length})</h3>
        {loading ? <p>Memuat...</p> : soal.map((s, idx) => (
          <Kartu key={s.idsikap} className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span className="font-bold uppercase text-xs px-2 py-1 bg-[var(--aksen)] text-[var(--aksen-foreground)] mr-2 border border-black">#{idx + 1}</span>
              <span className="font-bold text-lg">{s.sikap}</span>
              <div className="mt-2 text-sm text-[var(--muted-foreground)] flex flex-col gap-1">
                <div><strong>A ({s.opsi_a_nilai}):</strong> {s.opsi_a_teks}</div>
                <div><strong>B ({s.opsi_b_nilai}):</strong> {s.opsi_b_teks}</div>
              </div>
            </div>
            <Tombol varian="outline" ukuran="sm" onClick={() => hapusSoal(s.idsikap)} className="bg-[var(--utama)] text-[var(--utama-foreground)]">
              <Trash2 className="w-4 h-4" />
            </Tombol>
          </Kartu>
        ))}
      </div>
    </div>
  );
}
