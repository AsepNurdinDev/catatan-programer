"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjects } from "@/src/services/api";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Download,
  FolderGit2,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // State untuk kontrol Pop-up Gate Donasi QRIS
  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    targetUrl: string;
  }>({
    isOpen: false,
    targetUrl: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchDetailProject() {
      try {
        const data = await getProjects();
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.slug === params.slug);
          setProject(found || null);
        }
      } catch (error) {
        console.error("Gagal memuat detail project:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      fetchDetailProject();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/30 p-6">
        <p className="text-zinc-500 text-xs font-mono mb-4 uppercase tracking-wider">
          Proyek tidak ditemukan atau telah dihapus.
        </p>
        <button
          onClick={() => router.push("/project")}
          className="text-xs font-mono font-bold uppercase border-b border-zinc-950 pb-0.5 flex items-center gap-2 text-zinc-950 transition-all hover:opacity-70"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Portofolio
        </button>
      </div>
    );
  }

  const tags = project.tech_stack
    ? project.tech_stack.split(",").map((t: string) => t.trim())
    : [];
  const imageSrc =
    project.image && project.image.startsWith("http")
      ? project.image
      : `${API_URL}/uploads/${project.image}`;

  const downloadZipUrl =
    project.github_url && project.github_url !== "#"
      ? `${project.github_url}/archive/refs/heads/main.zip`
      : "#";

  const handleProtectedAction = (url: string) => {
    if (!url || url === "#") return;
    setDonationModal({ isOpen: true, targetUrl: url });
  };

  const proceedToTarget = () => {
    const url = donationModal.targetUrl;
    setDonationModal({ isOpen: false, targetUrl: "" });
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 font-sans antialiased flex flex-col justify-between">
      
      {/* MAIN CONTAINER LAYOUT */}
      <div className="w-full flex-grow">
        {/* HEADER NAVBAR FIXED */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-base font-serif font-semibold tracking-tight text-zinc-900">
                <Link href="/">Catatan Programmer</Link>
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                Stories, Ideas & Perspectives
              </p>
            </div>
          </div>
        </header>

        {/* CONTEN WRAPPER: Diperpendek pt-nya agar merapat ke bawah Navbar */}
        <div className="max-w-2xl mx-auto px-5 pt-24 pb-16">
          
          {/* NAV TOMBOL KEMBALI (Sudah presisi jarak tingginya) */}
          <nav className="mb-6">
            <Link
              href="/project"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
            >
              ← Project
            </Link>
          </nav>

          {/* COVER GAMBAR PROYEK: Menjaga proporsi tanpa crop & auto height */}
          <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200/60 shadow-[0_3px_10px_rgba(0,0,0,0.01)] mb-8 flex items-center justify-center p-2 sm:p-4">
            {project.image ? (
              <img
                src={imageSrc}
                alt={project.title}
                className="w-full h-auto max-h-[420px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-zinc-300 bg-zinc-50 rounded-lg">
                <Code2 className="w-8 h-8 stroke-[1.2]" />
              </div>
            )}
          </div>

          {/* HEADLINE & TAGS */}
          <div className="space-y-3.5 border-b border-zinc-100 pb-6">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-zinc-950 text-white uppercase tracking-wider">
                {project.category || "General"}
              </span>
              {tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-100 text-zinc-500 border border-zinc-200/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 tracking-tight leading-snug">
              {project.title}
            </h1>
          </div>

          {/* DESKRIPSI & DOKUMENTASI (Sangat nyaman dibaca) */}
          <div className="py-6 space-y-5 text-zinc-600 text-sm sm:text-[15px] leading-relaxed tracking-normal border-b border-zinc-100">
            <p className="font-normal text-zinc-900 leading-relaxed">
              {project.description}
            </p>

            {project.content && project.content !== project.description && (
              <div className="pt-4 border-t border-zinc-100/80 font-normal text-xs sm:text-sm text-zinc-500 whitespace-pre-line leading-relaxed">
                {project.content}
              </div>
            )}
          </div>

          {/* PANEL TOMBOL LINK RESUSABLE */}
          <div className="bg-white border border-zinc-200/60 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] grid grid-cols-1 sm:grid-cols-3 gap-2 mt-8">
            <button
              onClick={() => handleProtectedAction(project.github_url)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Repository
            </button>

            <a
              href={project.live_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                project.live_url && project.live_url !== "#"
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm"
                  : "bg-zinc-100 text-zinc-300 pointer-events-none"
              }`}
            >
              Live Preview <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => handleProtectedAction(downloadZipUrl)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download ZIP
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER DI BAGIAN DASAR HALAMAN */}
      <footer className="bg-white border-t border-zinc-100 py-6 text-xs font-sans text-zinc-400 w-full">
        <div className="max-w-2xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} The Journal. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* ================= POP-UP GATE QRIS DONASI (MODAL OVERLAY) ================= */}
      {donationModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xs w-full border border-zinc-200 p-5 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-zinc-900">
                Dukung Kreator Portofolio
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed px-1">
                Donasi seikhlasnya untuk mendukung pengembangan sistem open-source ini.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-xl max-w-[160px] mx-auto">
              <img
                src="/images/qris-donation.png"
                alt="QRIS Code Donasi"
                className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asepblog.my.id";
                }}
              />
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase block mt-1.5">
                SCAN QRIS CODE
              </span>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={proceedToTarget}
                className="w-full py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Sudah Scan / Lanjutkan Unduh
              </button>
              <button
                onClick={() => setDonationModal({ isOpen: false, targetUrl: "" })}
                className="w-full py-1.5 text-zinc-400 hover:text-zinc-800 rounded-lg text-[11px] font-medium transition-colors"
              >
                Lewati Donasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}