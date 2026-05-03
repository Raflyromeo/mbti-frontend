import { HalamanUtama } from "@/komponen/HalamanUtama";
import { GulirHalus } from "@/komponen/GulirHalus";

export const metadata = {
  title: "MBTI Pakar - Sistem Deteksi Kepribadian",
  description: "Kenali potensi asli dirimu menggunakan sistem pakar berbasis Forward Chaining.",
};

export default function Home() {
  return (
    <GulirHalus>
      <HalamanUtama />
    </GulirHalus>
  );
}
