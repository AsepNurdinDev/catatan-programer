"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProjects } from "@/src/services/api"
import { ArrowLeft, Code2, ExternalLink, Download, FolderGit2, Heart, X } from "lucide-react"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  // State untuk kontrol Pop-up Gate Donasi QRIS
  const [donationModal, setDonationModal] = useState<{ isOpen: boolean; targetUrl: string }>({
    isOpen: false,
    targetUrl: "",
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    async function fetchDetailProject() {
      try {
        // Mengambil semua data project publik dari API Golang kamu
        const data = await getProjects()
        if (Array.isArray(data)) {
          // Cari project spesifik yang kolom slug-nya cocok dengan isi URL browser
          const found = data.find((p: any) => p.slug === params.slug)
          setProject(found || null)
        }
      } catch (error) {
        console.error("Gagal memuat detail project:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.slug) {
      fetchDetailProject()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/30 p-6">
        <p className="text-zinc-500 font-medium mb-4">Proyek tidak ditemukan atau telah dihapus.</p>
        <button onClick={() => router.push("/project")} className="text-sm font-semibold flex items-center gap-2 text-zinc-950 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portofolio
        </button>
      </div>
    )
  }

  const tags = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()) : []
  const imageSrc = project.image && project.image.startsWith("http") ? project.image : `${API_URL}/uploads/${project.image}`
  
  // URL Otomatis untuk mendownload ZIP langsung dari Repository GitHub utama
  const downloadZipUrl = project.github_url && project.github_url !== "#" 
    ? `${project.github_url}/archive/refs/heads/main.zip` 
    : "#"

  // Fungsi pengadang aksi unduh / repositori lewat QRIS dulu
  const handleProtectedAction = (url: string) => {
    if (!url || url === "#") return
    setDonationModal({ isOpen: true, targetUrl: url })
  }

  // Melanjutkan aksi ke tab baru jika user menekan tombol lanjut
  const proceedToTarget = () => {
    const url = donationModal.targetUrl
    setDonationModal({ isOpen: false, targetUrl: "" })
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 antialiased pb-24 relative pt-32">
      <div className="max-w-3xl w-full mx-auto px-6">
        
        {/* Tombol Navigasi Kembali */}
        <button 
          onClick={() => router.push("/project")}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-zinc-400 hover:text-zinc-950 uppercase mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI KE PORTOFOLIO
        </button>

        {/* Banner Gambar Proyek */}
        <div className="w-full h-64 sm:h-96 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-10">
          {project.image ? (
            <img src={imageSrc} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300">
              <Code2 className="w-12 h-12 stroke-[1.2]" />
            </div>
          )}
        </div>

        {/* Informasi Atas & Tagging */}
        <div className="space-y-4 border-b border-zinc-200 pb-8">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-950 text-white uppercase tracking-wider">
              {project.category || "General"}
            </span>
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 text-zinc-600 border border-zinc-200/40">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-serif font-semibold text-zinc-950 tracking-tight sm:text-4xl leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Konten Isi Deskripsi Lengkap */}
        <div className="py-8 space-y-6 text-zinc-700 leading-relaxed text-sm sm:text-base border-b border-zinc-200">
          <p className="font-medium text-zinc-900 text-base sm:text-lg leading-relaxed">
            {project.description}
          </p>
          
          {/* Menampilkan text area 'content' dokumentasi yang diisi admin */}
          {project.content && project.content !== project.description && (
            <div className="pt-4 border-t border-zinc-100 font-normal whitespace-pre-line text-zinc-600">
              {project.content}
            </div>
          )}
        </div>

        {/* Panel Tombol Unduh & Tautan (Aksi Utama) */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
          {/* 🔒 Punya QRIS Gate */}
          <button
            onClick={() => handleProtectedAction(project.github_url)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-zinc-800"
          >
            <FolderGit2 className="w-4 h-4" /> Buka Repository
          </button>

          {/* 🌐 Terbuka Publik Langsung */}
          <a
            href={project.live_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
              project.live_url && project.live_url !== "#" 
                ? "bg-zinc-950 text-white hover:bg-zinc-800" 
                : "bg-zinc-100 text-zinc-300 pointer-events-none"
            }`}
          >
            Live Preview <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* 🔒 Punya QRIS Gate */}
          <button
            onClick={() => handleProtectedAction(downloadZipUrl)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80 transition-all"
          >
            <Download className="w-4 h-4" /> Download ZIP
          </button>
        </div>

      </div>

      {/* ================= POP-UP GATE QRIS DONASI (MODAL OVERLAY) ================= */}
      {donationModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-zinc-200 p-6 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900">Dukung Kreator Portofolio</h3>
              <p className="text-xs text-zinc-500 leading-relaxed px-2">
                Donasi seikhlasnya untuk mendukung pengembangan sistem open-source ini terus berjalan aktif.
              </p>
            </div>

            {/* Kotak Kode Batang QRIS */}
            <div className="bg-zinc-50 border border-zinc-200/80 p-4 rounded-2xl max-w-[200px] mx-auto shadow-inner">
              <img 
                src="/images/qris-donation.png" 
                alt="QRIS Code Donasi" 
                className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asepblog.my.id"
                }}
              />
              <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase block mt-2">SCAN QRIS CODE</span>
            </div>

            {/* Tombol Opsi */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={proceedToTarget}
                className="w-full py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Sudah Scan / Lanjutkan Unduh
              </button>
              <button
                onClick={() => setDonationModal({ isOpen: false, targetUrl: "" })}
                className="w-full py-2 text-zinc-500 hover:text-zinc-900 rounded-xl text-xs font-medium transition-colors"
              >
                Lewati Donasi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}