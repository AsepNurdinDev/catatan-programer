"use client"

import React, { useState, useEffect } from "react"
import { getProjects } from "@/src/services/api"
import { FolderGit2, Code2, ExternalLink, Eye, Download, X, Heart } from "lucide-react"

export default function PublicProjectPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State untuk Modal Detail Proyek
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  // State untuk Modal QRIS Donasi
  const [donationModal, setDonationModal] = useState<{ isOpen: boolean; targetUrl: string }>({
    isOpen: false,
    targetUrl: "",
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    async function fetchPublicProjects() {
      try {
        const data = await getProjects()
        if (Array.isArray(data)) {
          setProjects(data)
        }
      } catch (error) {
        console.error("Gagal memuat data project untuk publik:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPublicProjects()
  }, [])

  // Fungsi mengarahkan aksi sensitif (Download/Repo) lewat gate QRIS dulu
  const handleProtectedAction = (url: string) => {
    if (!url || url === "#") return
    // Buka pop-up QRIS terlebih dahulu dan simpan url tujuan utama
    setDonationModal({ isOpen: true, targetUrl: url })
  }

  // Pengunjung memilih untuk melanjutkan setelah melihat QRIS
  const proceedToTarget = () => {
    const url = donationModal.targetUrl
    setDonationModal({ isOpen: false, targetUrl: "" })
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100 relative">
      
      {/* AREA KONTEN UTAMA */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-32 pb-24">
        
        {/* Header Etalase */}
        <div className="mb-14 border-b border-zinc-200 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-zinc-950 tracking-tight sm:text-4xl">
              Projects & Portofolio
            </h1>
            <p className="mt-2 text-sm font-sans text-zinc-600 max-w-xl leading-relaxed">
              Kumpulan sistem informasi, aplikasi web, dan repositori open-source yang dibangun menggunakan arsitektur modern.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-white border border-zinc-200/60 px-3 py-1.5 rounded-full w-fit shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-700" />
            <span>{projects.length} Items</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase">Memuat repositori...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
            <Code2 className="w-8 h-8 text-zinc-300 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-sm text-zinc-500">Belum ada proyek showcase yang dipublikasikan.</p>
          </div>
        ) : (
          /* GRID KARTU PROJECT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const projectId = project.id || project.Id
              const tags = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()) : ["Open Source"]
              const imageSrc = project.image && project.image.startsWith("http") ? project.image : `${API_URL}/uploads/${project.image}`

              // Asumsi file zip di-upload admin dengan nama file yang sama atau bisa diunduh langsung dari zip source repo github
              // Di sini kita arahkan ke endpoint download publik archive dari repo github, atau file lokal jika ada
              const downloadZipUrl = project.github_url && project.github_url !== "#" 
                ? `${project.github_url}/archive/refs/heads/main.zip` 
                : "#"

              return (
                <div 
                  key={projectId} 
                  className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.06)] hover:border-zinc-300/80 transition-all duration-300"
                >
                  <div>
                    {/* COVER GAMBAR */}
                    <div className="overflow-hidden relative h-48 w-full bg-zinc-100 border-b border-zinc-100">
                      {project.image ? (
                        <img 
                          src={imageSrc} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                          <Code2 className="w-8 h-8 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    {/* DETAIL KONTEN */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-zinc-100 text-zinc-600 border border-zinc-200/40">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-lg font-serif font-medium text-zinc-950 leading-snug tracking-tight">
                        {project.title}
                      </h2>

                      {/* 🔴 PERBAIKAN: Membatasi baris deskripsi dengan line-clamp-2 agar tinggi card simetris */}
                      <p className="mt-2 text-sm text-zinc-600 leading-relaxed font-sans line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tombol Lihat Detail */}
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-zinc-500 hover:text-zinc-950 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        LIHAT DETAIL PROYEK
                      </button>
                    </div>
                  </div>

                  {/* AKSI TOMBOL BAWAH */}
                  <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleProtectedAction(project.github_url)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          project.github_url && project.github_url !== "#"
                            ? "border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-50" 
                            : "border-zinc-100 text-zinc-300 pointer-events-none"
                        }`}
                      >
                        Repository
                      </button>

                      <a
                        href={project.live_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                          project.live_url && project.live_url !== "#"
                            ? "bg-zinc-950 text-white hover:bg-zinc-800" 
                            : "bg-zinc-100 text-zinc-300 pointer-events-none"
                        }`}
                      >
                        Live Demo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Tombol Download berkas format ZIP */}
                    <button
                      onClick={() => handleProtectedAction(downloadZipUrl)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                        project.github_url && project.github_url !== "#"
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
                          : "bg-zinc-50 text-zinc-300 pointer-events-none"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Source (ZIP)
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ================= MODAL 1: LIHAT DETAIL PROYEK ================= */}
      {selectedProject && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 overflow-hidden max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">Project Detail Showcase</span>
              <button onClick={() => setSelectedProject(null)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 font-sans text-sm text-zinc-700 leading-relaxed">
              <h3 className="text-xl font-serif font-semibold text-zinc-950">{selectedProject.title}</h3>
              
              <div className="flex flex-wrap gap-1">
                {selectedProject.tech_stack?.split(",").map((t: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-zinc-100 text-zinc-600 rounded">{t.trim()}</span>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-zinc-400 uppercase block">Ringkasan Deskripsi:</span>
                <p>{selectedProject.description}</p>
              </div>

              {/* Jika field Content milik backend juga ingin kamu tampilkan utuh */}
              {selectedProject.content && selectedProject.content !== selectedProject.description && (
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <span className="text-xs font-mono text-zinc-400 uppercase block">Dokumentasi Tambahan / Fitur:</span>
                  <p className="bg-zinc-50 p-4 rounded-xl text-xs font-mono whitespace-pre-line text-zinc-600 border border-zinc-200/40">
                    {selectedProject.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: GATE POP-UP QRIS DONASI (OPSIONAL) ================= */}
      {donationModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-zinc-200 p-6 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900">Dukung Pengembang Proyek</h3>
              <p className="text-xs text-zinc-500 leading-relaxed px-2">
                Donasi Anda membantu membiayai operasional server dan pengembangan kode bersifat open-source. Sifatnya sukarela & seikhlasnya.
              </p>
            </div>

            {/* BOX TEMPAT SCAN QRIS KAMU */}
            <div className="bg-zinc-50 border border-zinc-200/80 p-4 rounded-2xl max-w-[200px] mx-auto shadow-inner">
              {/* ⚠️ GANTI SOURCE GAMBAR DI BAWAH INI DENGAN PATH / URL QRIS ASLI MILIKMU */}
              <img 
                src="/images/qris.jpg" 
                alt="QRIS Code Donasi" 
                className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asepblog.my.id"
                }}
              />
              <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase block mt-2">QRIS DIGITAL CODE</span>
            </div>

            {/* BUTTON GROUP AKSI */}
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