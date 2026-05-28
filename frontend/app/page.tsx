import { getPosts } from "@/src/services/api"
import Link from "next/link"
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
    <div className="min-h-screen flex flex-col bg-zinc-50/40 text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* HEADER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-36 pb-24 flex flex-col justify-between">
        
        <div>
          {currentPosts && currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {currentPosts.map((post: any, index: number) => (
                <article
                  key={post.id || index}
                  className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-500 ease-out"
                >
                  <Link href={`/posts/${post.id}`} className="flex flex-col h-full">
                    {/* IMAGE WITH ELEGANT OVERLAY */}
                    {post.image && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                        <div className="absolute inset-0 bg-zinc-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    )}

                    {/* CONTENT AREA */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* META INFO */}
                        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-zinc-400 font-mono">
                          <span>{formatDate(post.created_at)}</span>
                          <span className="text-zinc-300">•</span>
                          <span>{calculateReadTime(post.content)}</span>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-xl font-serif font-semibold text-zinc-900 tracking-tight leading-snug group-hover:text-zinc-800 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h2>

                        {/* EXCERPT */}
                        <p className="text-[13px] text-zinc-500/90 leading-relaxed font-sans line-clamp-3">
                          {helperTruncate(post.content, 18)}
                        </p>
                      </div>

                      {/* READ ENTRY LINK INDIKATOR */}
                      <div className="pt-6 mt-4 border-t border-zinc-50 flex items-center justify-end text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors duration-300">
                        <span>Read entry</span>
                        <svg 
                          className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-zinc-100/80 shadow-sm max-w-xl mx-auto">
              <p className="text-sm text-zinc-400 font-sans">
                {search ? `No entries found for "${search}".` : "Belum ada artikel yang diterbitkan."}
              </p>
            </div>
          )}
        </div>

        {/* COMPONENT PAGINATION - MINIMALIST */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-1.5">
            {/* Tombol Sebelumnya */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage - 1 },
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                currentPage <= 1
                  ? "pointer-events-none text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            >
              Prev
            </Link>

            {/* List Angka Halaman */}
            <div className="flex items-center gap-1 bg-zinc-100/60 p-1 rounded-2xl border border-zinc-200/40">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage;
                return (
                  <Link
                    key={pageNumber}
                    href={{
                      pathname: "/",
                      query: { ...(search ? { search } : {}), page: pageNumber },
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-white text-zinc-950 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold scale-105"
                        : "text-zinc-500 hover:text-zinc-950 hover:bg-white/50"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>

            {/* Tombol Selanjutnya */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage + 1 },
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                currentPage >= totalPages
                  ? "pointer-events-none text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            >
              Next
            </Link>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100/80 py-10 text-xs font-sans text-zinc-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. Elegant Space.</p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}