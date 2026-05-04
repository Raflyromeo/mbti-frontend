"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function NeoSelect({ value, onChange, options, placeholder = "Pilih...", className = "" }) {
  const [buka, setBuka] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setBuka(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setBuka(!buka)}
        className="w-full neobrutalism-box p-3 bg-white text-black flex justify-between items-center font-bold cursor-pointer"
      >
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${buka ? "rotate-180" : ""}`} />
      </button>
      {buka && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden flex flex-col">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setBuka(false); }}
              className={`p-3 text-left font-bold transition-colors border-b-2 border-black last:border-b-0 hover:bg-yellow-300 text-black ${value === opt.value ? "bg-yellow-300" : "bg-white"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NeoDatePicker({ value, onChange, className = "" }) {
  const [buka, setBuka] = useState(false);
  const ref = useRef(null);

  const today = new Date();
  const [bulanTampil, setBulanTampil] = useState(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      return { bulan: d.getMonth(), tahun: d.getFullYear() };
    }
    return { bulan: today.getMonth(), tahun: today.getFullYear() };
  });

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setBuka(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const namaBulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const hariPertama = new Date(bulanTampil.tahun, bulanTampil.bulan, 1).getDay();
  const jumlahHari = new Date(bulanTampil.tahun, bulanTampil.bulan + 1, 0).getDate();

  const pilihTanggal = (hari) => {
    const tgl = `${bulanTampil.tahun}-${String(bulanTampil.bulan + 1).padStart(2,"0")}-${String(hari).padStart(2,"0")}`;
    onChange(tgl);
    setBuka(false);
  };

  const formatTampil = (val) => {
    if (!val) return null;
    const d = new Date(val + "T00:00:00");
    return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
  };

  const bulanSebelum = () => {
    setBulanTampil(prev => {
      if (prev.bulan === 0) return { bulan: 11, tahun: prev.tahun - 1 };
      return { bulan: prev.bulan - 1, tahun: prev.tahun };
    });
  };

  const bulanBerikut = () => {
    setBulanTampil(prev => {
      if (prev.bulan === 11) return { bulan: 0, tahun: prev.tahun + 1 };
      return { bulan: prev.bulan + 1, tahun: prev.tahun };
    });
  };

  const selectedDay = value ? parseInt(value.split("-")[2]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selectedYear = value ? parseInt(value.split("-")[0]) : null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setBuka(!buka)}
        className="w-full neobrutalism-box p-3 bg-white text-black flex justify-between items-center font-bold cursor-pointer"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value ? formatTampil(value) : "Pilih tanggal lahir..."}
        </span>
        <ChevronDown className={`w-5 h-5 text-black transition-transform duration-200 ${buka ? "rotate-180" : ""}`} />
      </button>

      {buka && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 p-3">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <button
              type="button"
              onClick={bulanSebelum}
              className="font-black px-3 py-1 border-2 border-black bg-white text-black hover:bg-yellow-300 transition-colors"
            >
              ‹
            </button>
            <span className="font-black text-sm uppercase text-black">{namaBulan[bulanTampil.bulan]} {bulanTampil.tahun}</span>
            <button
              type="button"
              onClick={bulanBerikut}
              className="font-black px-3 py-1 border-2 border-black bg-white text-black hover:bg-yellow-300 transition-colors"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(h => (
              <div key={h} className="text-center text-[10px] font-black uppercase text-gray-500 pb-1">{h}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: hariPertama }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: jumlahHari }).map((_, i) => {
              const hari = i + 1;
              const aktif = selectedDay === hari && selectedMonth === bulanTampil.bulan && selectedYear === bulanTampil.tahun;
              return (
                <button
                  key={hari}
                  type="button"
                  onClick={() => pilihTanggal(hari)}
                  className={`text-center text-xs font-bold py-1.5 border-2 transition-colors text-black
                    ${aktif
                      ? "bg-yellow-300 border-black"
                      : "bg-white border-transparent hover:border-black hover:bg-yellow-100"
                    }`}
                >
                  {hari}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
