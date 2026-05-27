"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, initiateDonation } from "@/src/services/api";
import {
  FolderGit2,
  Code2,
  ExternalLink,
  Eye,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

declare global {
  interface Window {
    snap: any;
  }
}

export default function PublicProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // State Kontrol Alur Donasi Midtrans
  const [donationGate, setDonationGate] = useState<{
    isOpen: boolean;
    targetUrl: string;
    activeProjectId: number | null;
  }>({
    isOpen: false,
    targetUrl: "",
    activeProjectId: null,
  });
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState(10000);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // State untuk Custom Alert di dalam Modal (Menghindari alert browser)
  const [customAlert, setCustomAlert] = useState<{
    type: "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchPublicProjects() {
      try {
        const data = await getProjects();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Gagal memuat data project untuk publik:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicProjects();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProtectedAction = (id: number, url: string) => {
    if (!url || url === "#") return;
    setCustomAlert({ type: null, message: "" }); // Reset alert setiap modal dibuka
    setDonationGate({ isOpen: true, targetUrl: url, activeProjectId: id });
  };

  const handlePayDonation = async () => {
    if (amount < 1000) {
      setCustomAlert({ type: "error", message: "Minimal donasi adalah Rp 1.000" });
      return;
    }

    if (!donationGate.activeProjectId) return;

    setIsProcessingPay(true);
    setCustomAlert({ type: null, message: "" });
    const res = await initiateDonation(donationGate.activeProjectId, amount, donorName);
    setIsProcessingPay(false);

    if (res && res.snap_token) {
      const destinationUrl = donationGate.targetUrl;
      const currentId = donationGate.activeProjectId;
      setDonationGate({ isOpen: false, targetUrl: "", activeProjectId: null }); // Tutup sementara modal input

      window.snap.pay(res.snap_token, {
        onSuccess: function () {
          // Sukses -> Langsung alihkan ke link tujuan (buka di tab yang sama agar lancar/instan)
          window.location.href = destinationUrl;
        },
        onPending: function () {
          setDonationGate({ isOpen: true, targetUrl: destinationUrl, activeProjectId: currentId });
          setCustomAlert({ type: "info", message: "Menunggu penyelesaian pembayaran QRIS Anda di aplikasi." });
        },
        onError: function () {
          setDonationGate({ isOpen: true, targetUrl: destinationUrl, activeProjectId: currentId });
          setCustomAlert({ type: "error", message: "Pembayaran bermasalah atau gagal diproses." });
        },
        onClose: function () {
          // Sifatnya opsional, jika ditutup berikan opsi bypass lewat tombol gratis yang stand-by di modal
          setDonationGate({ isOpen: true, targetUrl: destinationUrl, activeProjectId: currentId });
          setCustomAlert({ type: "info", message: "Jendela pembayaran ditutup. Anda tetap bisa mengakses file secara gratis melalui tombol di bawah." });
        }
      });
    } else {
      setCustomAlert({ type: "error", message: res.error || "Gagal menghubungi modul pembayaran backend." });
    }
  };

  const handleBypassDonation = () => {
    const url = donationGate.targetUrl;
    setDonationGate({ isOpen: false, targetUrl: "", activeProjectId: null });
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100 flex flex-col justify-between relative">
      
      <div className="w-full flex-grow">
        <Navbar />
        
        <main className="max-w-6xl w-full mx-auto px-6 pt-32 pb-16">
          <div className="mb-12 border-b border-zinc-100 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 tracking-tight">
                Projects & Portofolio
              </h1>
              <p className="text-xs sm:text-sm font-sans text-zinc-500 max-w-xl leading-relaxed">
                Kumpulan sistem informasi, aplikasi web, dan repositori open-source yang dibangun menggunakan arsitektur modern.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-zinc-400 bg-white border border-zinc-200/60 px-3 py-1.5 rounded-full w-fit shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <FolderGit2 className="w-3.5 h-3.5 text-zinc-700" />
              <span>{projects.length} Total Items</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Memuat repositori...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.01)]">
              <Code2 className="w-8 h-8 text-zinc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Belum ada proyek showcase yang dipublikasikan.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentProjects.map((project) => {
                  const projectId = project.id || project.Id
                  const tags = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()) : ["Open Source"]
                  const imageSrc = project.image && project.image.startsWith("http") ? project.image : `${API_URL}/uploads/${project.image}`

                  const downloadZipUrl = project.github_url && project.github_url !== "#" 
                    ? `${project.github_url}/archive/refs/heads/main.zip` 
                    : "#"

                  return (
                    <div 
                      key={projectId} 
                      className="group flex flex-col justify-between overflow-hidden bg-white border border-zinc-200/70 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-300"
                    >
                      <div>
                        <div className="overflow-hidden relative h-44 w-full bg-zinc-50 border-b border-zinc-100">
                          {project.image ? (
                            <img 
                              src={imageSrc} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                              <Code2 className="w-7 h-7 stroke-[1.2]" />
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-100 text-zinc-500 border border-zinc-200/20">
                                {tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-50 text-zinc-400">
                                +{tags.length - 3}
                              </span>
                            )}
                          </div>

                          <h2 className="text-base font-serif font-medium text-zinc-950 leading-snug tracking-tight line-clamp-1">
                            {project.title}
                          </h2>

                          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2 h-9">
                            {project.description}
                          </p>

                          <Link 
                            href={`/project/${project.slug}`}
                            className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-bold font-mono text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            LIHAT DETAIL
                          </Link>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-1 flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleProtectedAction(projectId, project.github_url)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                              project.github_url && project.github_url !== "#"
                                ? "border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-50" 
                                : "border-zinc-100 text-zinc-300 pointer-events-none"
                            }`}
                          >
                            Repository
                          </button>

                          <a
                            href={project.live_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                              project.live_url && project.live_url !== "#"
                                ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm" 
                                : "bg-zinc-100 text-zinc-300 pointer-events-none"
                            }`}
                          >
                            Live Demo
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <button
                          onClick={() => handleProtectedAction(projectId, downloadZipUrl)}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                            project.github_url && project.github_url !== "#"
                              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/60"
                              : "bg-zinc-50 text-zinc-300 pointer-events-none"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download ZIP
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 font-bold rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "border border-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-zinc-100 py-6 text-xs font-sans text-zinc-400 w-full">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} The Journal. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* ================= MODAL INTERFACES INPUT PARAMETER DONASI ================= */}
      {donationGate.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-zinc-200 p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDonationGate({ isOpen: false, targetUrl: "", activeProjectId: null })}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Dukung Pengembang Proyek</h3>
              <p className="text-xs text-zinc-500">Donasi Anda membantu membiayai operasional server dan pengembangan kode bersifat open-source.</p>
            </div>

            {/* CUSTOM UI NOTIFICATION REPLACEMENT FOR BROWSER ALERTS */}
            {customAlert.type && (
              <div className={`p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-200 ${
                customAlert.type === "error" 
                  ? "bg-rose-50 border border-rose-100 text-rose-600" 
                  : "bg-amber-50 border border-amber-100 text-amber-700"
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{customAlert.message}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Nama Donatur (Opsional)</label>
                <input
                  type="text"
                  placeholder="Hamba Allah / Anonim"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Nominal Dukungan (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">Rp</span>
                  <input
                    type="number"
                    min={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 p-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={handlePayDonation}
                disabled={isProcessingPay}
                className="w-full py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-900 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPay ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyiapkan Transaksi...
                  </>
                ) : (
                  "Lanjut Pembayaran via QRIS"
                )}
              </button>
              
              <button
                onClick={handleBypassDonation}
                className="w-full py-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent hover:border-zinc-100 rounded-xl text-xs font-medium transition-all text-center"
              >
                Lewati & Langsung Buka Link (Gratis)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

