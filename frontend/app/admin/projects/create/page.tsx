"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/src/services/api"
import { ArrowLeft, Upload, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // State untuk menampung inputan form
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Web Application")
  const [techStack, setTechStack] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Menangani perubahan input gambar & membuat preview singkat
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle Submit Form ke API Golang
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!imageFile) {
      setError("Silakan unggah gambar cover proyek terlebih dahulu.")
      setLoading(false)
      return
    }

    // Bungkus semua data ke dalam FormData karena ada pengiriman file gambar
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("content", description)
    formData.append("category", category)
    formData.append("tech_stack", techStack) 
    formData.append("github_url", githubUrl)
    formData.append("live_url", liveUrl)
    formData.append("is_featured", String(isFeatured))
    formData.append("image", imageFile)

    try {
      const response = await createProject(formData)
      
      // Sesuaikan pengecekan respons sesuai struktur backend kamu (misal data.success atau langsung response)
      if (response && (response.success || !response.error)) {
        alert("Proyek baru berhasil dipublikasikan!")
        router.push("/admin/dashboard") // Kembali ke dashboard setelah sukses
      } else {
        setError(response.error || "Gagal menyimpan proyek ke server.")
      }
    } catch (err: any) {
      console.error("Error submit project:", err)
      setError("Terjadi kesalahan sistem. Pastikan koneksi backend aktif.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 antialiased font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigasi Kembali */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          KEMBALI KE DASHBOARD
        </Link>

        {/* Header Form */}
        <div className="mb-10">
          <h1 className="text-2xl font-serif font-medium text-zinc-950 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-700" />
            Tambah Proyek Portofolio
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-500">
            Formulir untuk mempublikasikan hasil karya digital, sistem informasi, atau repositori baru ke database.
          </p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* FORM UTAMA */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-zinc-200/60 p-6 sm:p-8 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
          
          {/* 1. Judul Proyek */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Judul Proyek</label>
            <input 
              type="text"
              required
              placeholder="Contoh: Website E-Commerce Kos Asepshan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-zinc-50/30 transition-colors"
            />
          </div>

          {/* 2. Kategori & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-white transition-colors"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Dataset Culture">Dataset Culture</option>
                <option value="Open Source Library">Open Source Library</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Tech Stack (Pisah dengan koma)</label>
              <input 
                type="text"
                required
                placeholder="Golang, Next.js, Tailwind, Docker"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-zinc-50/30 transition-colors"
              />
            </div>
          </div>

          {/* 3. Deskripsi Singkat */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Deskripsi Proyek</label>
            <textarea 
              required
              rows={4}
              placeholder="Jelaskan secara singkat fitur utama, latar belakang, atau detail dari proyek ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-zinc-50/30 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* 4. Link Tautan (GitHub & Live Demo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">URL GitHub (Opsional)</label>
              <input 
                type="url"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-zinc-50/30 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">URL Live Demo (Opsional)</label>
              <input 
                type="url"
                placeholder="https://proyek-kamu.vercel.app"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 bg-zinc-50/30 transition-colors"
              />
            </div>
          </div>

          {/* 5. Upload File Gambar */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Cover Image Proyek</label>
            <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-4 transition-colors hover:border-zinc-400 bg-zinc-50/20 flex flex-col items-center justify-center relative min-h-[140px]">
              {imagePreview ? (
                <div className="w-full h-40 relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-lg font-mono hover:bg-zinc-900 transition-colors"
                  >
                    GANTI
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full py-4 text-zinc-400 hover:text-zinc-700 transition-colors">
                  <Upload className="w-6 h-6 mb-2 stroke-[1.5]" />
                  <span className="text-xs font-medium">Klik untuk pilih gambar cover proyek</span>
                  <span className="text-[10px] font-mono mt-1 text-zinc-400">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* 6. Opsi Sematkan (Pin/Featured) */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-950 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-medium text-zinc-700 cursor-pointer select-none">
              Sematkan Proyek ini di bagian atas (*Featured Project*)
            </label>
          </div>

          {/* 7. Tombol Aksi Simpan */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Link 
              href="/admin/dashboard"
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Publikasikan Proyek"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}