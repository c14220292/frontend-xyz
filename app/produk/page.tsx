"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { PRODUCTS, VARIANTS, getVariantsForProduct } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/format";

export default function ProdukPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const kategoris = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.kategori)))];

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchKat = kategoriFilter === "all" || p.kategori === kategoriFilter;
    return matchSearch && matchKat;
  });

  return (
    <AppShell title="Master Produk" subtitle="Daftar produk induk toko bahan sepatu">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {kategoris.map((k) => (
              <option key={k} value={k}>{k === "all" ? "Semua Kategori" : k}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Produk
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">ID</th>
                <th className="text-left px-5 py-3 font-medium">Nama Produk</th>
                <th className="text-left px-5 py-3 font-medium">Kategori</th>
                <th className="text-center px-5 py-3 font-medium">Jml Varian</th>
                <th className="text-right px-5 py-3 font-medium">Total Stok</th>
                <th className="text-right px-5 py-3 font-medium">Nilai Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const varianList = getVariantsForProduct(p.id_produk);
                const totalStok = varianList.reduce((s, v) => s + v.total_stok, 0);
                const nilaiStok = varianList.reduce((s, v) => s + v.total_stok * v.harga_jual, 0);
                return (
                  <tr key={p.id_produk} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">P{String(p.id_produk).padStart(3, "0")}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{p.nama_produk}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">{p.kategori}</span>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">{varianList.length}</td>
                    <td className="px-5 py-3 text-right text-slate-700">{totalStok} unit</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">{formatRupiah(nilaiStok)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          Menampilkan {filtered.length} dari {PRODUCTS.length} produk
        </div>
      </div>

      {showForm && <ProdukFormModal onClose={() => setShowForm(false)} />}
    </AppShell>
  );
}

function ProdukFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Tambah Produk Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Nama Produk</label>
            <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="cth: Lem Rajawali" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Kategori</label>
            <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="cth: Lem" />
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
