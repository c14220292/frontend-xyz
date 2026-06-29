"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { VARIANTS, getProductById, getBatchesForVariant } from "@/lib/mock-data";
import { formatRupiah, formatTanggal, daysUntil } from "@/lib/format";

export default function VarianPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = VARIANTS.filter((v) => {
    const produk = getProductById(v.id_produk);
    const matchSearch =
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      produk?.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "restock" && v.status_restock) ||
      (statusFilter === "aman" && !v.status_restock);
    return matchSearch && matchStatus;
  });

  return (
    <AppShell title="Master Varian" subtitle="Varian produk dengan SKU, harga, dan stok">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari SKU atau nama produk..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="aman">Stok Aman</option>
            <option value="restock">Perlu Restock</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Varian
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">SKU</th>
                <th className="text-left px-5 py-3 font-medium">Produk</th>
                <th className="text-left px-5 py-3 font-medium">Spesifikasi</th>
                <th className="text-right px-5 py-3 font-medium">Harga Jual</th>
                <th className="text-right px-5 py-3 font-medium">Stok</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => {
                const produk = getProductById(v.id_produk);
                const status = v.total_stok <= v.safety_stock ? "kritis" : v.total_stok <= v.rop ? "restock" : "aman";
                const isOpen = expanded === v.id_varian;
                const batches = getBatchesForVariant(v.id_varian);
                return (
                  <>
                    <tr key={v.id_varian} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpanded(isOpen ? null : v.id_varian)}>
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">{v.sku}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">{produk?.nama_produk}</td>
                      <td className="px-5 py-3 text-slate-600 text-xs">
                        {v.ukuran} · {v.kemasan}{v.warna !== "-" ? ` · ${v.warna}` : ""}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-900 font-medium">{formatRupiah(v.harga_jual)}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={v.status_restock ? "text-rose-600 font-semibold" : "text-slate-700"}>{v.total_stok}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <StatusBadge status={status} />
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
                          <div className="text-xs font-medium text-slate-500 mb-2">Batch aktif (urut FIFO berdasarkan expired):</div>
                          {batches.length === 0 ? (
                            <div className="text-xs text-slate-400">Tidak ada batch aktif.</div>
                          ) : (
                            <div className="space-y-2">
                              {batches.map((b, i) => {
                                const days = daysUntil(b.expired_date);
                                return (
                                  <div key={b.id_batch} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">FIFO #{i + 1}</span>
                                    <span className="font-mono text-slate-600">Batch #{b.id_batch}</span>
                                    <span className="text-slate-500">Sisa: <b className="text-slate-700">{b.qty_sisa}</b> / {b.qty_awal}</span>
                                    <span className="text-slate-500">Masuk: {formatTanggal(b.tgl_masuk)}</span>
                                    <span className="text-slate-500">Exp: {formatTanggal(b.expired_date)}</span>
                                    <span className={`ml-auto px-2 py-0.5 rounded-full font-medium ${days < 30 ? "bg-rose-100 text-rose-700" : days < 90 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                      {days} hari lagi
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="mt-3 flex gap-4 text-xs text-slate-500">
                            <span>ROP: <b className="text-slate-700">{v.rop}</b></span>
                            <span>Safety Stock: <b className="text-slate-700">{v.safety_stock}</b></span>
                          </div>
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
          Menampilkan {filtered.length} dari {VARIANTS.length} varian
        </div>
      </div>

      {showForm && <VarianFormModal onClose={() => setShowForm(false)} />}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "kritis" | "restock" | "aman" }) {
  const map = {
    kritis: { label: "Kritis", cls: "bg-rose-100 text-rose-700" },
    restock: { label: "Perlu Restock", cls: "bg-amber-100 text-amber-700" },
    aman: { label: "Aman", cls: "bg-emerald-100 text-emerald-700" },
  };
  const s = map[status];
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

function VarianFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Tambah Varian Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Produk Induk</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Pilih produk...</option>
                <option>Lem Rajawali</option>
                <option>Kulit Sintetis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">SKU</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="LEM-RAJ-14KG" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Ukuran</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="14 kg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Kemasan</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Kaleng" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Warna</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="-" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Harga Jual (Rp)</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="185000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Re-Order Point</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Safety Stock</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="5" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">Simpan (Demo)</button>
          </div>
          <p className="text-[11px] text-slate-400 text-center">Demo: data tidak tersimpan (backend belum terhubung)</p>
        </form>
      </div>
    </div>
  );
}
