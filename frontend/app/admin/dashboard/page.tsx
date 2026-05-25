"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getPosts, getProjects } from "@/src/services/api"
import AdminPosts from "@/app/admin/posts/page"
import AdminProjects from "./AdminProjects" // Mengimpor komponen tabel baru kita

export default function DashboardPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([]) // State baru untuk data proyek
  const [activeTab, setActiveTab] = useState<"overview" | "kelola-posts" | "kelola-projects">("overview")

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

    // Mengambil data artikel dan proyek secara bersamaan (paralel) dari Gin API
    async function fetchDashboardData() {
      try {
        const [postsResponse, projectsResponse] = await Promise.all([
          getPosts(),
          getProjects()
        ])

        if (Array.isArray(postsResponse)) setPosts(postsResponse)
        if (Array.isArray(projectsResponse)) setProjects(projectsResponse)
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error)
      }
    }

    fetchDashboardData()
  }, [router])

  function logout() {
    localStorage.removeItem("admin_token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 antialiased flex font-sans relative overflow-x-hidden">
      
      {/* BACKGROUND OVERLAY (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR */}
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
            <h1 className={`text-lg font-serif font-medium tracking-tight text-zinc-900 ${!isSidebarOpen ? "lg:hidden" : "block"}`}>
              Admin Panel
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors hidden lg:block"
            >
              <svg className={`w-5 h-5 transform transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigasi Menu */}
          <nav className="flex flex-col gap-1.5">
            <button 
              onClick={() => { setActiveTab("overview"); if (window.innerWidth < 1024) setIsSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${activeTab === "overview" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100/80"}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Overview</span>
            </button>

            <button 
              onClick={() => { setActiveTab("kelola-posts"); if (window.innerWidth < 1024) setIsSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${activeTab === "kelola-posts" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100/80"}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Kelola Posts</span>
            </button>

            {/* BARU: Navigasi ke Kelola Projects */}
            <button 
              onClick={() => { setActiveTab("kelola-projects"); if (window.innerWidth < 1024) setIsSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${activeTab === "kelola-projects" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100/80"}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Kelola Projects</span>
            </button>

            <hr className="my-2 border-zinc-100" />

            <Link href="/admin/create" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100/80 transition-all">
              <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Tambah Post</span>
            </Link>

            {/* BARU: Tautan navigasi ke Form Tambah Project yang kita buat di Tahap 2 */}
            <Link href="/admin/projects/create" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100/80 transition-all">
              <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Tambah Project</span>
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/60 transition-all text-left">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={!isSidebarOpen ? "lg:hidden" : "block"}>Logout</span>
        </button>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}`}>
        
        <header className="h-14 border-b border-zinc-200/60 bg-white/80 backdrop-blur-sm px-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            {activeTab === "overview" ? "Overview" : activeTab === "kelola-posts" ? "Kelola Posts" : "Kelola Projects"}
          </span>
          <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center text-[10px] text-white font-mono">AD</div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-4xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-serif font-medium text-zinc-900 sm:text-2xl">Dashboard Admin</h2>
                <p className="mt-1 text-xs text-zinc-500">Berikut adalah rangkuman aktivitas situs Anda saat ini.</p>

                {/* Grid Rangkuman Statistik */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mt-6">
                  <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Total Posts</span>
                    <p className="text-2xl font-serif font-medium mt-1 text-zinc-900">{posts.length}</p>
                  </div>
                  
                  {/* Statistik Project Baru */}
                  <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Total Projects</span>
                    <p className="text-2xl font-serif font-medium mt-1 text-zinc-900">{projects.length}</p>
                  </div>

                  <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Status Server</span>
                    <p className="text-xs font-medium mt-3 text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                    </p>
                  </div>
                </div>
              </div>

              {/* Tampilkan Recent Posts di halaman muka */}
              <div className="pt-6 border-t border-zinc-200/60">
                <h3 className="text-xs font-mono text-zinc-400 uppercase mb-4">Recent Posts</h3>
                <AdminPosts posts={posts} setPosts={setPosts} />
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA POSTS */}
          {activeTab === "kelola-posts" && (
            <AdminPosts posts={posts} setPosts={setPosts} />
          )}

          {/* TAB 3: KELOLA PROJECTS */}
          {activeTab === "kelola-projects" && (
            <AdminProjects projects={projects} setProjects={setProjects} />
          )}

        </main>
      </div>
    </div>
  )
}