"use client"

import React, { useState } from "react"
import Link from "next/link" // 👈 Import Link untuk navigasi ke halaman edit
import { deleteProject } from "@/src/services/api"
import { Trash2, Code, Layers, Edit3 } from "lucide-react"

interface AdminProjectsProps {
  projects: any[]
  setProjects: React.Dispatch<React.SetStateAction<any[]>>
}

export default function AdminProjects({ projects, setProjects }: AdminProjectsProps) {
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  
  // State untuk Toast Notifikasi Kustom
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success"
  })

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" })
    }, 3000)
  }

  async function handleDelete(id: number) {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")
    if (!konfirmasi) return

    setIsDeletingId(id)
    try {
      const response = await deleteProject(id)
      
      if (response && (response.success || !response.error)) {
        setProjects((prev) => prev.filter((p) => (p.id || p.Id) !== id))
        // 🔴 UBAH: Menggunakan Toast kustom, bukan alert browser
        showNotification("Proyek berhasil dihapus!")
      } else {
        showNotification(response.error || "Gagal menghapus proyek.", "error")
      }
    } catch (error) {
      console.error("Error saat menghapus project:", error)
      showNotification("Terjadi kesalahan sistem saat menghapus data.", "error")
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <div className="w-full bg-white border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
      
      {/* Header Panel */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-500" />
          Daftar Proyek Portofolio
        </h3>
        <span className="text-xs font-mono text-zinc-400 bg-white border border-zinc-200/60 px-2.5 py-1 rounded-full">
          {projects.length} Total Items
        </span>
      </div>

      {/* Kondisi jika data kosong */}
      {projects.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-zinc-400">Belum ada data proyek yang ditemukan di database.</p>
        </div>
      ) : (
        /* TABEL RESPONSIVE */
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/30 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
                <th className="p-4 pl-6 font-medium">Info Project</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Tech Stack</th>
                <th className="p-4 font-medium">Status Pin</th>
                <th className="p-4 pr-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {projects.map((project) => {
                const projectId = project.id || project.Id
                const tags = project.tech_stack 
                  ? project.tech_stack.split(",").map((t: string) => t.trim()) 
                  : []

                return (
                  <tr key={projectId} className="hover:bg-zinc-50/50 transition-colors group">
                    
                    {/* Kolom 1: Title & Deskripsi */}
                    <td className="p-4 pl-6 max-w-xs sm:max-w-sm">
                      <div className="font-medium text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">
                        {project.title}
                      </div>
                      <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                        {project.description}
                      </div>
                    </td>

                    {/* Kolom 2: Kategori */}
                    <td className="p-4 text-zinc-600 font-normal">
                      <span className="px-2 py-1 text-xs rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200/30">
                        {project.category || "General"}
                      </span>
                    </td>

                    {/* Kolom 3: Tech Stack */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {tags.map((tag: string, idx: number) => (
                          <span key={idx} className="text-[10px] font-mono bg-zinc-50 border border-zinc-200/60 px-1.5 py-0.5 text-zinc-500 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Kolom 4: Is Featured */}
                    <td className="p-4">
                      {project.is_featured === true || project.is_featured === "true" || project.IsFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/30">
                          ★ Pinned
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Kolom 5: Tombol Aksi */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* 🛠️ TAMBAH OPSI EDIT: Navigasi ke halaman terpisah membawa ID */}
                        <Link
                          href={`/admin/projects/edit/${projectId}`}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all"
                          title="Edit Proyek"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {project.github_url && project.github_url !== "#" && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all"
                            title="Buka Repositori"
                          >
                            <Code className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleDelete(projectId)}
                          disabled={isDeletingId === projectId}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                          title="Hapus Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION KUSTOM ================= */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-5 py-3 rounded-xl shadow-lg border text-xs font-semibold font-mono tracking-wide flex items-center gap-2.5 ${
            toast.type === "success" 
              ? "bg-zinc-950 text-white border-zinc-800" 
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
            {toast.message.toUpperCase()}
          </div>
        </div>
      )}

    </div>
  )
}