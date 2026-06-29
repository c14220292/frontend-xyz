"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { BATCH_STOCKS, VARIANTS, SUPPLIERS, getProductById, getVariantById } from "@/lib/mock-data";
import { formatTanggal, daysUntil } from "@/lib/format";

export default function BatchPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = BATCH_STOCKS.filter((b) => {
    const v = getVariantById(b.id_varian);
    const produk = v ? getProductById(v.id_produk) : null;
    return (
      b.id_batch.toString().includes(search) ||
      v?.sku.toLowerCase().includes(search.toLowerCase()) ||
      produk?.nama_produk.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AppShell title="Stok Batch" subtitle="Penerimaan barang per batch dengan pelacakan expired (FIFO)">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari batch, SKU, atau produk..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Terima Barang (Inbound)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Batch ID</th>
                <th className="text-left px-5 py-3 font-medium">Produk / Varian</th>
                <th className="text-left px-5 py-3 font-medium">Supplier</th>
                <th className="text-right px-5 py-3 font-medium">Qty Awal</th>
                <th className="text-right px-5 py-3 font-medium">Qty Sisa</th>
                <th className="text-left px-5 py-3 font-medium">Tgl Masuk</th>
                <th className="text-left px-5 py-3 font-medium">Expired</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const v = getVariantById(b.id_varian);
                const produk = v ? getProductById(v.id_produk) : null;
                const supplier = SUPPLIERS.find((s) => s.id === b.id_supplier);
                const days = daysUntil(b.expired_date);
                const isExpired = days < 0;
                const isLow = b.qty_sisa === 0;
                return (
                  <tr key={b.id_batch} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">#{b.id_batch}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900">{produk?.nama_produk}</div>
                      <div className="text-xs text-slate-500 font-mono">{v?.sku}</div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">{supplier?.nama || b.id_supplier}</td>
                    <td className="px-5 py-3 text-right text-slate-700">{b.qty_awal}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={isLow ? "text-slate-400" : "font-medium text-slate-900"}>{b.qty_sisa}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">{formatTanggal(b.tgl_masuk)}</td>
                    <td className="px-5 py-3 text-xs text-slate-600">{formatTanggal(b.expired_date)}</td>
                    <td className="px-5 py-3 text-center">
                      {isLow ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Habis</span>
                      ) : isExpired ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">Expired</span>
                      ) : days < 30 ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">{days} hari</span>
                      ) : days < 90 ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{days} hari</span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Aman</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          Menampilkan {filtered.length} dari {BATCH_STOCKS.length} batch
        </div>
      </div>

      {showForm && <InboundFormModal onClose={() => setShowForm(false)} />}
    </AppShell>
  );
}

function InboundFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Terima Barang (Inbound)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Varian Produk</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>Pilih varian...</option>
              {VARIANTS.map((v) => {
                const p = getProductById(v.id_produk);
                return <option key={v.id_varian}>{p?.nama_produk} — {v.sku}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Supplier</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>Pilih supplier...</option>
              {SUPPLIERS.map((s) => <option key={s.id}>{s.nama}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Qty Masuk</label>
              <input type="number" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Tanggal Masuk</label>
              <input type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Expired Date</label>
              <input type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
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
