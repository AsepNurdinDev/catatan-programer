"use client"

import Link from "next/link"
import SearchInput from "@/app/components/SearchInput"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* LOGO — sama persis */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-serif font-medium tracking-tight text-zinc-900">
            <Link href="/">Catatan Programmer</Link>
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
            Stories, Ideas & Perspectives
          </p>
        </div>

        {/* MENU DESKTOP — tambahan baru */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            Blog
          </Link>
          <Link
            href="/projects"
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            About
          </Link>
          <Link
            href="/donate"
            className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Donasi
          </Link>
        </nav>

        {/* KANAN — search tetap sama, tambah hamburger mobile */}
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2">
          {/* Search tetap sama persis */}
          <SearchInput />

          {/* Hamburger — hanya muncul di mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
          >
            {isOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-zinc-100 px-6 py-3 flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            Blog
          </Link>
          <Link
            href="/projects"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            Projects
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            About
          </Link>
          <Link
            href="/donate"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Donasi
          </Link>
        </div>
      )}
    </header>
  )
}