"use client"

import { login } from "@/src/services/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const response = await login(
      email,
      password
    )

    if (response.token) {
      localStorage.setItem(
        "admin_token",
        response.token
      )

      router.push("/admin/dashboard")
    } else {
      setError("Login gagal")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md border p-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  )
}