"use client"

import { deletePost } from "@/src/services/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DeleteButtonProps {
  id: string | number
  onDeleteSuccess: () => void // PERBAIKAN: Daftarkan prop callback di sini
}

export default function DeleteButton({ id, onDeleteSuccess }: DeleteButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) 
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const response = await deletePost(id.toString())
      console.log("Delete response:", response)
      
      // Menutup modal setelah sukses
      setIsOpen(false)
      
      // PERBAIKAN: Picu fungsi penghapusan data pada State di DashboardPage
      onDeleteSuccess()
      
      // Tetap panggil router.refresh() agar sinkronisasi data Next.js server cache terjaga
      router.refresh()
    } catch (error) {
      console.error("Gagal menghapus post:", error)
      alert("Terjadi kesalahan saat menghapus artikel.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* TOMBOL UTAMA DI LIST POST */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center bg-white hover:bg-red-50 text-red-600 border border-zinc-200/80 hover:border-red-200 text-xs font-medium px-3 py-2 rounded-lg transition-all"
      >
        Delete
      </button>

      {/* POP-UP KONFIRMASI MODERN */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Latar Belakang Gelap Ringan + Blur (Backdrop) */}
          <div 
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setIsOpen(false)} 
          />

          {/* Kotak Konten Pop-up */}
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-zinc-200/80 z-10 font-sans">
            
            {/* Icon Peringatan */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            {/* Teks Deskripsi */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-serif font-medium text-zinc-900">
                Hapus Artikel?
              </h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Tombol Pilihan */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full inline-flex justify-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0110-7.74" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}