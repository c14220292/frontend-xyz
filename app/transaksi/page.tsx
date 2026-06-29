"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { TRANSAKSI, getVariantById, getProductById } from "@/lib/mock-data";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function TransaksiPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = TRANSAKSI.filter((t) => {
    const matchSearch =
      t.nama_pelanggan.toLowerCase().includes(search.toLowerCase()) ||
      t.id_transaksi.toString().includes(search);
    const matchStatus = statusFilter === "all" || t.status_transaksi === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPendapatan = filtered
    .filter((t) => t.status_transaksi === "selesai")
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <AppShell title="Riwayat Transaksi" subtitle="Daftar penjualan dengan detail alokasi batch">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Total Transaksi</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{filtered.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Selesai</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{filtered.filter((t) => t.status_transaksi === "selesai").length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Dibatalkan</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{filtered.filter((t) => t.status_transaksi === "batal").length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Total Pendapatan</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatRupiah(totalPendapatan)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pelanggan atau ID transaksi..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="selesai">Selesai</option>
            <option value="batal">Dibatalkan</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">ID Transaksi</th>
                <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                <th className="text-left px-5 py-3 font-medium">Tanggal</th>
                <th className="text-center px-5 py-3 font-medium">Item</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const isOpen = expanded === t.id_transaksi;
                return (
                  <>
                    <tr key={t.id_transaksi} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpanded(isOpen ? null : t.id_transaksi)}>
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">TRX-{t.id_transaksi}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">{t.nama_pelanggan}</td>
                      <td className="px-5 py-3 text-slate-600">{formatTanggal(t.tgl_transaksi)}</td>
                      <td className="px-5 py-3 text-center text-slate-600">{t.details.length}</td>
                      <td className="px-5 py-3 text-right font-medium text-slate-900">{formatRupiah(t.total)}</td>
                      <td className="px-5 py-3 text-center">
                        <StatusBadge status={t.status_transaksi} />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button className="text-slate-400 hover:text-slate-700">
                          <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="text-xs font-medium text-slate-500 mb-2">Detail item & alokasi batch FIFO:</div>
                          {t.details.length === 0 ? (
                            <div className="text-xs text-slate-400">Tidak ada detail (transaksi dibatalkan).</div>
                          ) : (
                            <div className="space-y-2">
                              {t.details.map((d) => {
                                const v = getVariantById(d.id_varian);
                                const produk = v ? getProductById(v.id_produk) : null;
                                return (
                                  <div key={d.id_detail} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">Batch #{d.id_batch}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-slate-900">{produk?.nama_produk}</div>
                                      <div className="text-slate-500 font-mono">{v?.sku}</div>
                                    </div>
                                    <div className="text-slate-600">{d.qty_beli} × {formatRupiah(v?.harga_jual || 0)}</div>
                                    <div className="font-semibold text-slate-900 w-24 text-right">{formatRupiah(d.subtotal)}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          Menampilkan {filtered.length} dari {TRANSAKSI.length} transaksi
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "selesai" | "pending" | "batal" }) {
  const map = {
    selesai: { label: "Selesai", cls: "bg-emerald-100 text-emerald-700" },
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    batal: { label: "Dibatalkan", cls: "bg-rose-100 text-rose-700" },
  };
  const s = map[status];
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
}
