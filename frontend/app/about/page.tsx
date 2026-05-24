"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { 
  User, BookOpen, Terminal, Eye, Target, 
  Compass, Calendar, MessageSquare, ArrowUpRight, Heart 
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

// 1. DATA STATISTIK BLOG
const statsData = [
  { label: "Artikel Rilis", value: "150+", icon: BookOpen },
  { label: "Pembaca Bulanan", value: "15K+", icon: Eye },
  { label: "Aksi Sosial Disalurkan", value: "5+", icon: Heart },
  { label: "Tahun Berjalan", value: "2+", icon: Calendar },
];

// 2. DATA TECH STACK / BIDANG FOKUS
const techStacks = [
  "Golang (Backend)", "Next.js / React", "Tailwind CSS", 
  "Docker & Containerization", "Linux System Administration"
];

// 3. DATA TIMELINE PERJALANAN (FITUR DETAIL)
const journeyTimeline = [
  {
    year: "2024",
    title: "Blog Pertama Kali Rilis",
    desc: "Mulai menulis catatan harian seputar eror coding, algoritma, dan struktur data untuk konsumsi pribadi dan teman kuliah."
  },
  {
    year: "2025",
    title: "Ekspansi Konten & Arsitektur",
    desc: "Mengubah arsitektur blog menjadi lebih modern dan mulai membagikan konten advance seperti backend development dan devops dasar."
  },
  {
    year: "2026",
    title: "Integrasi Gerakan Sosial",
    desc: "Membuka halaman transparansi donasi untuk menyalurkan dukungan dari pembaca langsung ke sektor riil kemanusiaan (biaya sekolah & dhuafa)."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 pt-40 sm:pt-32 pb-20">
        
        {/* ================= HERO SECTION ================= */}
        <div className="mb-16 border-b border-zinc-200 pb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-3">
            Tentang Platform
          </span>
          <h1 className="text-3xl font-serif font-semibold text-zinc-950 tracking-tight sm:text-5xl max-w-3xl leading-tight">
            Catatan Programmer: Dokumentasi Logika & Jembatan Kebaikan.
          </h1>
          <p className="mt-4 text-sm font-sans text-zinc-800 max-w-3xl leading-relaxed">
            **Catatan Programmer** adalah sebuah web blog personal yang didedikasikan sebagai ruang berbagi insight teknis, tutorial pemrograman mendalam, dan pengalaman di dunia rekayasa perangkat lunak. Lebih dari sekadar coretan kode, platform ini berevolusi menjadi wadah kolektif untuk berdampak nyata di dunia nyata melalui aksi sosial.
          </p>
        </div>

        {/* ================= STATS COUNTER GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 border border-zinc-200 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-zinc-950" />
                </div>
                <div className="text-2xl font-bold font-sans text-zinc-950 tracking-tight">{stat.value}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* ================= PROFILE SECTION (ABOUT ME) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start mb-20 border-b border-zinc-200 pb-16">
          
          {/* SISI KIRI: FOTO & IDENTITAS */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="w-44 h-44 rounded-2xl overflow-hidden border border-zinc-300 shadow-sm bg-zinc-100 relative group mb-4">
              {/* Kamu tinggal ganti src gambar di bawah dengan foto aslimu */}
              <img 
                src="/images/profile.jpeg" 
                alt="Asep - Creator Catatan Programmer" 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 border border-black/10 rounded-2xl pointer-events-none" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-zinc-950">Asep</h2>
            <p className="text-xs font-mono text-zinc-500 mt-1">Full-Stack Developer / Student</p>
            
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center md:justify-start">
              {techStacks.map((tech, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200/60 px-2 py-0.5 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* SISI KANAN: BIOGRAFI PENULIS */}
          <div className="md:col-span-2 flex flex-col gap-4 text-sm leading-relaxed text-zinc-800">
            <h3 className="text-lg font-serif font-semibold text-zinc-950 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-950" /> Di Balik Layar Editor
            </h3>
            <p>
              Halo! Saya adalah seorang mahasiswa Sistem Informasi yang memiliki ketertarikan mendalam pada pengembangan web, manajemen server, dan arsitektur backend sistem. Saya mendirikan **Catatan Programmer** sebagai media belajar terbuka, mendokumentasikan setiap pemecahan masalah (debugging) agar bisa diakses oleh siapa saja yang sedang belajar di jalur yang sama.
            </p>
            <p>
              Bagi saya, menulis tutorial coding bukan hanya soal berbagi baris instruksi compiler, melainkan tentang menstrukturkan jalan pikiran agar lebih mudah dipahami oleh manusia. 
            </p>
            <p>
              Di luar aktivitas mengetik sintaks, saya mendedikasikan sebagian waktu dan hasil dari platform ini untuk mengoordinasikan bantuan sosial kecil-kecilan di lingkungan sekitar, mempertemukan kebaikan para pembaca blog dengan mereka yang membutuhkan.
            </p>
          </div>
        </div>

        {/* ================= VISI & MISI GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-zinc-950 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-serif font-semibold text-zinc-950">Visi Utama</h3>
            </div>
            <p className="text-xs text-zinc-800 leading-relaxed font-sans">
              Menjadi media literasi teknologi yang inklusif, menyediakan panduan rekayasa perangkat lunak yang pragmatis, sekaligus aktif menggerakkan kepedulian sosial yang nyata demi kesejahteraan sesama umat.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center">
                <Compass className="w-4 h-4 text-zinc-950" />
              </div>
              <h3 className="text-base font-serif font-semibold text-zinc-950">Misi Kontinuitas</h3>
            </div>
            <ul className="text-xs text-zinc-800 space-y-2.5 list-disc list-inside font-sans">
              <li>Menyajikan artikel pemrograman yang bersih, akurat, dan berbasis studi kasus riil.</li>
              <li>Menjaga transparansi 100% atas seluruh donasi sosial yang diamanahkan pembaca.</li>
              <li>Membantu memutus rantai keterbatasan biaya sekolah bagi anak-anak kurang mampu.</li>
              <li>Membangun ekosistem open-source yang sehat dan berdampak sosial tinggi.</li>
            </ul>
          </div>
        </div>

        {/* ================= TIMELINE PERJALANAN ================= */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-zinc-950" />
            <h3 className="text-base font-serif font-semibold text-zinc-950">Milestone & Jejak Langkah</h3>
          </div>
          
          <div className="relative border-l border-zinc-200 pl-4 ml-2 space-y-8">
            {journeyTimeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Dot penanda */}
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border-2 border-white ring-4 ring-zinc-100" />
                <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                  {item.year}
                </span>
                <h4 className="text-sm font-sans font-bold text-zinc-950 mt-2">{item.title}</h4>
                <p className="text-xs text-zinc-800 mt-1 leading-relaxed max-w-2xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CALL TO ACTION / HUBUNGI ================= */}
        <div className="bg-zinc-950 rounded-2xl p-8 text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
            <MessageSquare className="w-4 h-4 text-zinc-300" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-white mb-2">Tertarik Berkolaborasi atau Berbagi?</h3>
          <p className="text-xs text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed font-sans">
            Pintu komunikasi selalu terbuka untuk diskusi teknologi, kontribusi tulisan, ataupun kolaborasi program penyaluran bantuan sosial.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-xs font-sans font-medium">
            <a 
              href="mailto:asep@example.com" 
              className="bg-white text-zinc-950 px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-zinc-100 transition-colors shadow-sm"
            >
              Hubungi via Email <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a 
              href="/donation" 
              className="bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-zinc-850 transition-colors"
            >
              Lihat Laporan Sosial
            </a>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-200 py-8 text-center text-xs font-sans text-zinc-500 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}