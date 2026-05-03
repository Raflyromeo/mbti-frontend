import { PenyediaTema } from "@/komponen/PenyediaTema";

import "./globals.css";

export const metadata = {
  title: "Sistem Pakar MBTI - Neobrutalism",
  description: "Kenali 16 tipe kepribadian Anda dengan pendekatan sistem pakar MBTI.",
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
