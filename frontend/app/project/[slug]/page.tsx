"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjects, initiateDonation } from "@/src/services/api";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Download,
  FolderGit2,
  Heart,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    snap: any;
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // State Kontrol Alur Donasi Midtrans
  const [donationGate, setDonationGate] = useState<{
    isOpen: boolean;
    targetUrl: string;
  }>({
    isOpen: false,
    targetUrl: "",
  });
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState(10000); // Default Rp 10.000
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // State untuk Custom Alert di dalam Modal (Menghindari alert browser)
  const [customAlert, setCustomAlert] = useState<{
    type: "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchDetailProject() {
      try {
        const data = await getProjects();
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.slug === params.slug);
          setProject(found || null);
        }
      } catch (error) {
        console.error("Gagal memuat detail project:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      fetchDetailProject();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/30 p-6">
        <p className="text-zinc-500 text-xs font-mono mb-4 uppercase tracking-wider">
          Proyek tidak ditemukan atau telah dihapus.
        </p>
        <button
          onClick={() => router.push("/project")}
          className="text-xs font-mono font-bold uppercase border-b border-zinc-950 pb-0.5 flex items-center gap-2 text-zinc-950 transition-all hover:opacity-70"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Portofolio
        </button>
      </div>
    );
  }

  const tags = project.tech_stack
    ? project.tech_stack.split(",").map((t: string) => t.trim())
    : [];
  const imageSrc =
    project.image && project.image.startsWith("http")
      ? project.image
      : `${API_URL}/uploads/${project.image}`;

  const downloadZipUrl =
    project.github_url && project.github_url !== "#"
      ? `${project.github_url}/archive/refs/heads/main.zip`
      : "#";

  const handleProtectedAction = (url: string) => {
    if (!url || url === "#") return;
    setCustomAlert({ type: null, message: "" }); // Reset alert setiap modal dibuka
    setDonationGate({ isOpen: true, targetUrl: url });
  };

  const handlePayDonation = async () => {
    if (amount < 1000) {
      setCustomAlert({ type: "error", message: "Minimal donasi adalah Rp 1.000" });
      return;
    }

    setIsProcessingPay(true);
    setCustomAlert({ type: null, message: "" });
    const projectId = project.id || project.Id;
    
    const res = await initiateDonation(projectId, amount, donorName);
    setIsProcessingPay(false);

    if (res && res.snap_token) {
      const destinationUrl = donationGate.targetUrl;
      setDonationGate({ isOpen: false, targetUrl: "" }); // Langsung tutup modal internal

      // Panggil widget pop-up Midtrans Snap asli
      window.snap.pay(res.snap_token, {
        onSuccess: function () {
          // Pembayaran sukses -> Langsung eksekusi download / redirect ke repo
          window.location.href = destinationUrl;
        },
        onPending: function () {
          // Buka kembali modal dengan status info pending custom tanpa alert browser
          setDonationGate({ isOpen: true, targetUrl: destinationUrl });
          setCustomAlert({ type: "info", message: "Menunggu penyelesaian pembayaran QRIS Anda di aplikasi Midtrans." });
        },
        onError: function () {
          setDonationGate({ isOpen: true, targetUrl: destinationUrl });
          setCustomAlert({ type: "error", message: "Pembayaran gagal diproses oleh sistem gateway." });
        },
        onClose: function () {
          // Karena sifatnya tidak memaksa (opsional), jika user menutup snap window, 
          // mereka bisa langsung memutuskan lewat tombol lewati di modal utama yang tetap siaga.
          setDonationGate({ isOpen: true, targetUrl: destinationUrl });
          setCustomAlert({ type: "info", message: "Anda menutup jendela pembayaran. Anda tetap bisa mengunduh file secara gratis melalui tombol di bawah." });
        },
      });
    } else {
      setCustomAlert({ type: "error", message: res.error || "Gagal menginisiasi tagihan pembayaran ke backend." });
    }
  };

  const handleBypassDonation = () => {
    const url = donationGate.targetUrl;
    setDonationGate({ isOpen: false, targetUrl: "" });
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-800 font-sans antialiased flex flex-col justify-between">
      <div className="w-full flex-grow">
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-base font-serif font-semibold tracking-tight text-zinc-900">
                <Link href="/">Catatan Programmer</Link>
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                Stories, Ideas & Perspectives
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-5 pt-24 pb-16">
          <nav className="mb-6">
            <Link
              href="/project"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
            >
              ← Project
            </Link>
          </nav>

          <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200/60 shadow-[0_3px_10px_rgba(0,0,0,0.01)] mb-8 flex items-center justify-center p-2 sm:p-4">
            {project.image ? (
              <img
                src={imageSrc}
                alt={project.title}
                className="w-full h-auto max-h-[420px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-zinc-300 bg-zinc-50 rounded-lg">
                <Code2 className="w-8 h-8 stroke-[1.2]" />
              </div>
            )}
          </div>

          <div className="space-y-3.5 border-b border-zinc-100 pb-6">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-zinc-950 text-white uppercase tracking-wider">
                {project.category || "General"}
              </span>
              {tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-100 text-zinc-500 border border-zinc-200/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 tracking-tight leading-snug">
              {project.title}
            </h1>
          </div>

          <div className="py-6 space-y-5 text-zinc-600 text-sm sm:text-[15px] leading-relaxed tracking-normal border-b border-zinc-100">
            <p className="font-normal text-zinc-900 leading-relaxed">
              {project.description}
            </p>

            {project.content && project.content !== project.description && (
              <div className="pt-4 border-t border-zinc-100/80 font-normal text-xs sm:text-sm text-zinc-500 whitespace-pre-line leading-relaxed">
                {project.content}
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200/60 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] grid grid-cols-1 sm:grid-cols-3 gap-2 mt-8">
            <button
              onClick={() => handleProtectedAction(project.github_url)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Repository
            </button>

            <a
              href={project.live_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                project.live_url && project.live_url !== "#"
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm"
                  : "bg-zinc-100 text-zinc-300 pointer-events-none"
              }`}
            >
              Live Preview <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => handleProtectedAction(downloadZipUrl)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download ZIP
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-zinc-100 py-6 text-xs font-sans text-zinc-400 w-full">
        <div className="max-w-2xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
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
              onClick={() => setDonationGate({ isOpen: false, targetUrl: "" })}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Dukung Kreator Proyek</h3>
              <p className="text-xs text-zinc-500">Donasi sukarela untuk membantu pengelolaan operasional server portofolio ini.</p>
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
                Lewati & Langsung Ambil File (Gratis)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}