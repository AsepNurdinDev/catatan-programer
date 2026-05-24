"use client";

import React, { useState } from "react";
import { 
  Heart, Wallet, ArrowUpRight, ArrowDownRight, 
  Coins, Receipt, Info, Target, Users, Gift 
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

// 1. DATA RINGKASAN FINANSIAL SOSIAL
const financialSummary = {
  totalReceived: 4750000, // Total sedekah masuk
  totalUsed: 3100000,     // Total yang sudah disalurkan
  currentBalance: 1650000, // Sisa saldo kas sosial
  targetAmount: 10000000,  // Target penggalangan periode ini
};

// 2. DATA DISTRIBUSI PENYALURAN (CHART GABUNGAN)
const allocationData = [
  { category: "Bantuan Fakir Miskin & Dhuafa", amount: 1500000, percentage: 48, color: "bg-zinc-950" },
  { category: "Beasiswa & Biaya Sekolah", amount: 1000000, percentage: 32, color: "bg-zinc-600" },
  { category: "Program Berbagi Makanan", amount: 600000, percentage: 20, color: "bg-zinc-350" },
];

// 3. PAPAN APRESIASI DONATUR (ORANG BAIK)
const topDonors = [
  { name: "Hamba Allah", amount: 1000000, date: "24 Mei 2026", message: "Bismillah, semoga berkah dan bermanfaat untuk adek-adek yang sekolah." },
  { name: "Asep & Rekan", amount: 500000, date: "20 Mei 2026", message: "Titipan dari teman-teman coder untuk program berbagi makanan." },
  { name: "Sobat Baik", amount: 300000, date: "15 Mei 2026", message: "Semoga bisa sedikit meringankan beban saudara kita yang kekurangan." },
];

// 4. BUKU KAS TRANSPARANSI (MUTASI MASUK & PENYALURAN KELUAR)
const transactionLogs = [
  { id: 1, date: "24 Mei 2026", desc: "Sedekah Masuk dari Hamba Allah", cat: "Donasi Masuk", amount: 1000000, type: "in" },
  { id: 2, date: "22 Mei 2026", desc: "Penyaluran Paket Sembako & Santunan Tunai Lansia Dhuafa", cat: "Bantuan Fakir Miskin & Dhuafa", amount: 750000, type: "out" },
  { id: 3, date: "20 Mei 2026", desc: "Sedekah Masuk dari Asep & Rekan", cat: "Donasi Masuk", amount: 500000, type: "in" },
  { id: 4, date: "18 Mei 2026", desc: "Pembayaran Tunggakan SPP & Buku 2 Anak Yatim Piatu", cat: "Beasiswa & Biaya Sekolah", amount: 600000, type: "out" },
  { id: 5, date: "15 Mei 2026", desc: "Sedekah Masuk dari Sobat Baik", cat: "Donasi Masuk", amount: 300000, type: "in" },
  { id: 6, date: "12 Mei 2026", desc: "Aksi Jumat Berkah: Distribusi 60 Kotak Makanan Siap Saji", cat: "Program Berbagi Makanan", amount: 600000, type: "out" },
  { id: 7, date: "08 Mei 2026", desc: "Pembelian Perlengkapan Seragam Sekolah Anak Jalanan", cat: "Beasiswa & Biaya Sekolah", amount: 400000, type: "out" },
  { id: 8, date: "02 Mei 2026", desc: "Santunan Sembako Darurat Korban Kebakaran Pemukiman", cat: "Bantuan Fakir Miskin & Dhuafa", amount: 750000, type: "out" },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function DonationPage() {
  const [filterType, setFilterType] = useState<"all" | "in" | "out">("all");

  const filteredTransactions = transactionLogs.filter(log => {
    if (filterType === "all") return true;
    return log.type === filterType;
  });

  const targetPercentage = Math.min(
    Math.round((financialSummary.totalReceived / financialSummary.targetAmount) * 100),
    100
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 text-zinc-800 antialiased selection:bg-zinc-100">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-40 sm:pt-32 pb-20">
        
        {/* Title Section */}
        <div className="mb-14 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl font-serif font-semibold text-zinc-950 tracking-tight sm:text-4xl">
            Berbagi Kebaikan & Transparansi
          </h1>
          <p className="mt-2 text-sm font-sans text-zinc-800 max-w-2xl leading-relaxed">
            Dari kita untuk mereka. Halaman ini adalah wadah pertanggungjawaban terbuka atas amanah donasi sosial yang Anda titipkan guna membantu biaya sekolah, fakir miskin, serta aksi sosial kemanusiaan lainnya.
          </p>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI & TENGAH */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* 3 KARTU INDIKATOR UTAMA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 border border-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold font-sans text-zinc-600">Total Donasi Masuk</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-bold text-zinc-950 tracking-tight">
                  {formatRupiah(financialSummary.totalReceived)}
                </h3>
              </div>

              <div className="bg-white p-6 border border-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold font-sans text-zinc-600">Total Disalurkan</span>
                  <div className="w-7 h-7 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200">
                    <Gift className="w-3.5 h-3.5 text-zinc-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-bold text-zinc-950 tracking-tight">
                  {formatRupiah(financialSummary.totalUsed)}
                </h3>
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold font-sans text-zinc-300">Sisa Kas Amanah sosial</span>
                  <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5 text-zinc-100" />
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-bold text-white tracking-tight">
                  {formatRupiah(financialSummary.currentBalance)}
                </h3>
              </div>
            </div>

            {/* PROGRESS TARGET KEMANUSIAAN */}
            <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-base font-serif font-semibold text-zinc-950">Target Penggalangan Periode Ini</h2>
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
              <div className="flex justify-between text-xs font-mono text-zinc-600 font-medium">
                <span>Terkumpul: {formatRupiah(financialSummary.totalReceived)}</span>
                <span>Target Manfaat: {formatRupiah(financialSummary.targetAmount)}</span>
              </div>
            </div>

            {/* GRAFIK SEKTOR PENYALURAN */}
            <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-zinc-950" />
                <h2 className="text-base font-serif font-semibold text-zinc-950">Pilar Alokasi Penyaluran Bantuan</h2>
              </div>
              <p className="text-xs text-zinc-800 font-sans mb-5 leading-relaxed">
                Grafik pembagian penyaluran dana amal secara riil demi memastikan bantuan merata dan tepat sasaran:
              </p>
              
              <div className="w-full h-4 bg-zinc-100 rounded-full overflow-hidden flex mb-5">
                {allocationData.map((data, idx) => (
                  <div 
                    key={idx} 
                    style={{ width: `${data.percentage}%` }} 
                    className={`${data.color} h-full`}
                    title={`${data.category}: ${data.percentage}%`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {allocationData.map((data, idx) => (
                  <div key={idx} className="flex flex-col p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${data.color}`} />
                      <span className="text-xs font-semibold text-zinc-800 truncate">{data.category}</span>
                    </div>
                    <span className="text-sm font-sans font-bold text-zinc-950">
                      {formatRupiah(data.amount)} <span className="text-[10px] text-zinc-500 font-normal">({data.percentage}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PAPAN ORANG BAIK */}
            <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-zinc-950" />
                <h2 className="text-base font-serif font-semibold text-zinc-950">Apresiasi Teman Kebaikan</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topDonors.map((donor, idx) => (
                  <div key={idx} className="border border-zinc-200 p-4 rounded-xl relative overflow-hidden bg-white hover:border-zinc-300 transition-colors">
                    <div className="text-xs font-mono text-zinc-400 mb-1 flex items-center justify-between">
                      <span>{donor.date}</span>
                      <span className="text-[10px] font-bold text-zinc-950">Orang Baik</span>
                    </div>
                    <h4 className="text-sm font-sans font-bold text-zinc-950 truncate">{donor.name}</h4>
                    <p className="text-xs font-sans font-bold text-zinc-800 mt-1">{formatRupiah(donor.amount)}</p>
                    <p className="text-[11px] font-sans text-zinc-800 italic mt-2 border-t border-zinc-100 pt-2 leading-relaxed">
                      "{donor.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BUKU KAS TRANSPARANSI */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-base font-serif font-semibold text-zinc-950">Laporan Arus Dana & Penyaluran Resmi</h2>
                </div>
                
                <div className="flex p-1 bg-zinc-100 rounded-xl w-fit text-xs font-medium font-sans">
                  <button 
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-950"}`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setFilterType("in")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "in" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-950"}`}
                  >
                    Donasi Masuk
                  </button>
                  <button 
                    onClick={() => setFilterType("out")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "out" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-950"}`}
                  >
                    Penyaluran
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
                      <th className="py-3 px-6">Tanggal</th>
                      <th className="py-3 px-6">Detail Penyaluran / Sumber</th>
                      <th className="py-3 px-6">Sektor Manfaat</th>
                      <th className="py-3 px-6 text-right">Nominal (IDR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs font-sans font-medium text-zinc-800">
                    {filteredTransactions.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/40 transition-colors">
                        <td className="py-4 px-6 text-zinc-500 font-mono whitespace-nowrap">{log.date}</td>
                        <td className="py-4 px-6 text-zinc-950 font-bold max-w-xs sm:max-w-none truncate sm:whitespace-normal">
                          {log.desc}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-zinc-100 text-zinc-700 border border-zinc-200/50">
                            {log.cat}
                          </span>
                        </td>
                        <td className={`py-4 px-6 text-right font-mono font-bold whitespace-nowrap ${log.type === "in" ? "text-emerald-700" : "text-zinc-950"}`}>
                          {log.type === "in" ? "+" : "-"}{formatRupiah(log.amount)}
                        </td>
                      </tr>
                    ))}
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
            <p className="text-xs text-zinc-800 leading-relaxed max-w-xs mx-auto mb-6 font-sans">
              Setiap rupiah yang Anda sisihkan membawa harapan baru untuk biaya sekolah anak yatim, makanan layak bagi lansia telantar, dan keringanan bagi fakir miskin.
            </p>

            <div className="bg-zinc-50 p-4 rounded-xl inline-block border border-zinc-200 mb-5 w-full max-w-[240px] mx-auto">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=QRIS_SOCIAL_CHARITY_DONATION" 
                alt="QRIS Donasi Utama" 
                className="w-44 h-44 object-contain mx-auto mix-blend-multiply p-1 bg-white rounded-md border border-zinc-200"
              />
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 font-bold block mt-2.5">QRIS INFAK & SEDEKAH</span>
            </div>

            <div className="flex items-start gap-2.5 bg-zinc-50/80 border border-zinc-200 p-4 rounded-xl text-left">
              <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-800 leading-normal font-sans">
                <span className="font-bold block text-zinc-950 mb-0.5">Amanah penuh</span>
                Laporan dokumentasi foto penyaluran di lapangan akan diperbarui berkala agar seluruh aliran dana tetap akuntabel.
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-200 py-8 text-center text-xs font-sans text-zinc-500 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Catatan Programmer. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}