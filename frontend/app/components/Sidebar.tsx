"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderGit2, BookOpen, LayoutDashboard, PlusCircle, FileCode, LogOut, ChevronLeft } from "lucide-react"

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: "overview" | "kelola-posts" | "kelola-projects";
  setActiveTab: (tab: "overview" | "kelola-posts" | "kelola-projects") => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const handleNavClick = (tab: "overview" | "kelola-posts" | "kelola-projects") => {
    setActiveTab(tab)
    if (window.innerWidth < 1024) setIsOpen(false)
  }

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-zinc-200 p-5 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isOpen 
          ? "w-64 translate-x-0" 
          : "w-64 -translate-x-full lg:translate-x-0 lg:w-20 overflow-hidden"
      }`}
    >
      <div>
        {/* Header Sidebar */}
        <div className="flex items-center justify-between mb-8 h-10 border-b border-zinc-100 pb-4">
          <h1 className={`text-sm font-mono font-bold tracking-wider text-zinc-900 uppercase ${!isOpen ? "lg:hidden" : "block"}`}>
            Control Panel
          </h1>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors hidden lg:block"
          >
            <ChevronLeft className={`w-4 h-4 transform transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigasi Menu */}
        <nav className="flex flex-col gap-1">
          <span className={`text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2 ${!isOpen ? "lg:hidden" : "block"}`}>
            Main Menu
          </span>
          
          <button 
            onClick={() => handleNavClick("overview")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide transition-all text-left ${activeTab === "overview" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className={!isOpen ? "lg:hidden" : "block"}>OVERVIEW</span>
          </button>

          <button 
            onClick={() => handleNavClick("kelola-posts")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide transition-all text-left ${activeTab === "kelola-posts" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"}`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className={!isOpen ? "lg:hidden" : "block"}>KELOLA POSTS</span>
          </button>

          <button 
            onClick={() => handleNavClick("kelola-projects")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide transition-all text-left ${activeTab === "kelola-projects" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"}`}
          >
            <FolderGit2 className="w-4 h-4 shrink-0" />
            <span className={!isOpen ? "lg:hidden" : "block"}>KELOLA PROJECTS</span>
          </button>

          <div className="my-4 border-t border-zinc-100" />
          
          <span className={`text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2 ${!isOpen ? "lg:hidden" : "block"}`}>
            Fast Actions
          </span>

          <Link href="/admin/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 transition-all">
            <PlusCircle className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className={!isOpen ? "lg:hidden" : "block"}>TAMBAH POST</span>
          </Link>

          <Link href="/admin/projects/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 transition-all">
            <FileCode className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className={!isOpen ? "lg:hidden" : "block"}>TAMBAH PROJECT</span>
          </Link>
        </nav>
      </div>

      <button 
        onClick={onLogout} 
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide text-rose-600 hover:bg-rose-50/60 transition-all text-left"
      >
        <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
        <span className={!isOpen ? "lg:hidden" : "block"}>LOGOUT</span>
      </button>
    </aside>
  )
}