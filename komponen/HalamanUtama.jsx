"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { gunakanTema } from "@/komponen/PenyediaTema";
import {
  BrainCircuit, Play, ShieldCheck, Users, Sun, Moon,
  Menu, LogIn, ChevronDown, ArrowRight, X, Check,
  LayoutDashboard, FileText, BarChart2
} from "lucide-react";


const MBTI_DATA = [
  { tipe: "INTJ", nama: "Arsitek",       border: "border-blue-400",   accent: "#3b82f6", desc: "Perencana strategis yang imajinatif dan berpendirian kuat. Selalu punya rencana cadangan untuk segalanya." },
  { tipe: "INTP", nama: "Pemikir",        border: "border-blue-400",   accent: "#3b82f6", desc: "Inovator haus pengetahuan. Gemar mengeksplorasi ide-ide abstrak dan menyukai teori yang mendalam." },
  { tipe: "ENTJ", nama: "Komandan",       border: "border-orange-400", accent: "#f97316", desc: "Pemimpin berani, imajinatif, dan berkemauan keras. Selalu menemukan cara untuk mencapai tujuannya." },
  { tipe: "ENTP", nama: "Pendebat",       border: "border-orange-400", accent: "#f97316", desc: "Pemikir cerdas yang suka tantangan intelektual dan tak segan berargumentasi demi mencari kebenaran." },
  { tipe: "INFJ", nama: "Penganjur",      border: "border-purple-400", accent: "#a855f7", desc: "Pendiam namun punya visi kuat. Idealis yang selalu berprinsip dan penuh empati terhadap sesama." },
  { tipe: "INFP", nama: "Mediator",       border: "border-purple-400", accent: "#a855f7", desc: "Puitis, baik hati, dan altruistis. Selalu siap membela tujuan mulia yang mereka yakini." },
  { tipe: "ENFJ", nama: "Protagonis",     border: "border-green-400",  accent: "#22c55e", desc: "Pemimpin karismatik dan menginspirasi. Mampu memikat pendengar dan menggerakkan orang menuju kebaikan." },
  { tipe: "ENFP", nama: "Juru Kampanye",  border: "border-green-400",  accent: "#22c55e", desc: "Jiwa bebas yang antusias dan kreatif. Selalu menemukan alasan untuk tersenyum dan menginspirasi orang lain." },
  { tipe: "ISTJ", nama: "Logistik",       border: "border-sky-400",    accent: "#0ea5e9", desc: "Individu praktis dan bertanggung jawab. Dapat diandalkan berkat komitmen dan ketekunannya yang luar biasa." },
  { tipe: "ISFJ", nama: "Pembela",        border: "border-pink-400",   accent: "#ec4899", desc: "Pelindung yang berdedikasi dan hangat. Selalu siap melindungi orang-orang yang mereka cintai." },
  { tipe: "ESTJ", nama: "Eksekutif",      border: "border-amber-400",  accent: "#f59e0b", desc: "Sangat terorganisir dan suka memimpin. Pandai mengelola orang dan proyek secara efisien." },
  { tipe: "ESFJ", nama: "Konsul",         border: "border-rose-400",   accent: "#f43f5e", desc: "Sangat peduli, populer, dan kooperatif. Selalu berusaha memastikan semua orang di sekitarnya merasa bahagia." },
  { tipe: "ISTP", nama: "Pengusaha",      border: "border-slate-400",  accent: "#94a3b8", desc: "Pemberani dan praktis. Senang bereksperimen langsung untuk menemukan cara kerja sesuatu." },
  { tipe: "ISFP", nama: "Petualang",      border: "border-fuchsia-400",accent: "#e879f9", desc: "Artis fleksibel yang menawan. Selalu siap menjelajahi dan merasakan pengalaman baru." },
  { tipe: "ESTP", nama: "Pengusaha Seru", border: "border-yellow-400", accent: "#eab308", desc: "Cerdas, energetik, dan perceptif. Senang hidup di batas dan membuat orang lain terkesan." },
  { tipe: "ESFP", nama: "Entertainer",   border: "border-lime-400",   accent: "#84cc16", desc: "Spontan, energetik, dan antusias. Hidup tidak pernah membosankan di lingkaran mereka." },
];

const MARQUEE_TIPE = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];


