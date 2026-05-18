import { getPostById } from "@/src/services/api"
import Link from "next/link"

import {
  formatDate,
  calculateReadTime,
} from "@/src/utils/dateAndReadTime"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostDetail({
  params,
}: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const response = await getPostById(id)
  const post = response?.data

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="text-center">
          <h2 className="text-xl font-serif text-zinc-900">
            Article Not Found
          </h2>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 underline"
          >
            Back to Journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-900 antialiased selection:bg-zinc-100">
      
      {/* HEADER - FIXED */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-serif font-medium tracking-tight text-zinc-900">
              <Link href="/">Catatan Programmer</Link>
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
              Stories, Ideas & Perspectives
            </p>
          </div>
        </div>
      </header>

      {/* NAVBAR TOMBOL KEMBALI - Diberi `pt-28` agar tidak tertimbun Header Fixed */}
      <nav className="max-w-3xl w-full mx-auto px-6 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          ← Back to Journal
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-6 pt-6 pb-24">
        <article>
          
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4">
            <span>
              Published {formatDate(post.created_at)}
            </span>
            <span>•</span>
            <span>
              {calculateReadTime(post.content)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight text-zinc-900 leading-tight">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.image && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/70">
              <img
                src={`http://localhost:8000/uploads/${post.image}`}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Divider */}
          <hr className="my-10 border-zinc-100" />

          {/* Content */}
          <div className="prose prose-zinc max-w-none prose-p:text-zinc-700 prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-zinc-900">
            <div className="whitespace-pre-line text-zinc-700 leading-relaxed font-sans text-[15px]">
              {post.content}
            </div>
          </div>
        </article>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-8 text-center text-xs font-sans text-zinc-400">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} The Journal. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}