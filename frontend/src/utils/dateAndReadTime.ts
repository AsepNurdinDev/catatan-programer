// Fungsi untuk memformat tanggal (Contoh: "May 17, 2026")
export function formatDate(dateString: string): string {
  if (!dateString) return "Recent"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Fungsi untuk menghitung estimasi waktu baca berdasarkan jumlah kata
export function calculateReadTime(content: string): string {
  if (!content) return "1 min read"
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)
  return `${readTime} min read`
}