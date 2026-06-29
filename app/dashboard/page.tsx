"use client";
import AppShell from "@/components/AppShell";
import { VARIANTS, PRODUCTS, TRANSAKSI, ROPAlerts, getProductById, BATCH_STOCKS } from "@/lib/mock-data";
import type { BatchStock } from "@/lib/mock-data";
import { formatRupiah, formatTanggal, daysUntil } from "@/lib/format";
import Link from "next/link";

export default function DashboardPage() {
  const totalProduk = PRODUCTS.length;
  const totalVarian = VARIANTS.length;
  const totalStokUnit = VARIANTS.reduce((sum, v) => sum + v.total_stok, 0);
  const totalNilaiStok = VARIANTS.reduce((sum, v) => sum + v.total_stok * v.harga_jual, 0);
  const alertCount = ROPAlerts.length;
  const transaksiSelesai = TRANSAKSI.filter((t) => t.status_transaksi === "selesai");
  const pendapatanBulan = transaksiSelesai.reduce((sum, t) => sum + t.total, 0);

  // Near-expiry batches (within 90 days)
  const nearExpiry = getNearExpiryBatches();

  const kpis = [
    { label: "Total Produk", value: totalProduk.toString(), sub: `${totalVarian} varian`, color: "from-blue-500 to-blue-600", icon: "box" },
    { label: "Total Stok", value: totalStokUnit.toLocaleString("id-ID"), sub: "unit", color: "from-emerald-500 to-emerald-600", icon: "stack" },
    { label: "Alert Restock", value: alertCount.toString(), sub: "varian perlu order", color: "from-amber-500 to-orange-500", icon: "alert" },
    { label: "Pendapatan (Bulan)", value: formatRupiah(pendapatanBulan), sub: `${transaksiSelesai.length} transaksi`, color: "from-slate-700 to-slate-900", icon: "money" },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Ringkasan persediaan & penjualan toko">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{kpi.value}</div>
                <div className="mt-1 text-xs text-slate-500">{kpi.sub}</div>
              </div>
              <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shrink-0`}>
                <KpiIcon name={kpi.icon} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROP Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900">Alert Re-Order Point (ROP)</h2>
              <p className="text-xs text-slate-500">Varian dengan stok di bawah ROP — perlu pemesanan ulang</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              {alertCount} varian
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {ROPAlerts.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">Tidak ada alert. Semua stok aman.</div>
            )}
            {ROPAlerts.map((v) => {
              const produk = getProductById(v.id_produk);
              return (
                <div key={v.id_varian} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.999 3.124 2.499 2.247l9.5-5.5a1.875 1.875 0 000-3.247l-9.5-5.5c-1.5-.877-3.365.747-2.499 2.247l.866 1.5a1.875 1.875 0 000 1.753l-.866 1.5zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">{produk?.nama_produk} — {v.ukuran} {v.warna !== "-" ? `(${v.warna})` : ""}</div>
                    <div className="text-xs text-slate-500 font-mono">{v.sku}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-rose-600">{v.total_stok} unit</div>
                    <div className="text-[11px] text-slate-400">ROP: {v.rop} · SS: {v.safety_stock}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Near Expiry */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Mendekati Expired</h2>
            <p className="text-xs text-slate-500">Batch dengan expired &lt; 90 hari</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {nearExpiry.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">Tidak ada batch mendekati expired.</div>
            )}
            {nearExpiry.map((b) => {
              const v = VARIANTS.find((x) => x.id_varian === b.id_varian);
              const produk = v ? getProductById(v.id_produk) : null;
              const days = daysUntil(b.expired_date);
              return (
                <div key={b.id_batch} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="font-medium text-sm text-slate-900 truncate">{produk?.nama_produk}</div>
                  <div className="text-xs text-slate-500 font-mono">{v?.sku} · Batch #{b.id_batch}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Exp: {formatTanggal(b.expired_date)}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${days < 30 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                      {days} hari
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Summary Table */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">Ringkasan Stok per Varian</h2>
            <p className="text-xs text-slate-500">Status stok, ROP, dan safety stock</p>
          </div>
          <Link href="/varian" className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">SKU</th>
                <th className="text-left px-5 py-3 font-medium">Produk</th>
                <th className="text-right px-5 py-3 font-medium">Stok</th>
                <th className="text-right px-5 py-3 font-medium">ROP</th>
                <th className="text-right px-5 py-3 font-medium">Safety Stock</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VARIANTS.slice(0, 8).map((v) => {
                const produk = getProductById(v.id_produk);
                const status = v.total_stok <= v.safety_stock ? "kritis" : v.total_stok <= v.rop ? "restock" : "aman";
                return (
                  <tr key={v.id_varian} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{v.sku}</td>
                    <td className="px-5 py-3 text-slate-900">{produk?.nama_produk} <span className="text-slate-400">· {v.ukuran}</span></td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">{v.total_stok}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{v.rop}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{v.safety_stock}</td>
                    <td className="px-5 py-3 text-center">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function getNearExpiryBatches(): (BatchStock & { days: number })[] {
  return BATCH_STOCKS.filter((b) => b.qty_sisa > 0)
    .map((b) => ({ ...b, days: daysUntil(b.expired_date) }))
    .filter((b) => b.days < 90 && b.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);
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

function KpiIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    box: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    stack: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
      </svg>
    ),
    alert: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.999 3.124 2.499 2.247l9.5-5.5a1.875 1.875 0 000-3.247l-9.5-5.5c-1.5-.877-3.365.747-2.499 2.247l.866 1.5a1.875 1.875 0 000 1.753l-.866 1.5z" />
      </svg>
    ),
    money: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125V18A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}
