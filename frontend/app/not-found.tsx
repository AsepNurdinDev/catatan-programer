import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F6F2]">
      <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">404</p>
      <h1 className="text-3xl font-serif font-semibold text-zinc-900 mb-2">
        Halaman tidak ditemukan
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-zinc-900 text-white text-sm rounded-xl hover:bg-zinc-700 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}