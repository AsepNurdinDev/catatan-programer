"use client"

import Link from "next/link"
import DeleteButton from "@/app/components/DeleteButton"

interface AdminPostsProps {
  posts: any[]
  setPosts: React.Dispatch<React.SetStateAction<any[]>> 
}

// PERBAIKAN 1: Berikan nilai default [] pada desctructuring props agar posts.length tidak crash jika props kosong
export default function AdminPosts({ posts = [], setPosts }: AdminPostsProps) {
  return (
    <div className="w-full text-zinc-900 antialiased font-sans">
      {/* Header Halaman Kelola */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-2xl font-serif font-medium text-zinc-900 sm:text-3xl">
            Kelola Posts
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {/* PERBAIKAN 2: Menggunakan posts?.length agar aman dari undefined */}
            Total terbit: {posts?.length || 0} artikel
          </p>
        </div>

        <Link
          href="/admin/create"
          className="inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-black/5"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Post
        </Link>
      </div>

      {/* Daftar Kartu Artikel */}
      <div className="space-y-4">
        {/* PERBAIKAN 3: Memastikan posts ada dan memiliki panjang data sebelum di-render */}
        {posts && posts.length > 0 ? (
          posts.map((post: any, index: number) => (
            <div
              key={post.id || index}
              className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)] hover:border-zinc-300 transition-colors duration-200 flex flex-col justify-between sm:flex-row sm:items-start gap-6"
            >
              <div className="flex-1">
                <h3 className="text-lg font-serif font-medium text-zinc-900 leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-sans line-clamp-2">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start">
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="inline-flex items-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                >
                  Edit
                </Link>

                <DeleteButton 
                  id={post.id} 
                  onDeleteSuccess={() => {
                    setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id))
                  }} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm text-zinc-400">Belum ada postingan yang dibuat.</p>
          </div>
        )}
      </div>
    </div>
  )
}