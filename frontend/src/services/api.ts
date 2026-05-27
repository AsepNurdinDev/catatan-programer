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
    return responseData.data || responseData || []
  } catch (error) {
    console.error("Gagal melakukan fetch data di getPosts:", error)
    return []
  }
}

// 3. Menambahkan Artikel Baru (Halaman Admin)
export async function createPost(data: { title: string; content: string; image: File }) {
  const baseUrl = getBaseUrl() // Menggunakan base url dinamis
  const token = localStorage.getItem("admin_token")
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
  const token = localStorage.getItem("admin_token")
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
  const token = localStorage.getItem("admin_token")

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

// ======================== MANAGEMENT PROJECTS (BARU & LENGKAP) ========================

// 8. [READ ALL] Mengambil Semua Project (Public & Admin)
export const getProjects = async (search: string = "", category: string = "") => {
  const baseUrl = getBaseUrl()
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (category) params.append("category", category)

    const res = await fetch(`${baseUrl}/projects?${params.toString()}`, {
      cache: "no-store",
    })

    if (!res.ok) return []

    const responseData = await res.json()
    return responseData.data || responseData || []
  } catch (error) {
    console.error("Gagal memuat data di getProjects:", error)
    return []
  }
}

// 9. [READ SINGLE] Mengambil Detail Satu Project Berdasarkan ID
export async function getProjectById(id: string | number) {
  const baseUrl = getBaseUrl()
  try {
    const res = await fetch(`${baseUrl}/projects/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    
    const responseData = await res.json()
    return responseData.data || responseData || null
  } catch (error) {
    console.error(`Gagal memuat detail project ID ${id}:`, error)
    return null
  }
}

// 10. [CREATE] Mengirim Project Baru ke Backend (Admin Only)
export async function createProject(formData: FormData) {
  const baseUrl = getBaseUrl()
  const token = localStorage.getItem("admin_token")

  const res = await fetch(`${baseUrl}/admin/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Menggunakan FormData karena menyertakan file gambar
  })

  if (!res.ok) {
    throw new Error(`Gagal menyimpan project, status HTTP: ${res.status}`)
  }

  return res.json()
}

// 11. [UPDATE] Mengubah Data Proyek (Admin Only)
export async function updateProject(id: string | number, formData: FormData) {
  const baseUrl = getBaseUrl()
  const token = localStorage.getItem("admin_token")

  const res = await fetch(`${baseUrl}/admin/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Gagal memperbarui project, status HTTP: ${res.status}`)
  }

  return res.json()
}

// 12. [DELETE] Menghapus Project dari Database (Admin Only)
export async function deleteProject(id: string | number) {
  const baseUrl = getBaseUrl()
  const token = localStorage.getItem("admin_token")

  const res = await fetch(`${baseUrl}/admin/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Gagal menghapus project, status HTTP: ${res.status}`)
  }

  return res.json()
}

// 1. Fungsi memicu pembuatan transaksi ke backend Go
export async function initiateDonation(
  projectId: number,
  amount: number,
  donorName: string
) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        amount: amount,
        donor_name: donorName,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Gagal menginisiasi donasi:", error)
    return { error: "Terjadi kesalahan koneksi" }
  }
}

// 2. Fungsi mengambil data statistik transparansi untuk halaman user
export async function getDonationStats() {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/donations/stats`
    )

    return await response.json()
  } catch (error) {
    console.error("Gagal mengambil data statistik donasi:", error)

    return {
      total_donation: 0,
      recent_donors: [],
    }
  }
}

// Jalur penarikan semua mutasi finansial (Uang Masuk & Keluar)
export async function getDonations() {
  const baseUrl = getBaseUrl();
  const token = localStorage.getItem("admin_token");

  // Tambahan: early return kalau belum login
  if (!token) {
    return { data: [], total_earnings: 0, total_used: 0, balance: 0 };
  }

  const res = await fetch(`${baseUrl}/admin/donations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    console.error(`Error fetching donations: status ${res.status}`);
    return { data: [], total_earnings: 0, total_used: 0, balance: 0 }; // FIX: return object, bukan []
  }

  return res.json();
}

// Jalur pengiriman pencatatan dana keluar ke database backend
export async function createExpense(amount: number, notes: string, category: string) {
  const baseUrl = getBaseUrl(); // 🛠️ PERBAIKAN UTAMA: Menggunakan fungsi pendeteksi URL dinamis
  const token = localStorage.getItem("admin_token");
  
  const res = await fetch(`${baseUrl}/admin/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount, notes, category })
  });

  if (!res.ok) {
    throw new Error(`Error creating expense: status ${res.status}`);
  }

  return res.json();
}