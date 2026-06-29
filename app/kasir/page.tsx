"use client";
import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import { VARIANTS, getProductById, getBatchesForVariant } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/format";

interface CartItem {
  id_varian: number;
  qty: number;
  // FIFO allocation
  allocations: { id_batch: number; qty: number }[];
}

export default function KasirPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = VARIANTS.filter((v) => {
    const produk = getProductById(v.id_produk);
    return (
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      produk?.nama_produk.toLowerCase().includes(search.toLowerCase())
    );
  });

  function allocateFIFO(id_varian: number, qty: number) {
    const batches = getBatchesForVariant(id_varian);
    const allocations: { id_batch: number; qty: number }[] = [];
    let remaining = qty;
    for (const b of batches) {
      if (remaining <= 0) break;
      const take = Math.min(b.qty_sisa, remaining);
      allocations.push({ id_batch: b.id_batch, qty: take });
      remaining -= take;
    }
    return allocations;
  }

  function addToCart(id_varian: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id_varian === id_varian);
      if (existing) {
        const newQty = existing.qty + 1;
        return prev.map((c) => c.id_varian === id_varian ? { ...c, qty: newQty, allocations: allocateFIFO(id_varian, newQty) } : c);
      }
      return [...prev, { id_varian, qty: 1, allocations: allocateFIFO(id_varian, 1) }];
    });
  }

  function updateQty(id_varian: number, delta: number) {
    setCart((prev) => prev.map((c) => {
      if (c.id_varian !== id_varian) return c;
      const newQty = Math.max(1, c.qty + delta);
      return { ...c, qty: newQty, allocations: allocateFIFO(id_varian, newQty) };
    }));
  }

  function removeFromCart(id_varian: number) {
    setCart((prev) => prev.filter((c) => c.id_varian !== id_varian));
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const v = getVariantByIdLocal(item.id_varian);
      return sum + (v ? v.harga_jual * item.qty : 0);
    }, 0);
  }, [cart]);

  function checkout() {
    if (cart.length === 0) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setNamaPelanggan("");
    }, 2500);
  }

  return (
    <AppShell title="Kasir (POS)" subtitle="Transaksi penjualan dengan alokasi batch FIFO otomatis">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk atau SKU..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-220px)] overflow-y-auto">
              {filtered.map((v) => {
                const produk = getProductById(v.id_produk);
                const outOfStock = v.total_stok === 0;
                return (
                  <button
                    key={v.id_varian}
                    onClick={() => !outOfStock && addToCart(v.id_varian)}
                    disabled={outOfStock}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      outOfStock
                        ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="w-full h-20 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-slate-400">{produk?.nama_produk.charAt(0)}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 truncate">{produk?.nama_produk}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{v.sku}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{formatRupiah(v.harga_jual)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${v.status_restock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {v.total_stok} stok
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-20 flex flex-col max-h-[calc(100vh-120px)]">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Keranjang
                <span className="ml-auto text-xs font-normal text-slate-500">{cart.length} item</span>
              </h2>
            </div>

            <div className="px-5 py-3 border-b border-slate-100">
              <input
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                placeholder="Nama pelanggan (opsional)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {cart.length === 0 && (
                <div className="px-5 py-12 text-center text-sm text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
                  </svg>
                  Pilih produk untuk memulai transaksi
                </div>
              )}
              {cart.map((item) => {
                const v = getVariantByIdLocal(item.id_varian);
                const produk = v ? getProductById(v.id_produk) : null;
                if (!v || !produk) return null;
                const subtotal = v.harga_jual * item.qty;
                return (
                  <div key={item.id_varian} className="px-5 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{produk.nama_produk}</div>
                        <div className="text-xs text-slate-500 font-mono">{v.sku}</div>
                        <div className="text-xs text-slate-500">{formatRupiah(v.harga_jual)} / unit</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id_varian)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.206A48.1 48.1 0 0012 5.5c-2.292 0-4.566.07-6.827.206m14.456 0L15.75 4.5" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id_varian, -1)} className="w-7 h-7 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">−</button>
                        <span className="w-10 text-center text-sm font-medium text-slate-900">{item.qty}</span>
                        <button onClick={() => updateQty(item.id_varian, 1)} className="w-7 h-7 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">+</button>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{formatRupiah(subtotal)}</div>
                    </div>
                    {/* FIFO allocation display */}
                    <div className="mt-2 bg-blue-50/50 border border-blue-100 rounded-md p-2">
                      <div className="text-[10px] font-medium text-blue-700 uppercase tracking-wide mb-1">Alokasi FIFO</div>
                      {item.allocations.length === 0 ? (
                        <div className="text-[11px] text-rose-600">Stok tidak mencukupi</div>
                      ) : (
                        <div className="space-y-0.5">
                          {item.allocations.map((a, i) => (
                            <div key={a.id_batch} className="text-[11px] text-slate-600 flex justify-between">
                              <span>Batch #{a.id_batch} <span className="text-blue-600">(FIFO #{i + 1})</span></span>
                              <span className="font-medium">{a.qty} unit</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-600">Total</span>
                <span className="text-xl font-bold text-slate-900">{formatRupiah(total)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={cart.length === 0}
                className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Proses Transaksi
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Transaksi Berhasil</h3>
            <p className="text-sm text-slate-500 mt-1">Stok batch telah dikurangi sesuai FIFO</p>
            <p className="text-xs text-slate-400 mt-3">Demo: data tidak tersimpan ke backend</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function getVariantByIdLocal(id: number) {
  return VARIANTS.find((v) => v.id_varian === id);
}
