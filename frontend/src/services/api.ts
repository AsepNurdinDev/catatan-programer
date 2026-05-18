// 1. Fungsi pembantu untuk mendeteksi base URL secara dinamis (Docker-friendly)
const getBaseUrl = () => {
  const isServer = typeof window === "undefined"
  return isServer
    ? (process.env.API_URL_SERVER || "http://backend:8000")
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
}

// 2. Mengambil Semua Artikel (Halaman Depan User)
export const getPosts = async (search: string = "") => {
  const baseUrl = getBaseUrl()
  try {
    // 🔴 PERBAIKAN: Menghilangkan '/api' karena rute asli Golang Anda kemungkinan besar langsung '/posts'
    const res = await fetch(`${baseUrl}/posts?search=${search}`, { 
      cache: "no-store" 
    })
    
    if (!res.ok) return []
    
    const responseData = await res.json()
    // KORREKSI CADANGAN: Jika backend membungkus datanya dalam object data (cth: { data: [...] })
    return responseData.data || responseData || []
  } catch (error) {
    console.error("Gagal melakukan fetch data di getPosts:", error)
    return []
  }
}

// 3. Menambahkan Artikel Baru (Halaman Admin)
export async function createPost(data: { title: string; content: string; image: File }) {
  const baseUrl = getBaseUrl() // Menggunakan base url dinamis
  const token = localStorage.getItem("admin.token")
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("content", data.content)
  formData.append("image", data.image)

  const res = await fetch(`${baseUrl}/admin/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return res.json()
}

// 4. Mengambil Detail Artikel Berdasarkan ID
export async function getPostById(id: string) {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/posts/${id}`, {
    cache: "no-store",
  })
  return res.json()
}

// 5. Mengubah Artikel
export async function updatePost(id: string, data: { title: string; content: string; image?: File }) {
  const baseUrl = getBaseUrl()
  const token = localStorage.getItem("admin.token")
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("content", data.content)

  if (data.image) {
    formData.append("image", data.image)
  }

  try {
    const res = await fetch(`${baseUrl}/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error("Error di updatePost service:", error)
    throw error
  }
}

// 6. Menghapus Artikel
export async function deletePost(id: string) {
  const baseUrl = getBaseUrl()
  const token = localStorage.getItem("admin.token")

  const res = await fetch(`${baseUrl}/admin/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

// 7. Login Admin
export async function login(email: string, password: string) {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}