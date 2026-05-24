"use client";

import React, { useState } from "react";
import { Download, ExternalLink, Heart, X, FolderGit2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";

// Data 8 Project dengan variasi tag dan deskripsi yang padat
const projects = [
  {
    id: 1,
    title: "Tenangin Platform",
    description: "Ruang aman untuk menjaga kesehatan mental dan keseimbangan hidup Anda dilengkapi dengan fitur penjejak suasana hati (mood tracker) yang interaktif.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Golang", "Next.js", "Tailwind CSS", "Docker"],
  },
  {
    id: 2,
    title: "Kos Asepshan Website",
    description: "Sistem informasi pencarian, ketersediaan kamar, dan manajemen kos digital berbasis web yang dirancang khusus untuk area sekitar Kampus Undiksha Singaraja.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["HTML", "Tailwind CSS", "JavaScript", "Go"],
  },
  {
    id: 3,
    title: "Medicare Dashboard UI",
    description: "Eksplorasi desain antarmuka dasbor kesehatan modern yang mengutamakan kemudahan navigasi rekam medis dan integrasi grafik data pasien.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["HTML", "Tailwind CSS", "UI Design"],
  },
  {
    id: 4,
    title: "Indonesian Jamu Dataset",
    description: "Kumpulan data (dataset) terstruktur mengenai khasiat, bahan baku, dan resep ramuan jamu tradisional Indonesia untuk kebutuhan riset machine learning.",
    image: "https://images.alodokter.com/dk0z4ums3/image/upload/v1683787002/attached_image/7-jamu-siap-minum-untuk-kesehatan.jpg",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Data Engineering", "JSON", "Dataset"],
  },
  {
    id: 5,
    title: "Rumah Joglo Cultural Dataset",
    description: "Proyek klasifikasi data arsitektur kebudayaan Indonesia, memuat ragam tipe, filosofi, dan koordinat wilayah dari rumah adat Joglo.",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Dataset", "Research", "Culture"],
  },
  {
    id: 6,
    title: "Shell Sort Algorithm Project",
    description: "Implementasi dan analisis performa algoritma pengurutan data Shell Sort untuk tugas proyek UAS mata kuliah Algoritma dan Struktur Data.",
    image: "https://www.mycplus.com/wp-content/uploads/2021/02/Shell-Sort-Algorithm.png",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Golang", "Algorithms", "College Project"],
  },
  {
    id: 7,
    title: "Quadratic Interpolation Tool",
    description: "Program perhitungan metode numerik untuk menyelesaikan masalah integral serumit apapun menggunakan pendekatan interpolasi kuadratik.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Golang", "Numerical Methods", "Math"],
  },
  {
    id: 8,
    title: "Zsh Custom Theme & Dotfiles",
    description: "Konfigurasi manajemen sistem Linux Ubuntu pribadi menggunakan Zsh, Fastfetch, dan kustomisasi tema terminal bergaya minimalis.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=60",
    githubUrl: "https://github.com",
    downloadUrl: "#",
    tags: ["Linux", "Bash/Zsh", "Dotfiles"],
  },
];

export default function ProjectPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const handleActionClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setPendingUrl(url);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    if (pendingUrl && pendingUrl !== "#") {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-900 antialiased selection:bg-zinc-100">
      
      {/* HEADER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-40 sm:pt-32 pb-20 flex flex-col justify-between">
        
        <div>
          {/* Header Section */}
          <div className="mb-14 border-b border-zinc-150 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-zinc-900 tracking-tight sm:text-4xl">
                Archive & Projects
              </h1>
              <p className="mt-2 text-sm font-sans text-zinc-500 max-w-xl leading-relaxed">
                Kumpulan repositori, aplikasi web, dan pustaka kode yang saya kembangkan dalam perjalanan belajar rekayasa perangkat lunak.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white border border-zinc-200/60 px-3 py-1.5 rounded-full w-fit shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Total: {projects.length} Repositories</span>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id || index} 
                className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-200/70 rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.08)] hover:border-zinc-300/80 transition-all duration-300"
              >
                <div>
                  {/* IMAGE - Zoom Effect on Hover */}
                  <div className="block overflow-hidden relative h-48 w-full bg-zinc-100 border-b border-zinc-100">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {project.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-tight rounded bg-zinc-100 text-zinc-600 border border-zinc-200/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title - Text Zinc 900 */}
                    <h2 className="text-xl font-serif font-medium text-zinc-900 leading-snug tracking-tight group-hover:text-zinc-700 transition-colors">
                      {project.title}
                    </h2>

                    {/* Description - Lebih Jelas dengan Zinc 700 */}
                    <p className="mt-2.5 text-sm text-zinc-700 leading-relaxed font-sans line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="px-6 pb-6 pt-3 grid grid-cols-2 gap-3 mt-2">
                  <a
                    href={project.githubUrl}
                    onClick={(e) => handleActionClick(e, project.githubUrl)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold font-sans rounded-xl border border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <svg className="w-4 h-4 fill-current text-zinc-800" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href={project.downloadUrl}
                    onClick={(e) => handleActionClick(e, project.downloadUrl)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold font-sans rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* DONATION POP-UP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative border border-zinc-100 text-center">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-4 h-4 text-zinc-900 fill-zinc-900" />
            </div>
            
            <h3 className="text-base font-serif font-medium text-zinc-900 mb-1.5">Dukung Pengembangan Project</h3>
            <p className="text-xs font-sans text-zinc-600 mb-6 leading-relaxed">
              Jika karya digital ini membantu produktivitas Anda, pertimbangkan untuk mengirimkan apresiasi sukarela melalui QRIS di bawah ini.
            </p>

            <div className="bg-zinc-50 p-4 rounded-xl inline-block mb-6 border border-zinc-100">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QRIS_DONATION_PLACEHOLDER" 
                alt="QRIS Donasi" 
                className="w-36 h-36 object-contain mx-auto mix-blend-multiply p-1 bg-white rounded-md border border-zinc-100"
              />
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 block mt-2.5">QRIS APRESIASI</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 bg-zinc-900 text-white rounded-xl font-semibold text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
              >
                Lanjutkan ke tautan asli
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-zinc-400 hover:text-zinc-600 font-medium text-xs transition-colors"
              >
                Mungkin nanti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-8 text-center text-xs font-sans text-zinc-400 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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