function MarqueeTrack() {
  return (
    <div className="overflow-hidden border-y-4 border-black bg-[var(--aksen)] py-3 md:py-4" style={{"--duration":"30s"}}>
      <div className="flex">
        {[0, 1].map((i) => (
          <div key={i} className="flex shrink-0 gap-8 md:gap-12 animate-marquee-track select-none" style={{animationDuration:"30s"}}>
            {MARQUEE_TIPE.map((t, j) => (
              <span key={j} className="font-black text-xl md:text-2xl uppercase text-black tracking-widest px-2 whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


function DasborPreview() {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-gray-800 border-b-4 border-black px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"/>
          <div className="w-3 h-3 rounded-full bg-yellow-400"/>
          <div className="w-3 h-3 rounded-full bg-green-400"/>
        </div>
        <div className="flex-1 bg-gray-700 rounded-full px-3 py-1 text-xs font-mono text-gray-300">mbti-pakar.app/dasbor</div>
      </div>
      <div className="flex h-56 bg-gray-50">
        <div className="w-14 bg-gray-900 flex flex-col items-center py-4 gap-5 shrink-0">
          <div className="w-7 h-7 bg-[var(--utama)] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <LayoutDashboard className="w-4 h-4 text-white"/>
          <FileText className="w-4 h-4 text-white opacity-40"/>
          <BarChart2 className="w-4 h-4 text-white opacity-40"/>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3"/>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--utama)] rounded-xl p-3 text-white">
              <div className="h-2 bg-white/30 rounded mb-2 w-2/3"/>
              <div className="font-black text-xl">INFJ</div>
              <div className="text-xs opacity-70 mt-1">Penganjur</div>
            </div>
            <div className="bg-[var(--aksen)] rounded-xl p-3">
              <div className="h-2 bg-black/20 rounded mb-2 w-1/2"/>
              <div className="font-black text-lg text-black">Tes ke-3</div>
              <div className="text-xs opacity-60 mt-1">3 Mei 2026</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-100 p-3 space-y-2">
            <div className="h-2 bg-gray-200 rounded w-1/3"/>
            <div className="flex gap-1 items-center">
              <div className="h-2 bg-[var(--utama)] rounded-full" style={{width:'62%'}}/>
              <span className="text-xs font-bold text-gray-400">62%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function TipeMBTI() {
  const [aktif, setAktif] = useState(0);
  const [mulaiX, setMulaiX] = useState(null);
  const total = MBTI_DATA.length;

  const prev = () => setAktif((p) => (p - 1 + total) % total);
  const next = () => setAktif((p) => (p + 1) % total);

  return (
    <div className="w-full">
      
      <div
        className="relative w-full"
        onTouchStart={(e) => setMulaiX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!mulaiX) return;
          const d = mulaiX - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) d > 0 ? next() : prev();
          setMulaiX(null);
        }}
      >
        
        <div
          className={`w-full border-4 ${MBTI_DATA[aktif].border} rounded-2xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-[var(--background)]`}
          style={{ borderColor: MBTI_DATA[aktif].accent }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-black text-6xl md:text-8xl tracking-tighter block leading-none" style={{ color: MBTI_DATA[aktif].accent }}>
                {MBTI_DATA[aktif].tipe}
              </span>
              <span className="font-black text-base md:text-lg uppercase mt-1 block text-[var(--foreground)] opacity-60">
                {MBTI_DATA[aktif].nama}
              </span>
            </div>
            <span className="font-black text-sm bg-[var(--foreground)] text-[var(--background)] px-3 py-1.5 rounded-full shrink-0">
              {aktif + 1}/{total}
            </span>
          </div>
          <p className="font-semibold text-[var(--foreground)] opacity-70 text-sm md:text-base leading-relaxed mb-6">
            {MBTI_DATA[aktif].desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {["E","I","S","N","T","F","J","P"].filter(c => MBTI_DATA[aktif].tipe.includes(c)).map(c => (
              <span key={c} className="font-black text-xs md:text-sm px-3 py-1.5 rounded-lg border-2" style={{ borderColor: MBTI_DATA[aktif].accent, color: MBTI_DATA[aktif].accent }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        
        <div
          className="flex gap-3 mt-4 overflow-x-auto pb-1"
          style={{scrollbarWidth:'none', msOverflowStyle:'none', WebkitOverflowScrolling:'touch'}}
          onMouseEnter={e => e.currentTarget.style.setProperty('--show-scroll','none')}
        >
          {MBTI_DATA.map((item, i) => (
            <button
              key={item.tipe}
              onClick={() => setAktif(i)}
              className={`shrink-0 border-4 rounded-xl px-3 py-2 md:px-4 md:py-3 font-black text-sm md:text-base transition-all duration-200 ${
                i === aktif
                  ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                  : 'bg-[var(--background)] text-[var(--foreground)] opacity-50 hover:opacity-100 hover:scale-105'
              }`}
              style={{ borderColor: i === aktif ? 'var(--foreground)' : item.accent }}
            >
              {item.tipe}
            </button>
          ))}
        </div>
      </div>

      
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="w-12 h-12 md:w-14 md:h-14 border-4 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--aksen)] hover:text-black font-black text-xl rounded-full shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">←</button>
        <span className="font-black text-sm text-[var(--muted-foreground)]">{aktif + 1} / {total}</span>
        <button onClick={next} className="w-12 h-12 md:w-14 md:h-14 border-4 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--aksen)] hover:text-black font-black text-xl rounded-full shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">→</button>
      </div>
    </div>
  );
}


export function HalamanUtama() {
  const { tema, setTema } = gunakanTema();
  const [menuBuka, setMenuBuka] = useState(false);

  
  useEffect(() => {
    document.body.style.overflow = menuBuka ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuBuka]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      
      <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b-4 border-black px-6 md:px-12 py-0 flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-black text-xl uppercase tracking-tighter flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[var(--utama)]" /> MBTI Pakar
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link href="#beranda" className="hover:text-[var(--utama)] transition-colors">Beranda</Link>
            <Link href="#cara-kerja" className="hover:text-[var(--utama)] transition-colors">Cara Kerja</Link>
            <Link href="#tipe-mbti" className="hover:text-[var(--utama)] transition-colors">Tipe Kepribadian</Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setTema(tema === "light" ? "dark" : "light")}
            className="p-2 rounded-full border-2 border-black hover:bg-[var(--muted)] transition-colors"
          >
            {tema === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link href="/masuk" className="flex items-center gap-2 bg-[var(--utama)] text-[var(--utama-foreground)] font-black px-5 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm">
            <LogIn className="w-4 h-4" /> Masuk
          </Link>
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setTema(tema === "light" ? "dark" : "light")} className="p-2 rounded-full border-2 border-black">
            {tema === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => setMenuBuka(!menuBuka)} className="p-2 rounded-full border-2 border-black">
            {menuBuka ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      
      {menuBuka && (
        <div className="md:hidden fixed inset-0 top-16 bg-[var(--background)] border-t-4 border-black px-8 py-8 flex flex-col gap-6 text-lg font-black uppercase z-40">
          <Link href="#beranda" onClick={() => setMenuBuka(false)}>Beranda</Link>
          <Link href="#cara-kerja" onClick={() => setMenuBuka(false)}>Cara Kerja</Link>
          <Link href="#tipe-mbti" onClick={() => setMenuBuka(false)}>Tipe Kepribadian</Link>
          <div className="h-1 bg-black/10 my-2"/>
          <Link href="/masuk" onClick={() => setMenuBuka(false)} className="flex items-center gap-2 bg-[var(--utama)] text-white px-6 py-4 rounded-2xl border-4 border-black justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <LogIn className="w-5 h-5" /> Masuk
          </Link>
        </div>
      )}

      <main className="flex-1">

        
        <section id="beranda" className="relative px-6 md:px-16 pt-20 pb-16 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[var(--utama)] opacity-10 rounded-full blur-[80px] pointer-events-none -z-10"/>
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[var(--aksen)] opacity-20 rounded-full blur-[80px] pointer-events-none -z-10"/>

          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 bg-[var(--aksen)] border-2 border-black text-xs font-black px-4 py-1.5 rounded-full mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Check className="w-3 h-3" /> Sistem Pakar · Forward Chaining · 16 Tipe MBTI
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[1.05] mb-8">
              Kenali <span className="text-[var(--utama)] italic">Potensi</span><br />
              Dirimu.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mb-10">
              Temukan 1 dari 16 tipe kepribadian MBTI-mu melalui 32 pertanyaan yang dirancang secara ilmiah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/masuk" className="inline-flex items-center justify-center gap-3 bg-[var(--utama)] text-white font-black px-10 py-5 rounded-2xl text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                <Play className="w-6 h-6 fill-current" /> Ikuti Tes Gratis
              </Link>
              <Link href="#cara-kerja" className="inline-flex items-center justify-center gap-3 border-4 border-black font-black px-10 py-5 rounded-2xl text-xl bg-[var(--background)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                Pelajari Lebih <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>

        
        <MarqueeTrack />

        
        <section id="cara-kerja" className="px-6 md:px-16 py-24 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Cara Kerja</h2>
            <p className="text-xl text-gray-500 font-medium">3 langkah mudah untuk mengenal dirimu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              {[
                { ikon: ShieldCheck, no: "01", judul: "Buat Akun", desc: "Masuk dengan akun Google dalam hitungan detik. Aman, cepat, tanpa isi form panjang." },
                { ikon: Play, no: "02", judul: "Jawab Jujur", desc: "Jawab 32 pernyataan dengan percaya insting pertamamu — jangan terlalu lama berpikir." },
                { ikon: Users, no: "03", judul: "Terima Hasilmu", desc: "Dapatkan tipe kepribadian lengkap beserta persentase dimensi E/I, S/N, T/F, J/P." },
              ].map((item) => (
                <div key={item.no} className="flex gap-5 p-6 rounded-2xl border-4 border-black bg-[var(--background)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all group">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--aksen)] border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                    {item.no}
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-1">{item.judul}</h3>
                    <p className="text-gray-500 font-medium text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <DasborPreview />
          </div>
        </section>

        
        <section id="tipe-mbti" className="px-6 md:px-16 py-24 bg-[var(--muted)] border-y-4 border-black">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">16 Tipe Kepribadian</h2>
              <p className="text-xl text-gray-500 font-medium">Klik pada tipe untuk melihat penjelasan singkat</p>
            </div>
            <TipeMBTI />
          </div>
        </section>

        
        <section className="px-6 md:px-16 py-24">
          <div className="max-w-4xl mx-auto bg-[var(--utama)] text-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 md:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <BrainCircuit className="w-14 h-14 opacity-80"/>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Siap Mulai?</h2>
              <p className="text-xl font-medium opacity-90">Temukan kepribadian aslimu sekarang juga. Gratis, cepat, dan akurat.</p>
            </div>
            <Link href="/masuk" className="shrink-0 inline-flex items-center gap-3 bg-[var(--aksen)] text-black font-black px-10 py-6 rounded-2xl text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <Play className="w-6 h-6 fill-current" /> Mulai Sekarang
            </Link>
          </div>
        </section>

      </main>

      
      <footer className="bg-[#0a0a0a] text-white border-t-4 border-black">
        
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
              <BrainCircuit className="w-7 h-7 text-[var(--utama)]" /> MBTI Pakar
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-xs">
              Sistem Pakar berbasis Forward Chaining untuk deteksi 16 tipe kepribadian MBTI secara ilmiah.
            </p>
            <Link href="/masuk" className="inline-flex items-center gap-2 bg-[var(--utama)] text-white font-black text-sm px-5 py-3 rounded-full border-2 border-white/20 hover:border-white/60 hover:opacity-90 transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)]">
              <LogIn className="w-4 h-4" /> Mulai Tes
            </Link>
          </div>

          
          <div className="space-y-5">
            <h3 className="font-black text-xs uppercase tracking-[0.15em] text-gray-500">Navigasi</h3>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "#beranda" },
                { label: "Cara Kerja", href: "#cara-kerja" },
                { label: "Tipe Kepribadian", href: "#tipe-mbti" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-white font-semibold text-sm transition-colors hover:pl-1 block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="space-y-5">
            <h3 className="font-black text-xs uppercase tracking-[0.15em] text-gray-500">Akses</h3>
            <ul className="space-y-3">
              <li><Link href="/masuk" className="text-gray-400 hover:text-white font-semibold text-sm transition-colors hover:pl-1 block">Masuk</Link></li>
            </ul>
          </div>

          
          <div className="space-y-5">
            <h3 className="font-black text-xs uppercase tracking-[0.15em] text-gray-500">Sosial Media</h3>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com/rfly.romeo_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white font-semibold text-sm transition-colors group">
                <span className="w-8 h-8 bg-white/5 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-orange-400 border border-white/10 rounded-lg flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </span>
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/muhammadraflyromeonasution/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white font-semibold text-sm transition-colors group">
                <span className="w-8 h-8 bg-white/5 group-hover:bg-[#0077b5] border border-white/10 rounded-lg flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </span>
                LinkedIn
              </a>
              <a href="https://github.com/Raflyromeo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white font-semibold text-sm transition-colors group">
                <span className="w-8 h-8 bg-white/5 group-hover:bg-white/20 border border-white/10 rounded-lg flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </span>
                GitHub
              </a>
            </div>
          </div>

        </div>

        
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 font-medium text-center sm:text-left">
              © {new Date().getFullYear()} · Dibuat dengan ❤️ oleh <span className="text-gray-300 font-bold">Muhammad Rafly Romeo Nasution</span>
            </p>
            <p className="text-xs text-gray-600 font-medium">Sistem Pakar MBTI · Forward Chaining</p>
          </div>
        </div>

      </footer>
    </div>
  );
}

