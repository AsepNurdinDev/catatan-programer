"use client"

import React, { useState, useEffect } from "react"
import { getProjects } from "@/src/services/api"
import { FolderGit2, Code2, ExternalLink } from "lucide-react"
import Navbar from "../components/Navbar"

export default function PublicProjectPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mengambil URL API Backend dari environment variable (.env.local)
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

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100">
      <Navbar/>
      
      {/* AREA KONTEN UTAMA */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-32 pb-24">
        
        {/* Header Etealase */}
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
            <span>{projects.length} Repositories</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase">Memuat repositori...</p>
          </div>
        ) : projects.length === 0 ? (
          /* JIKA DATABASE KOSONG */
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
            <Code2 className="w-8 h-8 text-zinc-300 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-sm text-zinc-500">Belum ada proyek showcase yang dipublikasikan.</p>
          </div>
        ) : (
          /* GRID KARTU PROJECT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const projectId = project.id || project.Id
              
              // Memecah teks tech_stack (contoh: "Go, Next.js") menjadi array badge tag
              const tags = project.tech_stack 
                ? project.tech_stack.split(",").map((t: string) => t.trim()) 
                : ["Open Source"]

              // Validasi apakah gambar berupa URL penuh (http) atau path relatif upload backend
              const imageSrc = project.image && project.image.startsWith("http")
                ? project.image
                : `${API_URL}/uploads/${project.image}`

              return (
                <div 
                  key={projectId} 
                  className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.06)] hover:border-zinc-300/80 transition-all duration-300"
                >
                  <div>
                    {/* BAGIAN COVER GAMBAR */}
                    <div className="overflow-hidden relative h-48 w-full bg-zinc-100 border-b border-zinc-100">
                      {project.image ? (
                        <img 
                          src={imageSrc} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          onError={(e) => {
                            // Fallback jika file gambar di server tidak ditemukan / error
                            e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                          <Code2 className="w-8 h-8 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    {/* KONTEN DETAIL CARD */}
                    <div className="p-6">
                      {/* Daftar Tech Stack (Badge) */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.map((tag: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-zinc-100 text-zinc-600 border border-zinc-200/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Judul Proyek */}
                      <h2 className="text-lg font-serif font-medium text-zinc-950 leading-snug tracking-tight">
                        {project.title}
                      </h2>

                      {/* Deskripsi */}
                      <p className="mt-2 text-sm text-zinc-600 leading-relaxed font-sans line-clamp-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM BUTTONS (AKSI) */}
                  <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                    {/* Tombol GitHub */}
                    <a
                      href={project.github_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                        project.github_url && project.github_url !== "#"
                          ? "border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-50" 
                          : "border-zinc-100 text-zinc-300 pointer-events-none"
                      }`}
                    >
                      Repository
                    </a>

                    {/* Tombol Live Demo */}
                    <a
                      href={project.live_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                        project.live_url && project.live_url !== "#"
                          ? "bg-zinc-950 text-white hover:bg-zinc-800" 
                          : "bg-zinc-100 text-zinc-300 pointer-events-none"
                      }`}
                    >
                      Live Demo
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}