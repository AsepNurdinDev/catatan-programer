"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProjects, updateProject } from "@/src/services/api" // 👈 Pastikan updateProject sudah ada di api.ts
import { ArrowLeft, Save, Code2 } from "lucide-react"

export default function AdminEditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // State Form Inputs
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
    is_featured: "false"
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // State Toast Notifikasi
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

  useEffect(() => {
    async function loadProjectData() {
      try {
        const data = await getProjects()
        if (Array.isArray(data)) {
          // Cari proyek berdasarkan ID yang ada di URL params
          const found = data.find((p: any) => String(p.id || p.Id) === String(params.id))
          if (found) {
            setFormData({
              title: found.title || "",
              slug: found.slug || "",
              description: found.description || "",
              content: found.content || "",
              category: found.category || "",
              tech_stack: found.tech_stack || "",
              github_url: found.github_url || "",
              live_url: found.live_url || "",
              is_featured: found.is_featured === true || found.is_featured === "true" ? "true" : "false"
            })
          } else {
            showNotification("Data proyek tidak ditemukan", "error")
          }
        }
      } catch (error) {
        console.error(error)
        showNotification("Gagal memuat data dari server", "error")
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadProjectData()
  }, [params.id])

  // Otomatis update slug pas judul diubah
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    setFormData({ ...formData, title, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    const data = new FormData()
    data.append("title", formData.title)
    data.append("slug", formData.slug)
    data.append("description", formData.description)
    data.append("content", formData.content)
    data.append("category", formData.category)
    data.append("tech_stack", formData.tech_stack)
    data.append("github_url", formData.github_url)
    data.append("live_url", formData.live_url)
    data.append("is_featured", formData.is_featured)
    
    if (imageFile) {
      data.append("image", imageFile)
    }

    try {
      await updateProject(Number(params.id), data)
      showNotification("Perubahan proyek berhasil disimpan!")
      
      // Tunggu sebentar biar admin liat toast sukses, lalu balik ke dashboard
      setTimeout(() => {
        router.push("/admin") // Sesuaikan path dashboard admin kamu
      }, 1500)
    } catch (error) {
      console.error(error)
      showNotification("Gagal menyimpan perubahan proyek", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 font-sans antialiased pt-32 pb-24">
      <div className="max-w-2xl w-full mx-auto px-6">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-zinc-400 hover:text-zinc-950 uppercase mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI KELUAR
        </button>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 border-b border-zinc-100 pb-4">
            <h1 className="text-xl font-serif font-semibold text-zinc-950 tracking-tight">Edit Detail Proyek</h1>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase">ID PROYEK: #{params.id}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-zinc-700">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label>JUDUL PROYEK</label>
                <input type="text" value={formData.title} onChange={handleTitleChange} required className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
              </div>
              <div className="space-y-1.5">
                <label>SLUG (URL OTOMATIS)</label>
                <input type="text" value={formData.slug} readOnly className="w-full px-3 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-400 cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label>RINGKASAN DESKRIPSI (TAMPIL DI CARD)</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
            </div>

            <div className="space-y-1.5">
              <label>DOKUMENTASI / FITUR LENGKAP</label>
              <textarea rows={5} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900 font-sans text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label>KATEGORI</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
              </div>
              <div className="space-y-1.5">
                <label>TECH STACK (PISAH DENGAN KOMA)</label>
                <input type="text" value={formData.tech_stack} onChange={(e) => setFormData({...formData, tech_stack: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label>GITHUB URL</label>
                <input type="url" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
              </div>
              <div className="space-y-1.5">
                <label>LIVE DEMO URL</label>
                <input type="url" value={formData.live_url} onChange={(e) => setFormData({...formData, live_url: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div className="space-y-1.5">
                <label>STATUS PINNED (FEATURED)</label>
                <select value={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.value})} className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-zinc-900">
                  <option value="false">Jangan Pin Proyek</option>
                  <option value="true">Sematkan di Atas (★ Pinned)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label>GANTI GAMBAR COVER <span className="text-zinc-400 font-normal">(Kosongkan jika tetap)</span></label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 file:cursor-pointer" />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => router.back()} className="px-4 py-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 text-zinc-600 transition-colors">
                BATAL
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                {submitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ================= TOAST NOTIFICATION KUSTOM ================= */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-5 py-3 rounded-xl shadow-lg border text-xs font-semibold font-mono tracking-wide flex items-center gap-2.5 ${
            toast.type === "success" ? "bg-zinc-950 text-white border-zinc-800" : "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
            {toast.message.toUpperCase()}
          </div>
        </div>
      )}

    </div>
  )
}