import { getPosts } from "@/src/services/api"
import Link from "next/link"
import SearchInput from "@/app/components/SearchInput"
import Navbar from "@/app/components/Navbar"
import { formatDate, calculateReadTime } from "@/src/utils/dateAndReadTime"

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

// Warna aksen per card, cycling secara estetik
const ACCENT_COLORS = [
  { line: "#C8B8FF", dot: "#8B5CF6", label: "bg-violet-50 text-violet-500" },
  { line: "#93C5FD", dot: "#3B82F6", label: "bg-blue-50 text-blue-500" },
  { line: "#6EE7B7", dot: "#10B981", label: "bg-emerald-50 text-emerald-500" },
  { line: "#FCA5A5", dot: "#EF4444", label: "bg-red-50 text-red-500" },
  { line: "#FCD34D", dot: "#F59E0B", label: "bg-amber-50 text-amber-500" },
  { line: "#F9A8D4", dot: "#EC4899", label: "bg-pink-50 text-pink-500" },
]

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
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .card-root {
          font-family: 'DM Sans', sans-serif;
        }

        .card-title {
          font-family: 'DM Serif Display', serif;
        }

        .card-accent-line {
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          width: 32px;
        }

        .card-wrapper:hover .card-accent-line {
          width: 56px;
        }

        .card-image-wrap img {
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .card-wrapper:hover .card-image-wrap img {
          transform: scale(1.06);
        }

        .card-arrow {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
          opacity: 0;
          transform: translateX(-6px);
        }

        .card-wrapper:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .card-read-label {
          transition: color 0.3s ease;
        }

        .card-wrapper:hover .card-read-label {
          color: #18181b;
        }

        .card-overlay {
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .card-wrapper:hover .card-overlay {
          opacity: 1;
        }

        .page-num-active {
          background: #18181b;
          color: #fff;
        }
      `}</style>

      {/* HEADER */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-36 pb-28 flex flex-col justify-between">

        {currentPosts && currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {currentPosts.map((post: any, index: number) => {
              const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]
              return (
                <article key={post.id || index} className="card-root card-wrapper group">
                  <Link href={`/posts/${post.id}`} className="flex flex-col h-full">

                    <div
                      className="flex flex-col h-full rounded-3xl overflow-hidden bg-white"
                      style={{
                        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.03)",
                        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = "0 16px 48px -8px rgba(0,0,0,0.10), 0 4px 12px -2px rgba(0,0,0,0.06)"
                        el.style.transform = "translateY(-4px)"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.03)"
                        el.style.transform = "translateY(0)"
                      }}
                    >

                      {/* IMAGE */}
                      {post.image ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden card-image-wrap bg-zinc-100">
                          <div
                            className="card-overlay absolute inset-0 z-10"
                            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.18) 100%)" }}
                          />
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${post.image}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        // Placeholder jika tidak ada gambar
                        <div
                          className="aspect-[16/10] w-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${accent.line}33 0%, ${accent.dot}22 100%)` }}
                        >
                          <span
                            className="text-4xl font-serif font-bold select-none"
                            style={{ color: accent.dot, opacity: 0.3, fontFamily: "'DM Serif Display', serif" }}
                          >
                            {post.title?.[0] || "A"}
                          </span>
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-6 flex flex-col flex-grow">

                        {/* ACCENT LINE */}
                        <div className="mb-4">
                          <div
                            className="card-accent-line h-[3px] rounded-full"
                            style={{ background: accent.dot }}
                          />
                        </div>

                        {/* META */}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full ${accent.label}`}
                          >
                            {calculateReadTime(post.content)}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {formatDate(post.created_at)}
                          </span>
                        </div>

                        {/* TITLE */}
                        <h2
                          className="card-title text-[1.25rem] leading-tight text-zinc-900 mb-3"
                          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.01em" }}
                        >
                          {post.title}
                        </h2>

                        {/* EXCERPT */}
                        <p className="text-[13px] text-zinc-500 leading-relaxed flex-grow">
                          {helperTruncate(post.content, 20)}
                        </p>

                        {/* FOOTER */}
                        <div className="mt-5 pt-5 border-t border-zinc-50 flex items-center justify-between">
                          <span className="card-read-label text-[12px] font-medium text-zinc-400 tracking-wide">
                            Baca selengkapnya
                          </span>
                          <div
                            className="card-arrow w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: accent.dot + "18" }}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              style={{ color: accent.dot }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>

                      </div>
                    </div>

                  </Link>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-28 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              {search ? `Tidak ada artikel untuk "${search}".` : "Belum ada artikel yang diterbitkan."}
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2">

            {/* Prev */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage - 1 },
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                currentPage <= 1
                  ? "pointer-events-none text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </Link>

            {/* Numbers */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-2xl" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                const isActive = num === currentPage
                return (
                  <Link
                    key={num}
                    href={{
                      pathname: "/",
                      query: { ...(search ? { search } : {}), page: num },
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "page-num-active shadow-sm scale-105"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {num}
                  </Link>
                )
              })}
            </div>

            {/* Next */}
            <Link
              href={{
                pathname: "/",
                query: { ...(search ? { search } : {}), page: currentPage + 1 },
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                currentPage >= totalPages
                  ? "pointer-events-none text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
              }`}
            >
              Selanjutnya
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} Catatan Programmer.
          </p>
          <div className="flex gap-6 text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}