import { getPosts } from "@/src/services/api"
import Link from "next/link"
import Image from "next/image" // Diubah ke next/image untuk hemat kuota & lazy loading
import SearchInput from "@/app/components/SearchInput" 
import Navbar from "@/app/components/Navbar"

import {
  formatDate,
  calculateReadTime,
} from "@/src/utils/dateAndReadTime"

export const dynamic = "force-dynamic"

const POSTS_PER_PAGE = 6

const helperTruncate = (text: string, maxWords: number) => {
  if (!text) return ""
  const words = text.split(" ")
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "..."
  }
  return text
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; page?: string }> | { search?: string; page?: string }
}) {
  
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const currentPage = Number(resolvedParams?.page) || 1
  
  let allPosts: any[] = []
  
  try {
    const response = await getPosts(search)
    if (Array.isArray(response)) {
      allPosts = response
    }
  } catch (error) {
    console.error("Gagal mengambil data artikel:", error)
  }

  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  
  const indexOfLastPost = currentPage * POSTS_PER_PAGE
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-zinc-100 selection:text-zinc-900">
      
      <Navbar />

      {/* MAIN CONTENT */}
      {/* Perbaikan: Jarak padding top diselaraskan agar transisi konten lebih halus */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-32 pb-24 flex flex-col justify-between">
        
        <div>
          {/* Section info pencarian jika user sedang mencari sesuatu */}
          {search && (
            <div className="mb-8 animate-fade-in">
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Hasil Pencarian Untuk</p>
              <h1 className="text-xl font-serif font-medium text-zinc-800 mt-1">“{search}”</h1>
            </div>
          )}

          {currentPosts && currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post: any, index: number) => (
                <article
                  key={post.id || index}
                  className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-100 rounded-2xl transition-all duration-300 hover:border-zinc-200/80 hover:-translate-y-1"
                >
                  <div>
                    {/* IMAGE CONTAINER WITH NEXT/IMAGE */}
                    {post.image && (
                      <Link href={`/posts/${post.id}`} className="block overflow-hidden relative aspect-[16/10] bg-zinc-50">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${post.image}`}
                          alt={post.title}
                          fill
                          sizes="(max-w-7xl) 33vw, 50vw, 100vw"
                          loading="lazy" // Menghemat kuota, gambar hanya di-load saat di-scroll
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                        />
                      </Link>
                    )}

                    {/* CONTENT AREA */}
                    <div className="p-6">
                      {/* Meta info dengan font lebih tipis & clean */}
                      <div className="flex items-center gap-2 text-[11px] font-mono tracking-tight text-zinc-400 mb-3">
                        <span>{formatDate(post.created_at)}</span>
                        <span className="text-zinc-300">•</span>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>

                      {/* Judul: Font serif lebih disempurnakan spacing-nya */}
                      <h2 className="text-lg font-serif font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors duration-200 leading-snug tracking-tight line-clamp-2">
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                      </h2>

                      {/* Deskripsi pendek */}
                      <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed font-sans font-light line-clamp-3">
                        {helperTruncate(post.content, 18)}
                      </p>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="px-6 pb-6 pt-0 flex justify-end">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors inline-flex items-center gap-1"
                    >
                      Read entry 
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-zinc-100/80">
              <p className="text-sm font-serif text-zinc-400 italic">
                {search ? `No entries found for "${search}".` : "Belum ada artikel yang diterbitkan."}
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION COMPONENT - ELEGAN & SIMPEL */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-1.5">
            {/* Prev Button */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage - 1 },
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                currentPage <= 1
                  ? "pointer-events-none border-transparent text-zinc-300"
                  : "border-zinc-100 hover:border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
              }`}
            >
              ← Prev
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage;
                return (
                  <Link
                    key={pageNumber}
                    href={{
                      pathname: "/",
                      query: { ...(search ? { search } : {}), page: pageNumber },
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-zinc-900 text-white font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>

            {/* Next Button */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage + 1 },
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                currentPage >= totalPages
                  ? "pointer-events-none border-transparent text-zinc-300"
                  : "border-zinc-100 hover:border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
              }`}
            >
              Next →
            </Link>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-10 text-center text-[11px] font-mono text-zinc-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. All rights reserved.</p>
          <div className="flex gap-6 font-sans text-xs">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}