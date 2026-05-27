"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPosts, getProjects, getDonations, createExpense } from "@/src/services/api";
import { BookOpen, FolderGit2, ArrowUpRight, Menu, Activity, Calendar, DollarSign } from "lucide-react";
import AdminPosts from "@/app/admin/posts/page";
import AdminProjects from "./AdminProjects";
import AdminDonations from "./AdminDonations";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [mutations, setMutations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "kelola-posts" | "kelola-projects" | "kelola-donasi">("overview");
  const [expenseStatus, setExpenseStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsResponse, projectsResponse, donationsResponse] = await Promise.all([
        getPosts(),
        getProjects(),
        getDonations()
      ]);

      if (Array.isArray(postsResponse)) setPosts(postsResponse);
      if (Array.isArray(projectsResponse)) setProjects(projectsResponse);

      if (donationsResponse && Array.isArray(donationsResponse.data)) {
        setMutations(donationsResponse.data);
      } else if (Array.isArray(donationsResponse)) {
        setMutations(donationsResponse);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.push("/login");
  }

  const handleAddExpense = async (amount: number, notes: string, category: string) => {
    try {
      await createExpense(amount, notes, category);
      await fetchDashboardData();
      setExpenseStatus("success");
      setTimeout(() => setExpenseStatus("idle"), 3000);
    } catch (error) {
      console.error("Gagal mencatat pengeluaran:", error);
      setExpenseStatus("error");
      setTimeout(() => setExpenseStatus("idle"), 3000);
    }
  };

  // FIX: pakai Number() agar tidak NaN kalau tipe data campur int64/float64
  const totalIn = mutations.filter(m => m.type === "IN").reduce((sum, m) => sum + Number(m.amount), 0);
  const totalOut = mutations.filter(m => m.type === "OUT").reduce((sum, m) => sum + Number(m.amount), 0);
  const currentBalance = totalIn - totalOut;

  const totalItems = posts.length + projects.length;
  const postPercentage = totalItems > 0 ? Math.round((posts.length / totalItems) * 100) : 0;
  const projectPercentage = totalItems > 0 ? Math.round((projects.length / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 antialiased flex font-sans relative overflow-x-hidden">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/10 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}`}>

        <header className="h-14 border-b border-zinc-200/60 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold hidden sm:inline-block">
              Workspace / {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-900">Administrator</p>
              <p className="text-[10px] font-mono text-zinc-400">asep@server</p>
            </div>
            <div className="w-8 h-8 bg-zinc-950 rounded-xl flex items-center justify-center text-xs text-white font-mono font-bold shadow-sm">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-5xl w-full mx-auto">

          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-serif font-medium text-zinc-950 tracking-tight">Selamat Datang Kembali</h2>
                  <p className="text-xs text-zinc-500">Aktivitas dan data platform portofolio Anda terpantau aman.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 bg-zinc-50 border border-zinc-200/40 px-3 py-2 rounded-xl w-fit">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    {mounted
                      ? new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                      : "Memuat tanggal..."}
                  </span>
                </div>
              </div>

              {/* CARD RINGKASAN */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Artikel Terbit</span>
                      <p className="text-3xl font-serif font-medium text-zinc-950">{loading ? "..." : posts.length}</p>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-mono">{postPercentage}% kontribusi konten</span>
                    <button onClick={() => setActiveTab("kelola-posts")} className="text-zinc-950 font-medium flex items-center gap-0.5 hover:underline">
                      Detail <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Project Showcase</span>
                      <p className="text-3xl font-serif font-medium text-zinc-950">{loading ? "..." : projects.length}</p>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-700">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-mono">{projectPercentage}% kontribusi sistem</span>
                    <button onClick={() => setActiveTab("kelola-projects")} className="text-zinc-950 font-medium flex items-center gap-0.5 hover:underline">
                      Detail <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Kas Operasional</span>
                      {/* FIX: warna dinamis kalau saldo negatif */}
                      <p className={`text-xl font-serif font-semibold mt-1 ${currentBalance < 0 ? "text-rose-600" : "text-zinc-950"}`}>
                        {loading ? "..." : `Rp ${currentBalance.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-950">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className={`font-medium font-mono ${currentBalance < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                      {currentBalance < 0 ? "Defisit" : "Net Balance"}
                    </span>
                    <button onClick={() => setActiveTab("kelola-donasi")} className="text-zinc-950 font-medium flex items-center gap-0.5 hover:underline">
                      Kelola Kas <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LOGS AKTIVITAS TERAKHIR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-zinc-500" /> Recent Projects Log
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono font-semibold">{projects.length} entries</span>
                  </div>
                  <div className="divide-y divide-zinc-50 max-h-60 overflow-y-auto pr-1">
                    {loading ? (
                      <p className="text-xs text-zinc-400 py-4 font-mono">Loading telemetry...</p>
                    ) : projects.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-4">Belum ada aktivitas proyek.</p>
                    ) : (
                      projects.slice(0, 4).map((proj: any, index: number) => (
                        <div key={proj.id || index} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <span className="text-xs font-medium text-zinc-800 truncate max-w-[200px]">{proj.title}</span>
                          <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Deploy</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-zinc-500" /> Arus Kas Terakhir
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono font-semibold">{mutations.length} total</span>
                  </div>
                  <div className="divide-y divide-zinc-50 max-h-60 overflow-y-auto pr-1">
                    {loading ? (
                      <p className="text-xs text-zinc-400 py-4 font-mono">Loading data...</p>
                    ) : mutations.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-4">Belum ada riwayat transaksi masuk.</p>
                    ) : (
                      mutations.slice(0, 4).map((mutation: any, idx: number) => (
                        <div key={mutation.id || idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                          <div className="truncate max-w-[150px]">
                            <p className="text-xs font-medium text-zinc-800 truncate">
                              {mutation.type === "IN" ? (mutation.donor_name || "Anonim") : mutation.notes}
                            </p>
                          </div>
                          <span className={`text-[10px] font-mono font-semibold ${mutation.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                            {mutation.type === "IN" ? "+" : "-"} Rp {Number(mutation.amount).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "kelola-posts" && (
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <AdminPosts posts={posts} setPosts={setPosts} />
            </div>
          )}

          {activeTab === "kelola-projects" && (
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <AdminProjects projects={projects} setProjects={setProjects} />
            </div>
          )}

          {activeTab === "kelola-donasi" && (
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">

              {/* FIX: notifikasi status setelah tambah expense */}
              {expenseStatus === "success" && (
                <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl font-medium">
                  ✓ Pengeluaran berhasil dicatat dan saldo diperbarui.
                </div>
              )}
              {expenseStatus === "error" && (
                <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl font-medium">
                  ✗ Gagal mencatat pengeluaran. Coba lagi.
                </div>
              )}

              <AdminDonations mutations={mutations} onAddExpense={handleAddExpense} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}