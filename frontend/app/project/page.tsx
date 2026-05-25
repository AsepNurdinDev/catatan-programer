"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link" 
import { getProjects } from "@/src/services/api"
import { FolderGit2, Code2, ExternalLink, Eye, Download, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "../components/Navbar"

export default function PublicProjectPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State untuk Pagination (3x3 = 9 items per halaman)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

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

  // ================= LOGIK KUSTOM PAGINATION =================
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(projects.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Otomatis scroll ke atas area grid secara halus saat ganti halaman
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleProtectedAction = (url: string) => {
    if (!url || url === "#") return
    setDonationModal({ isOpen: true, targetUrl: url })
  }

  const proceedToTarget = () => {
    const url = donationModal.targetUrl
    setDonationModal({ isOpen: false, targetUrl: "" })
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100 flex flex-col justify-between relative">
      
      <div className="w-full flex-grow">
        <Navbar />
        
        {/* AREA KONTEN UTAMA */}
        <main className="max-w-6xl w-full mx-auto px-6 pt-32 pb-16">
          
          {/* Header Etalase */}
          <div className="mb-12 border-b border-zinc-100 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 tracking-tight">
                Projects & Portofolio
              </h1>
              <p className="text-xs sm:text-sm font-sans text-zinc-500 max-w-xl leading-relaxed">
                Kumpulan sistem informasi, aplikasi web, dan repositori open-source yang dibangun menggunakan arsitektur modern.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-zinc-400 bg-white border border-zinc-200/60 px-3 py-1.5 rounded-full w-fit shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <FolderGit2 className="w-3.5 h-3.5 text-zinc-700" />
              <span>{projects.length} Total Items</span>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center py-24">
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Memuat repositori...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.01)]">
              <Code2 className="w-8 h-8 text-zinc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Belum ada proyek showcase yang dipublikasikan.</p>
            </div>
          ) : (
            <>
              {/* GRID KARTU PROJECT (Maksimal 3x3 = 9 per halaman) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentProjects.map((project) => {
                  const projectId = project.id || project.Id
                  const tags = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()) : ["Open Source"]
                  const imageSrc = project.image && project.image.startsWith("http") ? project.image : `${API_URL}/uploads/${project.image}`

                  const downloadZipUrl = project.github_url && project.github_url !== "#" 
                    ? `${project.github_url}/archive/refs/heads/main.zip` 
                    : "#"

                  return (
                    <div 
                      key={projectId} 
                      className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-200/70 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-300"
                    >
                      <div>
                        {/* COVER GAMBAR */}
                        <div className="overflow-hidden relative h-44 w-full bg-zinc-50 border-b border-zinc-100">
                          {project.image ? (
                            <img 
                              src={imageSrc} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                              <Code2 className="w-7 h-7 stroke-[1.2]" />
                            </div>
                          )}
                        </div>

                        {/* DETAIL KONTEN */}
                        <div className="p-5">
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-100 text-zinc-500 border border-zinc-200/20">
                                {tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-50 text-zinc-400">
                                +{tags.length - 3}
                              </span>
                            )}
                          </div>

                          <h2 className="text-base font-serif font-medium text-zinc-950 leading-snug tracking-tight line-clamp-1">
                            {project.title}
                          </h2>

                          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2 h-9">
                            {project.description}
                          </p>

                          <Link 
                            href={`/project/${project.slug}`}
                            className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-bold font-mono text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            LIHAT DETAIL
                          </Link>
                        </div>
                      </div>

                      {/* AKSI TOMBOL BAWAH */}
                      <div className="px-5 pb-5 pt-1 flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleProtectedAction(project.github_url)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
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
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                              project.live_url && project.live_url !== "#"
                                ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm" 
                                : "bg-zinc-100 text-zinc-300 pointer-events-none"
                            }`}
                          >
                            Live Demo
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <button
                          onClick={() => handleProtectedAction(downloadZipUrl)}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                            project.github_url && project.github_url !== "#"
                              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/60"
                              : "bg-zinc-50 text-zinc-300 pointer-events-none"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download ZIP
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>

              {/* ================= PANEL PAGINATION CONTROLLER ================= */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 font-bold rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "border border-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER FIXED DI DASAR HALAMAN */}
      <footer className="bg-white border-t border-zinc-100 py-6 text-xs font-sans text-zinc-400 w-full">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} The Journal. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* ================= MODAL QRIS DONASI ================= */}
      {donationModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xs w-full border border-zinc-200 p-5 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-zinc-900">Dukung Pengembang Proyek</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed px-1">
                Donasi Anda membantu membiayai operasional server dan pengembangan kode bersifat open-source. Sifatnya sukarela & seikhlasnya.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-xl max-w-[160px] mx-auto">
              <img 
                src="/images/qris.jpg" 
                alt="QRIS Code Donasi" 
                className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asepblog.my.id"
                }}
              />
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase block mt-1.5">QRIS DIGITAL CODE</span>
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
  )
}