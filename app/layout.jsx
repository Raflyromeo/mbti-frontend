import { PenyediaTema } from "@/komponen/PenyediaTema";

import "./globals.css";

export const metadata = {
  title: {
    template: "%s | MBTI Pakar",
    default: "Sistem Pakar MBTI - Diagnosis Kepribadian (Neobrutalism)",
  },
  description: "Aplikasi web cerdas untuk mendiagnosis tipe kepribadian MBTI (Myers-Briggs Type Indicator) berbasis sistem pakar. Dilengkapi fitur sinkronisasi real-time dan cetak PDF.",
  keywords: [
    "MBTI", 
    "Sistem Pakar", 
    "Neobrutalism", 
    "React", 
    "Next.js", 
    "Supabase", 
    "Diagnosis Kepribadian", 
    "Universitas Gunadarma", 
    "Tugas Kuliah", 
    "Sistem Berbasis Pengetahuan",
    "Muhammad Rafly Romeo Nasution"
  ],
  authors: [
    { name: "Muhammad Rafly Romeo Nasution", url: "https://raflyromeo-portfolio.vercel.app/" }
  ],
  creator: "Muhammad Rafly Romeo Nasution",
  publisher: "Universitas Gunadarma",
  applicationName: "MBTI Pakar",
  openGraph: {
    title: "Sistem Pakar MBTI - Neobrutalism",
    description: "Kenali 16 tipe kepribadian Anda dengan pendekatan sistem pakar MBTI. Proyek Tugas Mata Kuliah Sistem Berbasis Pengetahuan, Universitas Gunadarma.",
    siteName: "MBTI Pakar",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <PenyediaTema>
          {children}
        </PenyediaTema>
      </body>
    </html>
  );
}
