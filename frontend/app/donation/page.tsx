"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Wallet, ArrowUpRight, ArrowDownRight, 
  Coins, Receipt, Info, Target, Users, Gift, Tag 
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { getPublicLedger } from "@/src/services/api";
interface DonationMutation {
  id: number;
  type: "IN" | "OUT";
  amount: number;
  donor_name?: string;
  project_title?: string;
  notes: string;
  category?: string;
  created_at: string;
}

const TARGET_AMOUNT = 10000000; // Target penggalangan periode ini

const EXPENSE_CATEGORIES = [
  { value: "vps-hosting", label: "VPS & Hosting Server" },
  { value: "domain", label: "Perpanjangan Domain" },
  { value: "api-service", label: "Layanan API & Pihak Ketiga" },
  { value: "marketing", label: "Promosi & Iklan" },
  { value: "operational", label: "Operasional & Kopi Dev" },
  { value: "other", label: "Kebutuhan Lainnya" }
];

export default function DonationPage() {
  const [mounted, setMounted] = useState(false);
  const [mutations, setMutations] = useState<DonationMutation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "in" | "out">("all");

  useEffect(() => {
    setMounted(true);
    const fetchPublicLedger = async () => {
      try {
        const response = await getPublicLedger();
        // Menyesuaikan format data pembungkus dari backend
        if (response && Array.isArray(response.data)) {
          setMutations(response.data);
        } else if (Array.isArray(response)) {
          setMutations(response);
        }
      } catch (error) {
        console.error("Gagal memuat buku kas publik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicLedger();
  }, []);

  // Kalkulasi Finansial Riil dari Database
  const totalReceived = mutations.filter((m) => m.type === "IN").reduce((sum, m) => sum + m.amount, 0);
  const totalUsed = mutations.filter((m) => m.type === "OUT").reduce((sum, m) => sum + m.amount, 0);
  const currentBalance = totalReceived - totalUsed;

  // Filter transaksi
  const filteredTransactions = mutations.filter((log) => {
    if (filterType === "all") return true;
    return filterType === "in" ? log.type === "IN" : log.type === "OUT";
  });

  // Ambil daftar donatur teratas (Tipe IN)
  const topDonors = mutations
    .filter((m) => m.type === "IN")
    .slice(0, 3);

  // Hitung distribusi alokasi berdasarkan kategori pengeluaran secara dinamis
  const dynamicAllocations = EXPENSE_CATEGORIES.map((cat, idx) => {
    const amount = mutations
      .filter((m) => m.type === "OUT" && m.category === cat.value)
      .reduce((sum, m) => sum + m.amount, 0);
    
    const percentage = totalUsed > 0 ? Math.round((amount / totalUsed) * 100) : 0;
    
    const colors = ["bg-zinc-950", "bg-zinc-700", "bg-zinc-500", "bg-zinc-400", "bg-zinc-350", "bg-zinc-200"];
    
    return {
      category: cat.label,
      amount,
      percentage,
      color: colors[idx % colors.length]
    };
  }).filter(alloc => alloc.amount > 0); // Hanya tampilkan kategori yang ada pengeluarannya

  const targetPercentage = Math.min(Math.round((totalReceived / TARGET_AMOUNT) * 100), 100);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-40 sm:pt-32 pb-20">
        
        {/* Title Section */}
        <div className="mb-14 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl font-serif font-semibold text-zinc-950 tracking-tight sm:text-4xl">
            Berbagi Kebaikan & Transparansi
          </h1>
          <p className="mt-2 text-sm font-sans text-zinc-600 max-w-2xl leading-relaxed">
            Dari kita untuk mereka. Halaman ini adalah wadah pertanggungjawaban terbuka atas amanah donasi sosial yang Anda titipkan guna memelihara server, portofolio, serta aksi operasional digital lainnya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI & TENGAH */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* 3 KARTU INDIKATOR UTAMA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 border border-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-500">Total Donasi Masuk</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                  {loading ? "Rp ..." : formatRupiah(totalReceived)}
                </h3>
              </div>

              <div className="bg-white p-6 border border-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-500">Total Alokasi Keluar</span>
                  <div className="w-7 h-7 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200">
                    <Gift className="w-3.5 h-3.5 text-zinc-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                  {loading ? "Rp ..." : formatRupiah(totalUsed)}
                </h3>
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-300">Sisa Kas Amanah</span>
                  <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5 text-zinc-100" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {loading ? "Rp ..." : formatRupiah(currentBalance)}
                </h3>
              </div>
            </div>

            {/* PROGRESS TARGET KEMANUSIAAN */}
            <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-base font-serif font-semibold text-zinc-950">Target Pendanaan Ekosistem</h2>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                  {targetPercentage}% Terkumpul
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="bg-zinc-950 h-full rounded-full transition-all duration-500"
                  style={{ width: `${targetPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-500 font-medium">
                <span>Terkumpul: {formatRupiah(totalReceived)}</span>
                <span>Target: {formatRupiah(TARGET_AMOUNT)}</span>
              </div>
            </div>

            {/* GRAFIK SEKTOR PENYALURAN DINAMIS */}
            {dynamicAllocations.length > 0 && (
              <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-base font-serif font-semibold text-zinc-950">Pilar Realisasi Anggaran Terpakai</h2>
                </div>
                <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                  Bagan pembagian alokasi pengeluaran kas ditarik langsung secara transparan dari data admin:
                </p>
                
                <div className="w-full h-4 bg-zinc-100 rounded-full overflow-hidden flex mb-5">
                  {dynamicAllocations.map((data, idx) => (
                    <div 
                      key={idx} 
                      style={{ width: `${data.percentage}%` }} 
                      className={`${data.color} h-full`}
                      title={`${data.category}: ${data.percentage}%`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dynamicAllocations.map((data, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${data.color}`} />
                        <span className="text-xs font-semibold text-zinc-700 truncate">{data.category}</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-950">
                        {formatRupiah(data.amount)} <span className="text-[10px] text-zinc-400 font-normal">({data.percentage}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAPAN APRESIASI DONATUR DARI DB */}
            <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-zinc-950" />
                <h2 className="text-base font-serif font-semibold text-zinc-950">Apresiasi Orang Baik Terbaru</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading ? (
                  <p className="text-xs text-zinc-400 font-mono">Memuat kontributor...</p>
                ) : topDonors.length === 0 ? (
                  <p className="text-xs text-zinc-400 col-span-3 py-4">Belum ada riwayat donasi masuk.</p>
                ) : (
                  topDonors.map((donor, idx) => (
                    <div key={donor.id || idx} className="border border-zinc-200 p-4 rounded-xl bg-white hover:border-zinc-300 transition-colors">
                      <div className="text-xs font-mono text-zinc-400 mb-1 flex items-center justify-between">
                        <span>
                          {mounted ? new Date(donor.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "..."}
                        </span>
                        <span className="text-[9px] font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">Verified</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950 truncate">{donor.donor_name || "Hamba Allah"}</h4>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">{formatRupiah(donor.amount)}</p>
                      <p className="text-[11px] text-zinc-500 italic mt-2 border-t border-zinc-100 pt-2 line-clamp-2">
                        "{donor.notes || "Bismillah, berkah."}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BUKU KAS TRANSPARANSI LIVE */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-base font-serif font-semibold text-zinc-950">Laporan Jurnal Arus Kas Resmi</h2>
                </div>
                
                <div className="flex p-1 bg-zinc-100 rounded-xl w-fit text-xs font-medium">
                  <button 
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"}`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setFilterType("in")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "in" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"}`}
                  >
                    Masuk
                  </button>
                  <button 
                    onClick={() => setFilterType("out")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "out" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"}`}
                  >
                    Pengeluaran
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
                      <th className="py-3 px-6">Tanggal</th>
                      <th className="py-3 px-6">Deskripsi Ledger</th>
                      <th className="py-3 px-6">Kategori/Modul</th>
                      <th className="py-3 px-6 text-right">Nominal (IDR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-400 font-mono">Memuat berkas ledger digital...</td>
                      </tr>
                    ) : filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-400 font-mono">Tidak ada mutasi yang sesuai filter.</td>
                      </tr>
                    ) : (
                      filteredTransactions.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-zinc-50/40 transition-colors">
                          <td className="py-4 px-6 text-zinc-400 font-mono whitespace-nowrap">
                            {mounted ? new Date(log.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "..."}
                          </td>
                          <td className="py-4 px-6 text-zinc-900 font-semibold max-w-xs sm:max-w-none truncate sm:whitespace-normal">
                            {log.type === "IN" ? `Donasi Dukungan via QRIS` : log.notes}
                          </td>
                          <td className="py-4 px-6">
                            {log.type === "IN" ? (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                                MASUK
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono">
                                <Tag className="w-2.5 h-2.5 text-zinc-400" />
                                {EXPENSE_CATEGORIES.find(c => c.value === log.category)?.label || "OPERASIONAL"}
                              </span>
                            )}
                          </td>
                          <td className={`py-4 px-6 text-right font-mono font-bold whitespace-nowrap ${log.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                            {log.type === "IN" ? "+" : "-"}{formatRupiah(log.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN (WIDGET QRIS UTAMA) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-36 text-center">
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            </div>

            <h3 className="text-lg font-serif font-semibold text-zinc-950 mb-1.5">Ulurkan Tangan Anda</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto mb-6">
              Dukungan terkecil Anda membantu operasional server mandiri, biaya hosting, dan riset pengembangan ekosistem open-source ini tetap hidup.
            </p>

            <div className="bg-zinc-50 p-4 rounded-xl inline-block border border-zinc-200 mb-5 w-full max-w-[240px] mx-auto">
              {/* @TODO: Di sini nanti kamu bisa buat modul input nominal & generate QRIS Midtrans API dinamis */}
              <img 
                src="/images/qris.jpg" 
                alt="QRIS Donasi Utama" 
                className="w-44 h-44 object-contain mx-auto mix-blend-multiply p-1 bg-white rounded-md border border-zinc-200"
              />
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 font-bold block mt-2.5">QRIS INFAK OERASIONAL</span>
            </div>

            <div className="flex items-start gap-2.5 bg-zinc-50/80 border border-zinc-200 p-4 rounded-xl text-left">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-600 leading-normal">
                <span className="font-bold block text-zinc-950 mb-0.5">Amanah penuh</span>
                Setiap mutasi pengeluaran kas diverifikasi langsung oleh developer secara transparan pada platform.
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-200 py-8 text-center text-xs text-zinc-400 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}