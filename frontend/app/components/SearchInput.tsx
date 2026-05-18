"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Mengambil nilai search dari URL saat ini untuk nilai awal state
  const currentSearch = searchParams.get("search") || ""
  
  // State lokal untuk menyimpan apa yang sedang diketik user sebelum di-enter
  const [inputValue, setInputValue] = useState(currentSearch)

  // Sinkronisasi state lokal jika URL berubah (misal: tombol clear atau navigasi)
  useEffect(() => {
    setInputValue(currentSearch)
  }, [currentSearch])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Mencegah reload halaman penuh halaman bawaan HTML

    const params = new URLSearchParams(searchParams.toString())
    
    if (inputValue.trim()) {
      params.set("search", inputValue.trim())
    } else {
      params.delete("search") // Jika input kosong, hapus parameter search dari URL
    }

    // Eksekusi perubahan URL hanya saat form di-submit (User tekan Enter)
    router.push(`/?${params.toString()}`)
  }

  return (
    // Membungkus input dengan tag <form> agar tombol Enter otomatis memicu onSubmit
    <form onSubmit={handleSubmit} className="w-full sm:w-80">
      <input
        type="text"
        placeholder="Cari artikel lalu tekan Enter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm outline-none focus:border-zinc-400 focus:bg-white transition-all"
      />
    </form>
  )
}