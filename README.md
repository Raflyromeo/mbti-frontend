<div align="center">

# 🧠 Sistem Pakar MBTI - Frontend

**Aplikasi web cerdas untuk mendiagnosis tipe kepribadian MBTI, dilengkapi dengan cetak laporan PDF dan antarmuka Neobrutalism yang memukau.**

[![Framework](https://img.shields.io/badge/Framework-Next.js_16.2.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📌 Latar Belakang

Aplikasi ini merupakan bagian dari sistem pakar untuk mendiagnosis tipe kepribadian seseorang berdasarkan teori Myers-Briggs Type Indicator (MBTI). Frontend ini dirancang secara khusus untuk memberikan pengalaman pengguna yang luar biasa dengan mengusung gaya desain *Neobrutalism* yang mencolok dan dinamis. 

Terintegrasi penuh dengan Supabase untuk manajemen *database* dan sinkronisasi data *real-time*, aplikasi ini bertindak sebagai antarmuka interaktif yang mengirimkan jawaban pengguna ke API *Backend* Python dan menampilkan hasil analisis secara responsif.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🎨 **Desain Neobrutalism** | Estetika modern dengan warna kontras, border tebal, dan bayangan tegas |
| ⚡ **Real-time Sync** | Sinkronisasi data profil secara instan menggunakan Supabase Realtime |
| 🖨️ **Cetak PDF Native** | Dukungan pembuatan dan pengunduhan laporan hasil tes dalam format PDF A4 |
| 🛡️ **Autentikasi Aman** | Sistem login dan pendaftaran yang dilindungi oleh Supabase Auth |
| 🔐 **Role-Based Access** | Pemisahan dasbor antara Pengguna biasa dan Administrator |
| 🎬 **Animasi Interaktif** | Transisi halaman dan elemen yang mulus menggunakan GSAP |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Clone & Install

```bash
# Clone repository
git clone <url-repo-frontend-anda>
cd frontend

# Install dependencies
npm install
```

### Konfigurasi Environment

Buat file `.env` atau `.env.local` di root project frontend:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Konfigurasi OAuth (Supabase Dashboard)

Di **Authentication → URL Configuration**, atur:

| Setting | Nilai |
|---|---|
| Site URL | `https://mbti-frontend.vercel.app` (atau domain produksi Anda) |
| Redirect URLs | `https://mbti-frontend.vercel.app/masuk`, `http://localhost:3000/masuk` |

Login Google mengarahkan callback ke `/masuk` agar token OAuth dibersihkan dari URL sebelum pengguna masuk ke dasbor.

### Menjalankan Secara Lokal

**Terminal:**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Pastikan backend API Python (FastAPI) juga sedang berjalan di port 8000.

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Kegunaan |
|---|---|
| [Next.js 16.2.4](https://nextjs.org) | App Router & React Framework |
| [React 19](https://react.dev) | Library UI |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling utility-first |
| [GSAP](https://gsap.com/) | Animasi elemen web |
| [Lucide React](https://lucide.dev/) | Icon Library |

### Database & Auth
| Teknologi | Kegunaan |
|---|---|
| [Supabase](https://supabase.com) | PostgreSQL Database & Authentication |

---

## 🎓 Informasi Tugas Mata Kuliah

Proyek ini merupakan bagian dari Tugas dari Mata Kuliah **Sistem Berbasis Pengetahuan** di Universitas Gunadarma yang dibuat oleh:

**Nama:** Muhammad Rafly Romeo Nasution  
**NPM:** 10123875  
**Kelas:** 3KA25  
**Program Studi:** Sistem Informasi  
**Semester:** 6  

🔗 **Portfolio:** [rafly romeo portfolio](https://raflyromeo-portfolio.vercel.app/)

---

## 👤 Pembuat

<div align="center">

**Muhammad Rafly Romeo Nasution**

<p align="center">
  <a href="https://linkedin.com/in/muhammadraflyromeonasution">
    <img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" height="30"/>
  </a>
  <a href="https://instagram.com/rfly.romeo_">
    <img src="https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white" alt="Instagram" height="30"/>
  </a>
  <a href="mailto:raflyromeonasution07@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" height="30"/>
  </a>
</p>

</div>

---

<div align="center">

Made with ❤️ by Rafly Romeo · 2026 

</div>
