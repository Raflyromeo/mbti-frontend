"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FAQ_DATA = [
  {
    tanya: "Apakah login dengan Google aman? Data apa saja yang diambil?",
    jawab: "Sangat aman! Kami menggunakan sistem otentikasi resmi (Supabase Auth). Sistem kami hanya mengambil nama dan alamat email dasar untuk keperluan identitas akun. Kami sama sekali tidak memiliki akses ke kata sandi, kotak masuk, atau data privasi Google Anda lainnya."
  },
  {
    tanya: "Web ini sebenarnya untuk apa?",
    jawab: "MBTI Pakar adalah sebuah Sistem Pakar berbasis web yang dirancang untuk membantu Anda menemukan kecenderungan tipe kepribadian (1 dari 16 tipe MBTI). Tujuannya adalah untuk keperluan pemahaman diri, mengenali potensi karir, dan sarana pengembangan personal."
  },
  {
    tanya: "Bagaimana cara kerja sistem ini?",
    jawab: "Anda akan diminta untuk merespons 32 pernyataan yang telah dirancang secara ilmiah. Pilihlah jawaban yang paling mencerminkan insting pertama Anda. Setelah selesai, sistem akan memproses seluruh respons Anda menggunakan metode logika Forward Chaining untuk mendiagnosis kepribadian Anda."
  },
  {
    tanya: "Mengapa saya harus login terlebih dahulu?",
    jawab: "Login diperlukan agar sistem dapat menyimpan riwayat hasil tes Anda secara aman di dalam dasbor pribadi. Dengan begitu, Anda bisa mengakses kembali hasil analisis tipe kepribadian Anda kapan saja tanpa harus mengulang tes dari awal."
  },
  {
    tanya: "Mengapa di pengaturan profil ada form nomor telepon, jenis kelamin, pekerjaan, dan alamat?",
    jawab: "Pengisian data tersebut bersifat sepenuhnya opsional (boleh dikosongkan). Kami menyediakannya untuk keperluan riset statistik demografis terkait distribusi tipe kepribadian secara anonim. Kedepannya, data seperti pekerjaan juga akan membantu sistem pakar kami dalam meracik saran pengembangan karir yang jauh lebih spesifik untuk Anda."
  },
  {
    tanya: "Bagaimana sistem memberikan penilaian akhir?",
    jawab: "Setiap jawaban Anda akan dikalkulasikan ke dalam 4 dimensi utama: Energi (E/I), Penerimaan Informasi (S/N), Pengambilan Keputusan (T/F), dan Gaya Hidup (J/P). Kombinasi persentase dominan dari keempat dimensi tersebut akan membentuk 4 huruf final tipe kepribadian Anda (misal: INTJ atau ENFP)."
  },
  {
    tanya: "Apakah hasil tes ini dijamin akurat?",
    jawab: "Sistem pakar ini dirancang menggunakan metode penalaran Forward Chaining yang mengacu pada teori psikologi Carl Jung dan model MBTI. Hasil yang diberikan sangat mendekati akurat asalkan Anda menjawab seluruh pernyataan dengan jujur sesuai dengan insting pertama Anda, bukan jawaban yang Anda anggap 'ideal'."
  }
];

export function FaqSection() {
  const [aktifIndex, setAktifIndex] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      gsap.from(".gsap-faq-judul", {
        scrollTrigger: { trigger: ".gsap-faq-judul", start: "top 90%", toggleActions: "play none none none" },
        y: -30, opacity: 0, duration: 0.6, ease: "power2.out"
      });

      gsap.utils.toArray(".gsap-faq-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
          y: 40, opacity: 0, duration: 0.5, delay: i * 0.1, ease: "power2.out"
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setAktifIndex(aktifIndex === index ? null : index);
  };

  return (
    <section id="faq" className="px-6 md:px-16 pt-24 pb-12 max-w-4xl mx-auto">
      <div className="mb-12 text-center gsap-faq-judul">
        <div className="inline-flex items-center justify-center p-4 bg-[var(--kedua)] rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <HelpCircle className="w-10 h-10 text-[var(--kedua-foreground)]" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Tanya Jawab</h2>
        <p className="text-xl text-[var(--muted-foreground)] font-medium">Beberapa hal yang sering ditanyakan pengguna</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((faq, index) => {
          const isBuka = aktifIndex === index;
          return (
            <div 
              key={index} 
              className={`gsap-faq-item border-4 border-black bg-[var(--background)] rounded-2xl overflow-hidden transition-all duration-300 ${isBuka ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-black text-lg md:text-xl hover:bg-[var(--muted)] transition-colors"
              >
                <span className="leading-tight">{faq.tanya}</span>
                <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black transition-transform duration-300 ${isBuka ? "bg-[var(--utama)] text-white rotate-180" : "bg-white text-black"}`}>
                  {isBuka ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {isBuka && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-[var(--muted-foreground)] font-medium text-base md:text-lg border-t-2 border-black/10 pt-4 mt-2 mx-2 leading-relaxed">
                      {faq.jawab}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
