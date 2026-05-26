"use client";

import React, { useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Plus, X, Calendar, Wallet } from "lucide-react";

interface DonationMutation {
  id: number;
  type: "IN" | "OUT";
  amount: number;
  donor_name?: string;
  project_title?: string;
  notes: string;
  created_at: string;
}

interface AdminDonationsProps {
  mutations: DonationMutation[];
  onAddExpense: (amount: number, notes: string) => void;
}

export default function AdminDonations({ mutations, onAddExpense }: AdminDonationsProps) {
  const [isOpenExpenseModal, setIsOpenExpenseModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNotes, setExpenseNotes] = useState("");

  // Kalkulasi Finansial
  const totalIn = mutations.filter((m) => m.type === "IN").reduce((sum, m) => sum + m.amount, 0);
  const totalOut = mutations.filter((m) => m.type === "OUT").reduce((sum, m) => sum + m.amount, 0);
  const currentBalance = totalIn - totalOut;

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0 || !expenseNotes) return;
    
    onAddExpense(Number(expenseAmount), expenseNotes);
    setExpenseAmount("");
    setExpenseNotes("");
    setIsOpenExpenseModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-lg font-serif font-medium text-zinc-950 tracking-tight">Manajemen Finansial & Donasi</h2>
          <p className="text-xs text-zinc-500">Pantau arus kas masuk dari QRIS Midtrans dan catat pengeluaran operasional server.</p>
        </div>
        <button
          onClick={() => setIsOpenExpenseModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Catat Pengeluaran
        </button>
      </div>

      {/* TIGA KARTU UTAMA FINANSIAL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-950 text-white rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Sisa Saldo Kas</span>
            <Wallet className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-serif font-semibold">Rp {currentBalance.toLocaleString("id-ID")}</p>
          <p className="text-[9px] font-mono text-zinc-500">Ready to spend / disburse</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Total Donasi Masuk</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-serif font-semibold text-emerald-600">Rp {totalIn.toLocaleString("id-ID")}</p>
          <p className="text-[9px] font-mono text-zinc-400">Akumulasi bruto QRIS</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Total Pengeluaran</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-serif font-semibold text-rose-600">Rp {totalOut.toLocaleString("id-ID")}</p>
          <p className="text-[9px] font-mono text-zinc-400">Biaya server & operasional</p>
        </div>
      </div>

      {/* MINI VISUAL BAR CHART (Pure CSS / Tailwind) */}
      <div className="bg-zinc-50 border border-zinc-200/40 p-4 rounded-xl space-y-2">
        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Rasio Penggunaan Dana</span>
        <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden flex">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${totalIn > 0 ? (currentBalance / totalIn) * 100 : 100}%` }}
          />
          <div 
            className="bg-rose-500 h-full transition-all duration-500" 
            style={{ width: `${totalIn > 0 ? (totalOut / totalIn) * 100 : 0}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Sisa Dana ({totalIn > 0 ? Math.round((currentBalance / totalIn) * 100) : 100}%)</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"/> Terpakai ({totalIn > 0 ? Math.round((totalOut / totalIn) * 100) : 0}%)</div>
        </div>
      </div>

      {/* TABEL MUTASI TRANSAKSI */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Jurnal Riwayat Mutasi</h3>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-100 font-mono text-zinc-600 font-bold">{mutations.length} Transaksi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-400 border-b border-zinc-100 font-mono uppercase text-[10px]">
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold">Keterangan / Deskripsi</th>
                <th className="p-4 font-bold">Tipe</th>
                <th className="p-4 font-bold text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mutations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400 font-mono">Belum ada mutasi keuangan yang tercatat.</td>
                </tr>
              ) : (
                mutations.map((mutation) => (
                  <tr key={mutation.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4 font-mono text-zinc-500">
                      {new Date(mutation.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4">
                      {mutation.type === "IN" ? (
                        <div>
                          <p className="font-semibold text-zinc-900">Dukungan dari {mutation.donor_name || "Anonim"}</p>
                          <p className="text-[10px] text-zinc-400">Proyek: {mutation.project_title || "-"}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-zinc-900">{mutation.notes}</p>
                          <p className="text-[10px] text-zinc-400">Pengeluaran Internal Manual</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                        mutation.type === "IN" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}>
                        {mutation.type === "IN" ? "MASUK" : "KELUAR"}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-mono font-semibold ${mutation.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                      {mutation.type === "IN" ? "+" : "-"} Rp {mutation.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL MANUAL INPUT PENGELUARAN */}
      {isOpenExpenseModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitExpense} className="bg-white rounded-2xl max-w-sm w-full border border-zinc-200 p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsOpenExpenseModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Pencatatan Pengeluaran Kas</h3>
              <p className="text-xs text-zinc-500">Uang keluar akan langsung mengurangi kalkulasi total sisa kas dashboard secara realtime.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Nominal Pengeluaran (Rupiah)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 150000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Keperluan / Keterangan</label>
                <textarea
                  required
                  placeholder="Misal: Perpanjang Domain atau Bayar VPS"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 min-h-[70px] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-900 transition-colors shadow-sm"
            >
              Simpan Transaksi Pengeluaran
            </button>
          </form>
        </div>
      )}

    </div>
  );
}