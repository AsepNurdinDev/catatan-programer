import { getPosts } from "@/src/services/api"
import Link from "next/link"
import SearchInput from "@/app/components/SearchInput" 
import Navbar from "@/app/components/Navbar"

import {
  formatDate,
  calculateReadTime,
} from "@/src/utils/dateAndReadTime"

export const dynamic = "force-dynamic"

// Batasan jumlah artikel per halaman
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
  
  // Mengambil angka halaman aktif dari URL, default ke halaman 1
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

  // LOGIK PAGINATION:
  // 1. Hitung total halaman berdasarkan total semua data yang cocok
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  
  // 2. Potong data (slice) sesuai halaman yang sedang aktif
  const indexOfLastPost = currentPage * POSTS_PER_PAGE
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-900 antialiased selection:bg-zinc-100">
      
      {/* HEADER - FIXED & RESPONSIVE */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-40 sm:pt-32 pb-20 flex flex-col justify-between">
        
        <div>
          {currentPosts && currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post: any, index: number) => (
                <article
                  key={post.id || index}
                  className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-100/80 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    {/* IMAGE */}
                    {post.image && (
                      <Link href={`/posts/${post.id}`} className="block overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${post.image}`}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </Link>
                    )}

                    {/* CONTENT */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mb-2.5">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>

                      <h2 className="text-lg font-serif font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors duration-200 leading-snug line-clamp-2">
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                      </h2>

                      <p className="mt-2 text-xs text-zinc-500 leading-relaxed font-sans line-clamp-3">
                        {helperTruncate(post.content, 18)}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex justify-end">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors"
                    >
                      Read entry →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <p className="text-sm text-zinc-400">
                {search ? `No entries found for "${search}".` : "Belum ada artikel yang diterbitkan."}
              </p>
            </div>
          )}
        </div>

        {/* COMPONENT PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {/* Tombol Sebelumnya */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage - 1 },
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                currentPage <= 1
                  ? "pointer-events-none border-zinc-100 text-zinc-300"
                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
              }`}
            >
              ← Prev
            </Link>

            {/* List Angka Halaman */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
              const isActive = pageNumber === currentPage;
              return (
                <Link
                  key={pageNumber}
                  href={{
                    pathname: "/",
                    query: { ...(search ? { search } : {}), page: pageNumber },
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm font-semibold"
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {/* Tombol Selanjutnya */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage + 1 },
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                currentPage >= totalPages
                  ? "pointer-events-none border-zinc-100 text-zinc-300"
                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
              }`}
            >
              Next →
            </Link>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-8 text-center text-xs font-sans text-zinc-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}