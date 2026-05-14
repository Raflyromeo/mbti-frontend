"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { gunakanTema } from "@/komponen/PenyediaTema";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, BarChart2, Menu, X, ArrowRight, BrainCircuit, Users, Target, Search, Clock, LogIn, Sun, Moon, Check, Play, ShieldCheck } from "lucide-react";

import { MarqueeTrack, MARQUEE_TIPE } from "./MarqueeTrack";
import { DasborPreview } from "./DasborPreview";
import { TipeMBTI } from "./TipeMBTI";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

import { supabase } from "@/utilitas/supabase";

export function HalamanUtama() {
  const { tema, setTema } = gunakanTema();
  const [menuBuka, setMenuBuka] = useState(false);
  const [dataMBTI, setDataMBTI] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ambilDataMBTI = async () => {
      const { data, error } = await supabase
        .from("tipe_kepribadian")
        .select(`
          nama_tipe,
          julukan,
          border,
          accent,
          keterangan(keterangan)
        `);
      
      if (!error && data) {
        const dataTerformat = data.map((item) => {
          return {
            tipe: item.nama_tipe,
            nama: item.julukan || item.nama_tipe,
            border: item.border || "border-gray-400",
            accent: item.accent || "#9ca3af",
            desc: item.keterangan && item.keterangan.length > 0 ? item.keterangan[0].keterangan : "Belum ada keterangan."
          };
        });
        
        dataTerformat.sort((a, b) => MARQUEE_TIPE.indexOf(a.tipe) - MARQUEE_TIPE.indexOf(b.tipe));
        setDataMBTI(dataTerformat);
      }
    };
    
    ambilDataMBTI();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuBuka ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuBuka]);

  const scrollKe = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuBuka(false);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      let triggers = [];

      const st = (trigger, vars) =>
        gsap.from(trigger, {
          scrollTrigger: {
            trigger,
            start: "top 98%",
            toggleActions: "play none none none",
          },
          overwrite: true,
          ...vars,
        });


      st(".gsap-cara-judul", { x: -30, opacity: 0, duration: 0.5 });


      gsap.utils.toArray(".gsap-cara-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 98%", toggleActions: "play none none none" },
          y: 30, opacity: 0, duration: 0.5, delay: i * 0.08, ease: "power2.out", overwrite: true,
        });
      });

      st(".gsap-preview", { x: 40, opacity: 0, duration: 0.6 });


      st(".gsap-tipe-judul", { y: -20, opacity: 0, duration: 0.5 });
      st(".gsap-tipe-kartu",  { y: 25,  opacity: 0, duration: 0.5 });


      st(".gsap-cta-section", { scale: 0.98, opacity: 0, duration: 0.5 });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4 ${
          isScrolled ? 'pt-4' : 'pt-6 md:pt-8'
        }`}
      >
        <div className={`
          relative w-full max-w-6xl rounded-2xl transition-all duration-300
          flex justify-between items-center px-4 md:px-6 py-2 md:py-3
          ${isScrolled 
            ? 'bg-[var(--background)]/95 backdrop-blur-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
            : 'bg-transparent border-4 border-transparent shadow-none'}
        `}>
          <Link href="/" className="font-black text-lg md:text-xl uppercase tracking-tighter flex items-center gap-2 group hover:scale-105 transition-transform shrink-0">
            <BrainCircuit className="w-6 h-6 text-[var(--utama)] group-hover:rotate-12 transition-transform" /> 
            <span>MBTI Pakar</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-[var(--kedua)] rounded-full p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            {[
              { id: "beranda", label: "Beranda" },
              { id: "cara-kerja", label: "Cara Kerja" },
              { id: "tipe-mbti", label: "16 Tipe" },
              { id: "faq", label: "FAQ" }
            ].map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollKe(link.id)} 
                className="px-4 py-1.5 rounded-full text-sm font-black transition-all hover:bg-[var(--utama)] hover:text-white border-2 border-transparent hover:border-black"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setTema(tema === "light" ? "dark" : "light")}
              className="p-2 rounded-full border-2 border-black bg-[var(--background)] hover:bg-[var(--muted)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {tema === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link href="/masuk" className="flex items-center gap-2 bg-[var(--utama)] text-white font-black px-5 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm">
              <LogIn className="w-4 h-4" /> Masuk
            </Link>
          </div>
          
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <button onClick={() => setTema(tema === "light" ? "dark" : "light")} className="p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[var(--background)]">
              {tema === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button onClick={() => setMenuBuka(!menuBuka)} className="p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[var(--utama)] text-white">
              {menuBuka ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      
      {menuBuka && (
        <div className="lg:hidden fixed top-24 left-4 right-4 bg-[var(--background)] border-4 border-black rounded-2xl px-6 py-8 flex flex-col gap-6 text-lg font-black uppercase z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={() => { scrollKe("beranda"); setMenuBuka(false); }} className="text-left w-full">Beranda</button>
          <button onClick={() => { scrollKe("cara-kerja"); setMenuBuka(false); }} className="text-left w-full">Cara Kerja</button>
          <button onClick={() => { scrollKe("tipe-mbti"); setMenuBuka(false); }} className="text-left w-full">Tipe Kepribadian</button>
          <button onClick={() => { scrollKe("faq"); setMenuBuka(false); }} className="text-left w-full">Tanya Jawab</button>
          <div className="h-1 bg-black/10 my-2 w-full"/>
          <Link href="/masuk" onClick={() => setMenuBuka(false)} className="flex items-center gap-2 bg-[var(--utama)] text-white px-6 py-4 rounded-2xl border-4 border-black justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
            <LogIn className="w-5 h-5" /> Masuk
          </Link>
        </div>
      )}

      <main className="flex-1 pt-20 lg:pt-24">

        
        <section id="beranda" className="relative px-6 md:px-16 pt-10 lg:pt-10 pb-16 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[var(--utama)] opacity-10 rounded-full blur-[80px] pointer-events-none -z-10"/>
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[var(--aksen)] opacity-20 rounded-full blur-[80px] pointer-events-none -z-10"/>

          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[var(--aksen)] border-2 border-black text-xs font-black px-4 py-1.5 rounded-full mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Check className="w-3 h-3" /> Sistem Pakar · Forward Chaining · 16 Tipe MBTI
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.25 }}
              className="text-6xl md:text-9xl font-black tracking-tighter leading-[1.05] mb-8"
            >
              Kenali <span className="text-[var(--utama)] italic">Potensi</span><br />
              Dirimu.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.42 }}
              className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mb-10"
            >
              Kenali pola pikir dan potensi sejatimu hanya lewat 32 pertanyaan singkat.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto px-4">
              <motion.div
                className="w-full sm:w-auto flex justify-center"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.58 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href="/masuk" className="inline-flex items-center justify-center gap-3 bg-[var(--utama)] text-white font-black px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all w-full sm:w-auto">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> Ikuti Tes Gratis
                </Link>
              </motion.div>
              <motion.div
                className="w-full sm:w-auto flex justify-center"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.72 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <button
                  onClick={() => scrollKe("cara-kerja")}
                  className="inline-flex items-center justify-center gap-3 border-4 border-black font-black px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl bg-[var(--background)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all w-full sm:w-auto"
                >
                  Pelajari Lebih <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        
        <MarqueeTrack />

        
        <section id="cara-kerja" className="px-6 md:px-16 py-24 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="gsap-cara-judul text-5xl md:text-7xl font-black tracking-tighter mb-4">Cara Kerja</h2>
            <p className="text-xl text-gray-500 font-medium">3 langkah mudah untuk mengenal dirimu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              {[
                { ikon: ShieldCheck, no: "01", judul: "Buat Akun", desc: "Masuk dengan akun Google dalam hitungan detik. Aman, cepat, tanpa isi form panjang." },
                { ikon: Play, no: "02", judul: "Jawab Jujur", desc: "Jawab 32 pernyataan dengan percaya insting pertamamu — jangan terlalu lama berpikir." },
                { ikon: Users, no: "03", judul: "Terima Hasilmu", desc: "Dapatkan tipe kepribadian lengkap beserta persentase dimensi E/I, S/N, T/F, J/P." },
              ].map((item) => (
                <div key={item.no} className="gsap-cara-item flex gap-5 p-6 rounded-2xl border-4 border-black bg-[var(--background)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all group">
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
            <div className="gsap-preview"><DasborPreview /></div>
          </div>
        </section>

        
        <section id="tipe-mbti" className="px-6 md:px-16 py-24 bg-[var(--muted)] border-y-4 border-black">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <h2 className="gsap-tipe-judul text-5xl md:text-7xl font-black tracking-tighter mb-4">16 Tipe Kepribadian</h2>
              <p className="text-xl text-gray-500 font-medium">Klik pada tipe untuk melihat penjelasan singkat</p>
            </div>
            <div className="gsap-tipe-kartu"><TipeMBTI dataMBTI={dataMBTI} /></div>
          </div>
        </section>

        <FaqSection />

        <section className="px-6 md:px-16 pt-12 pb-24">
          <div className="gsap-cta-section max-w-4xl mx-auto bg-[var(--utama)] text-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 md:p-16 flex flex-col md:flex-row items-center gap-10">
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

      <Footer />
      <ScrollToTop />
    </div>
  );
}

