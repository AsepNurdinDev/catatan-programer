"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { 
  User, BookOpen, Terminal, Eye, Target, 
  Compass, Calendar, MessageSquare, ArrowUpRight, 
  Heart, Code2, Server, MapPin, GraduationCap 
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

// 1. DATA KONDISI RIIL (Bukan Angka Fiktif)
const coreHighlights = [
  { label: "Status Akademik", value: "Mahasiswa SI", detail: "Undiksha Singaraja", icon: GraduationCap },
  { label: "Fokus Arsitektur", value: "Backend & Dev", detail: "Golang & Container", icon: Server },
  { label: "Proyek Dikembangkan", value: "2+ Platform", detail: "Tenangin & Manajemen Kos", icon: Code2 },
  { label: "Home Base", value: "Singaraja", detail: "Bali, Indonesia", icon: MapPin },
];

const techStacks = [
  "Golang", "Next.js / React", "Tailwind CSS", 
  "Docker & Containerization", "Linux (Ubuntu / Zsh)"
];

// 2. TIMELINE YANG RELEVAN DENGAN PERJALANAN NYATA
const journeyTimeline = [
  {
    year: "2024 - Awal 2025",
    title: "Eksplorasi Fundamental & Struktur Data",
    desc: "Mendalami logika pemrograman dasar, algoritma sorting (Shell Sort), dan mulai mendokumentasikan penyelesaian error coding agar tidak hilang begitu saja."
  },
  {
    year: "Akhir 2025",
    title: "Pindah ke Backend & Metode Numerik",
    desc: "Mulai beralih menggunakan Golang untuk komputasi (seperti interpolasi kuadratik) dan memahami manajemen container menggunakan Docker Compose."
  },
  {
    year: "2026 (Sekarang)",
    title: "Pengembangan Solusi Riil & Dampak",
    desc: "Membangun platform ruang aman 'Tenangin' untuk keseimbangan hidup, mengelola website manajemen 'Kos Asepshan', dan merapikan lingkungan kerja server berbasis Linux."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-800 antialiased selection:bg-zinc-200/60">
      <Navbar />

      {/* Jarak atas disesuaikan dengan tinggi navbar */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 pt-36 pb-24">
        
        {/* ================= HERO SECTION (EDITORIAL STYLE) ================= */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tentang Kreator & Platform
          </div>
          <h1 className="text-3xl font-serif font-medium text-zinc-950 tracking-tight sm:text-5xl max-w-2xl leading-[1.15]">
            Mendokumentasikan Logika, Membangun Solusi Riil.
          </h1>
          <p className="mt-6 text-base font-sans text-zinc-600 max-w-2xl leading-relaxed">
            Selamat datang. **Catatan Programmer** adalah jurnal digital personal yang saya gunakan untuk mendokumentasikan perjalanan belajar di bidang rekayasa perangkat lunak, arsitektur backend, hingga eksplorasi sistem operasi. 
          </p>
        </div>

        {/* ================= HIGHLIGHTS FLAT GRID (LAYOUT BARU) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-xl overflow-hidden mb-20 shadow-sm">
          {coreHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-4">
                    <Icon className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-base font-semibold text-zinc-900 tracking-tight">{item.value}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{item.detail}</div>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-6 pt-2 border-t border-zinc-50">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BIOGRAFI & BIO DATA SPLIT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-24">
          
          {/* KOLOM KIRI: PROFIL RINGKAS (4 Kolom) */}
          <div className="md:col-span-4 space-y-6 md:sticky md:top-28">
            <div className="aspect-square w-full max-w-[240px] md:max-w-none mx-auto rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 relative shadow-inner">
              <img 
                src="/images/profile.jpeg" 
                alt="Asep" 
                className="w-full h-full object-cover filter grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-xl font-serif font-semibold text-zinc-950">Asep Nurdin</h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">Computer Science Student</p>
              
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center md:justify-start">
                {techStacks.map((tech, idx) => (
                  <span key={idx} className="text-[11px] font-mono bg-zinc-50 text-zinc-600 border border-zinc-200/80 px-2 py-0.5 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: CERITA UTAMA (8 Kolom) */}
          <div className="md:col-span-8 space-y-6 text-zinc-600 text-sm leading-relaxed font-sans">
            <h3 className="text-lg font-serif font-medium text-zinc-950 flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-zinc-500" /> Mengenal Di Balik Layar
            </h3>
            <p>
              Halo! Saya Asep, seorang mahasiswa jurusan **Ilmu Komputer di Undiksha**. Ketertarikan saya pada dunia IT berpusat pada penulisan kode backend yang efisien, manajemen *container* otomatis, serta utak-atik konfigurasi sistem operasi Linux demi efisiensi lingkungan kerja developer.
            </p>
            <p>
              Blog ini lahir dari kesadaran sederhana: *error* yang saya temui hari ini kemungkinan besar akan ditemui oleh orang lain esok hari. Dibanding membiarkan solusi mengendap di terminal lokal, saya memilih menuliskannya ke dalam bentuk panduan terstruktur agar bisa membantu rekan kuliah maupun sesama pembelajar mandiri.
            </p>
            <p>
              Saat ini, fokus saya tidak hanya pada teori kampus, melainkan mencoba memvalidasi ilmu dengan membangun beberapa proyek nyata. Mulai dari **Tenangin**—sebuah platform yang dirancang sebagai ruang aman untuk menjaga keseimbangan hidup—hingga sistem web praktis berskala lokal seperti platform pengelolaan **Kos Asepshan**.
            </p>
          </div>
        </div>

        {/* ================= VISI & MISI (BORDERLESS MINIMALIST) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-16 mb-24">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-zinc-900" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900">Visi Pengembangan</h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Membangun ruang belajar teknologi yang jujur dan inklusif. Saya percaya bahwa kode yang baik bukan hanya yang berhasil dikompilasi tanpa error, tetapi yang mampu menyelesaikan masalah nyata manusia di kehidupan sehari-hari.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-zinc-900" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900">Fokus Kontinuitas</h3>
            </div>
            <ul className="text-sm text-zinc-600 space-y-3 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1.5 block w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
                <span>Menyajikan catatan pemecahan masalah coding berbasis studi kasus riil.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1.5 block w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
                <span>Mengembangkan produk open-source alternatif yang membawa dampak sosial positif.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1.5 block w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
                <span>Menjaga transparansi penuh dalam setiap proyek kolaboratif yang dijalankan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= TIMELINE / MILESTONE (MINIMAL LINE) ================= */}
        <div className="border-t border-zinc-200 pt-16 mb-24">
          <div className="flex items-center gap-2 mb-10">
            <Calendar className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900">Jejak Langkah Pembelajaran</h3>
          </div>
          
          <div className="space-y-10 pl-2">
            {journeyTimeline.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 relative">
                <div className="md:col-span-3">
                  <span className="text-xs font-mono font-bold text-zinc-400 block md:mt-0.5">
                    {item.year}
                  </span>
                </div>
                <div className="md:col-span-9">
                  <h4 className="text-base font-sans font-semibold text-zinc-950">{item.title}</h4>
                  <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CALL TO ACTION (CLEAN FLAT PANEL) ================= */}
        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="max-w-md">
            <h3 className="text-lg font-serif font-medium text-white mb-1.5">Terbuka untuk Diskusi & Kolaborasi</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pintu komunikasi selalu terbuka untuk sekadar diskusi seputar backend development, sistem operasi Linux, atau kolaborasi platform web.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a 
              href="mailto:asep@example.com" 
              className="bg-white text-zinc-950 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-100 transition-colors"
            >
              Kirim Pesan <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-200/80 py-8 text-center text-xs font-mono text-zinc-400 mt-auto">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer.</p>
          <div className="flex gap-4 font-sans text-zinc-500">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}