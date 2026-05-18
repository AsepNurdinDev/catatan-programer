"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getPosts } from "@/src/services/api"
import AdminPosts from "@/app/admin/posts/page"

export default function DashboardPage() {
  const router = useRouter()
  // Di mobile, biarkan default-nya tertutup (false) agar tidak menutupi layar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "kelola-posts">("overview")

  // Efek untuk mengatur default sidebar berdasarkan ukuran layar saat pertama kali dimuat
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchPosts() {
      try {
        const response = await getPosts()
        if (Array.isArray(response)) {
          setPosts(response)
        }
      } catch (error) {
        console.error("Gagal mengambil data posts:", error)
      }
    }

    fetchPosts()
  }, [router])

  function logout() {
    localStorage.removeItem("admin_token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 antialiased flex font-sans relative overflow-x-hidden">
      
      {/* BACKGROUND OVERLAY (Hanya muncul di mobile saat sidebar terbuka) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR RESPONSIVE */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-zinc-200 p-5 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? "w-64 translate-x-0" 
            : "w-64 -translate-x-full lg:translate-x-0 lg:w-20 overflow-hidden"
        }`}
      >
        <div>
          {/* Header Sidebar */}
          <div className="flex items-center justify-between mb-10 h-10">
            {/* Judul Admin Panel hanya hilang jika di desktop mode kecil */}
            <h1 className={`text-lg font-serif font-medium tracking-tight text-zinc-900 ${!isSidebarOpen ? "lg:hidden" : "block"}`}>
              Admin Panel
            </h1>
            
            {/* Tombol ciutkan sidebar (Hanya terlihat di desktop) */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors hidden lg:block"
            >
              <svg className={`w-5 h-5 transform transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            {/* Tombol tutup sidebar (Hanya terlihat di mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex flex-col gap-1.5">
            <button 
              onClick={() => {
                setActiveTab("overview")
                if (window.innerWidth < 1024) setIsSidebarOpen(false) // Otomatis tutup di mobile setelah klik
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full text-left group ${
                activeTab === "overview" 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${activeTab === "overview" ? "text-white" : "text-zinc-400 group-hover:text-zinc-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span className={`transition-opacity duration-200 ${!isSidebarOpen ? "lg:opacity-0 lg:w-0 overflow-hidden" : "opacity-100"}`}>
                Dashboard Overview
              </span>
            </button>

            <button 
              onClick={() => {
                setActiveTab("kelola-posts")
                if (window.innerWidth < 1024) setIsSidebarOpen(false) // Otomatis tutup di mobile setelah klik
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full text-left group ${
                activeTab === "kelola-posts" 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${activeTab === "kelola-posts" ? "text-white" : "text-zinc-400 group-hover:text-zinc-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className={`transition-opacity duration-200 ${!isSidebarOpen ? "lg:opacity-0 lg:w-0 overflow-hidden" : "opacity-100"}`}>
                Kelola Posts
              </span>
            </button>

            <Link href="/admin/create" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all group">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className={`transition-opacity duration-200 ${!isSidebarOpen ? "lg:opacity-0 lg:w-0 overflow-hidden" : "opacity-100"}`}>
                Tambah Post
              </span>
            </Link>
          </nav>
        </div>

        {/* Tombol Logout */}
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/60 transition-all w-full text-left group">
          <svg className="w-5 h-5 text-red-400 group-hover:text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={`transition-opacity duration-200 ${!isSidebarOpen ? "lg:opacity-0 lg:w-0 overflow-hidden" : "opacity-100"}`}>
            Logout
          </span>
        </button>
      </aside>

      {/* AREA KONTEN UTAMA DENGAN MARGIN RESPONSIVE */}
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}`}>
        
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-200/60 bg-white/80 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Tombol Hamburger (Pemicu utama di Mobile & Desktop) */}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              {activeTab === "overview" ? "Overview" : "Kelola Posts"}
            </span>
          </div>
          <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center text-[10px] text-white font-mono font-medium">AD</div>
        </header>

        {/* AREA KONTEN DINAMIS RESPONSIVE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-4xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-8 sm:space-y-10">
              <div>
                <h2 className="text-xl font-serif font-medium text-zinc-900 sm:text-2xl md:text-3xl">Dashboard Admin</h2>
                <p className="mt-1 text-xs sm:text-sm text-zinc-500">Selamat datang kembali. Berikut adalah rangkuman aktivitas situs Anda saat ini.</p>

                {/* Grid Rangkuman Kartu yang Responsif (1 Kolom di Mobile, 2 Kolom di Tablet/Desktop) */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-6 sm:mt-8">
                  <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total Posts</span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium mt-1 text-zinc-900">{posts.length}</p>
                  </div>
                  <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Status Server</span>
                    <p className="text-xs sm:text-sm font-medium mt-3 text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Operational / Connected
                    </p>
                  </div>
                </div>
              </div>

              {/* Konten Komponen kelola post */}
              <div className="pt-6 border-t border-zinc-200/60 overflow-x-auto">
                <AdminPosts posts={posts} setPosts={setPosts} />
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA POSTS */}
          {activeTab === "kelola-posts" && (
            <div className="overflow-x-auto">
              <AdminPosts posts={posts} setPosts={setPosts} />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}