"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { getPostById, updatePost } from "@/src/services/api"

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  })

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlertConfig({ show: true, type, message })
  }

  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, show: false }))
    if (alertConfig.type === "success") {
      router.push("/admin/dashboard")
    }
  }

  useEffect(() => {
    // ✅ FIX 1: Cek token dulu
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/login")
      return
    }

    if (!id) return

    async function fetchPostData() {
      try {
        const response = await getPostById(id)
        const post = response?.data || response

        if (post) {
          setTitle(post.title)
          setContent(post.content)

          if (post.image) {
            // ✅ FIX 2: Pakai env variable bukan hardcode localhost
            setPreviewImage(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${post.image}`
            )
          }
        }
      } catch (error) {
        console.error("Gagal memuat data artikel:", error)
        triggerAlert("error", "Artikel tidak ditemukan atau server bermasalah.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchPostData()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !content) {
      triggerAlert("error", "Judul dan konten tidak boleh kosong!")
      return
    }

    setIsLoading(true)

    try {
      const response = await updatePost(id, {
        title,
        content,
        image: image || undefined,
      })

      if (response.success) {
        triggerAlert("success", "Perubahan artikel berhasil disimpan!")
      } else {
        triggerAlert("error", response.message || "Gagal memperbarui artikel.")
      }
    } catch (error) {
      console.error("Gagal memperbarui artikel:", error)
      triggerAlert("error", "Gagal memperbarui artikel. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-zinc-50/30 flex items-center justify-center font-sans">
        <p className="text-sm text-zinc-400 font-mono animate-pulse">
          Memuat data artikel...
        </p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-zinc-50/30 text-zinc-900 antialiased py-12 px-6">
      
      {alertConfig.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-zinc-100 shadow-xl text-center transform scale-100 transition-all">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              alertConfig.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {alertConfig.type === "success" ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>

            <h3 className="text-lg font-medium text-zinc-900">
              {alertConfig.type === "success" ? "Berhasil!" : "Perhatian"}
            </h3>
            <p className="text-sm text-zinc-500 mt-2">
              {alertConfig.message}
            </p>

            <button
              onClick={handleAlertClose}
              className={`mt-6 w-full inline-flex justify-center text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-white ${
                alertConfig.type === "success" 
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-600/10" 
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              {alertConfig.type === "success" ? "Ke Dashboard" : "Tutup"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white border border-zinc-200/60 rounded-2xl p-6 sm:p-10 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
        <div className="mb-8 pb-4 border-b border-zinc-100">
          <h1 className="text-2xl font-serif font-medium text-zinc-900 sm:text-3xl">
            Edit Artikel
          </h1>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            Perbarui informasi, perbaiki salah ketik, atau ubah konten artikel Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Judul Artikel
            </label>
            <input
              type="text"
              placeholder="Ubah judul artikel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-zinc-400 focus:bg-white p-3.5 rounded-xl text-sm font-sans placeholder-zinc-400 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Konten / Isi Artikel
            </label>
            <textarea
              placeholder="Ubah isi cerita Anda..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-zinc-400 focus:bg-white p-3.5 rounded-xl text-sm font-sans placeholder-zinc-400 h-48 outline-none transition-all resize-y"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Gambar Artikel
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setImage(file)
                  setPreviewImage(URL.createObjectURL(file))
                }
              }}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-zinc-400 focus:bg-white p-3 rounded-xl text-sm font-sans outline-none transition-all"
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl border border-zinc-200 mt-3"
              />
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <Link
              href="/admin/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors duration-200"
            >
              Batal & Kembali
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-black/5"
            >
              {isLoading ? "Memperbarui..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}