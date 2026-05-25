"use client"

import Link from "next/link"
import SearchInput from "@/app/components/SearchInput"
import { Suspense, useState } from "react"
import { usePathname } from "next/navigation" // Tambahan untuk deteksi halaman aktif

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Helper untuk styling menu agar tidak duplikasi kode
  const navItems = [
    { name: "Blog", href: "/" },
    { name: "Projects", href: "/project" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-md border-b border-zinc-100/80 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* LOGO — Lebih Clean & Modern */}
        <div className="text-center sm:text-left group">
          <Link href="/" className="block">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600">
              Catatan Programmer
            </h1>
            <p className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase mt-0.5">
              Stories, Ideas & Perspectives
            </p>
          </Link>
        </div>

        {/* MENU DESKTOP — Hover Efek Garis Bawah Minimalis */}
        <nav className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-colors duration-200 group ${
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {item.name}
                {/* Efek Garis Bawah saat di-hover / aktif */}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 rounded-full transition-transform duration-300 origin-left ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            )
          })}
          
          {/* Menu Donasi Spesial — Lebih Kalem tanpa background kaku */}
          <Link
            href="/donation"
            className={`relative py-2 text-sm font-medium transition-colors duration-200 group flex items-center gap-1.5 ${
              pathname === "/donation" ? "text-emerald-600" : "text-zinc-500 hover:text-emerald-600"
            }`}
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Donasi
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
              pathname === "/donation" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
          </Link>
        </nav>

        {/* KANAN — Search & Hamburger */}
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-3">
          <Suspense fallback={null}>
            <SearchInput />
          </Suspense>

          {/* Hamburger Button Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-zinc-900 transition-all duration-300 relative"
            aria-label="Toggle Menu"
          >
            <div className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
              {isOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN — Dibuat senada dengan gaya minimalis */}
      <div
        className={`sm:hidden bg-white px-6 overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-0.5 ${
          isOpen ? "max-h-64 pb-4 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`py-2.5 text-sm font-medium transition-colors ${
              pathname === item.href ? "text-zinc-950 font-semibold" : "text-zinc-500"
            }`}
          >
            {item.name}
          </Link>
        ))}
        <Link
          href="/donation"
          onClick={() => setIsOpen(false)}
          className={`py-2.5 text-sm font-medium flex items-center gap-1.5 transition-colors ${
            pathname === "/donation" ? "text-emerald-600 font-semibold" : "text-zinc-500 text-emerald-500"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
          Donasi
        </Link>
      </div>
    </header>
  )
}