export type Role = "admin" | "kasir";

export interface Product {
  id_produk: number;
  nama_produk: string;
  kategori: string;
}

export interface Variant {
  id_varian: number;
  id_produk: number;
  sku: string;
  ukuran: string;
  kemasan: string;
  warna: string;
  harga_jual: number;
  // computed from batches
  total_stok: number;
  rop: number;
  safety_stock: number;
  status_restock: boolean;
}

export interface BatchStock {
  id_batch: number;
  id_varian: number;
  qty_awal: number;
  qty_sisa: number;
  tgl_masuk: string;
  expired_date: string;
  id_supplier: string;
}

export interface TransaksiDetail {
  id_detail: number;
  id_transaksi: number;
  id_varian: number;
  id_batch: number;
  qty_beli: number;
  subtotal: number;
}

export interface Transaksi {
  id_transaksi: number;
  nama_pelanggan: string;
  tgl_transaksi: string;
  status_transaksi: "selesai" | "pending" | "batal";
  total: number;
  details: TransaksiDetail[];
}

export const PRODUCTS: Product[] = [
  { id_produk: 1, nama_produk: "Lem Rajawali", kategori: "Lem" },
  { id_produk: 2, nama_produk: "Kulit Sintetis", kategori: "Kulit" },
  { id_produk: 3, nama_produk: "Sol Karet", kategori: "Sol" },
  { id_produk: 4, nama_produk: "Kain Lining", kategori: "Kain" },
  { id_produk: 5, nama_produk: "Aksesori Kancing", kategori: "Aksesoris" },
  { id_produk: 6, nama_produk: "Benang Jahit", kategori: "Aksesoris" },
  { id_produk: 7, nama_produk: "Lem Fox", kategori: "Lem" },
  { id_produk: 8, nama_produk: "Sol EVA", kategori: "Sol" },
];

export const VARIANTS: Variant[] = [
  { id_varian: 1, id_produk: 1, sku: "LEM-RAJ-14KG", ukuran: "14 kg", kemasan: "Kaleng", warna: "-", harga_jual: 185000, total_stok: 18, rop: 20, safety_stock: 5, status_restock: true },
  { id_varian: 2, id_produk: 1, sku: "LEM-RAJ-7KG", ukuran: "7 kg", kemasan: "Kaleng", warna: "-", harga_jual: 98000, total_stok: 45, rop: 15, safety_stock: 4, status_restock: false },
  { id_varian: 3, id_produk: 2, sku: "KUL-HIT-120", ukuran: "120 cm", kemasan: "Roll", warna: "Hitam", harga_jual: 75000, total_stok: 8, rop: 10, safety_stock: 3, status_restock: true },
  { id_varian: 4, id_produk: 2, sku: "KUL-COK-120", ukuran: "120 cm", kemasan: "Roll", warna: "Coklat", harga_jual: 75000, total_stok: 22, rop: 10, safety_stock: 3, status_restock: false },
  { id_varian: 5, id_produk: 3, sku: "SOL-KRT-38", ukuran: "38", kemasan: "Pcs", warna: "Hitam", harga_jual: 12000, total_stok: 120, rop: 50, safety_stock: 15, status_restock: false },
  { id_varian: 6, id_produk: 3, sku: "SOL-KRT-40", ukuran: "40", kemasan: "Pcs", warna: "Hitam", harga_jual: 12000, total_stok: 35, rop: 50, safety_stock: 15, status_restock: true },
  { id_varian: 7, id_produk: 4, sku: "KAI-LIN-BEI", ukuran: "150 cm", kemasan: "Meter", warna: "Beige", harga_jual: 18000, total_stok: 60, rop: 30, safety_stock: 10, status_restock: false },
  { id_varian: 8, id_produk: 5, sku: "AKS-KNC-MAS", ukuran: "1 cm", kemasan: "Gross", warna: "Emas", harga_jual: 25000, total_stok: 14, rop: 20, safety_stock: 5, status_restock: true },
  { id_varian: 9, id_produk: 6, sku: "BEN-JAH-HIT", ukuran: "1000 m", kemasan: "Gulungan", warna: "Hitam", harga_jual: 22000, total_stok: 80, rop: 25, safety_stock: 8, status_restock: false },
  { id_varian: 10, id_produk: 7, sku: "LEM-FOX-5KG", ukuran: "5 kg", kemasan: "Kaleng", warna: "-", harga_jual: 55000, total_stok: 30, rop: 20, safety_stock: 5, status_restock: false },
];

export const BATCH_STOCKS: BatchStock[] = [
  { id_batch: 1, id_varian: 1, qty_awal: 20, qty_sisa: 8, tgl_masuk: "2026-04-01", expired_date: "2027-04-01", id_supplier: "SUP-001" },
  { id_batch: 2, id_varian: 1, qty_awal: 15, qty_sisa: 10, tgl_masuk: "2026-05-10", expired_date: "2027-05-10", id_supplier: "SUP-001" },
  { id_batch: 3, id_varian: 2, qty_awal: 30, qty_sisa: 20, tgl_masuk: "2026-05-01", expired_date: "2027-05-01", id_supplier: "SUP-001" },
  { id_batch: 4, id_varian: 2, qty_awal: 30, qty_sisa: 25, tgl_masuk: "2026-06-01", expired_date: "2027-06-01", id_supplier: "SUP-001" },
  { id_batch: 5, id_varian: 3, qty_awal: 15, qty_sisa: 8, tgl_masuk: "2026-03-15", expired_date: "2028-03-15", id_supplier: "SUP-002" },
  { id_batch: 6, id_varian: 4, qty_awal: 25, qty_sisa: 22, tgl_masuk: "2026-05-20", expired_date: "2028-05-20", id_supplier: "SUP-002" },
  { id_batch: 7, id_varian: 5, qty_awal: 200, qty_sisa: 120, tgl_masuk: "2026-04-10", expired_date: "2028-04-10", id_supplier: "SUP-003" },
  { id_batch: 8, id_varian: 6, qty_awal: 100, qty_sisa: 35, tgl_masuk: "2026-04-10", expired_date: "2028-04-10", id_supplier: "SUP-003" },
  { id_batch: 9, id_varian: 7, qty_awal: 80, qty_sisa: 60, tgl_masuk: "2026-05-05", expired_date: "2029-05-05", id_supplier: "SUP-004" },
  { id_batch: 10, id_varian: 8, qty_awal: 30, qty_sisa: 14, tgl_masuk: "2026-04-20", expired_date: "2029-04-20", id_supplier: "SUP-005" },
  { id_batch: 11, id_varian: 9, qty_awal: 100, qty_sisa: 80, tgl_masuk: "2026-05-01", expired_date: "2030-05-01", id_supplier: "SUP-006" },
  { id_batch: 12, id_varian: 10, qty_awal: 40, qty_sisa: 30, tgl_masuk: "2026-06-01", expired_date: "2027-06-01", id_supplier: "SUP-001" },
];

export const TRANSAKSI: Transaksi[] = [
  {
    id_transaksi: 1001, nama_pelanggan: "Budi Santoso", tgl_transaksi: "2026-06-28", status_transaksi: "selesai", total: 555000,
    details: [
      { id_detail: 1, id_transaksi: 1001, id_varian: 1, id_batch: 1, qty_beli: 2, subtotal: 370000 },
      { id_detail: 2, id_transaksi: 1001, id_varian: 5, id_batch: 7, qty_beli: 5, subtotal: 185000 },  // adjusted
    ],
  },
  {
    id_transaksi: 1002, nama_pelanggan: "Siti Rahayu", tgl_transaksi: "2026-06-28", status_transaksi: "selesai", total: 225000,
    details: [
      { id_detail: 3, id_transaksi: 1002, id_varian: 2, id_batch: 3, qty_beli: 1, subtotal: 98000 },
      { id_detail: 4, id_transaksi: 1002, id_varian: 7, id_batch: 9, qty_beli: 7, subtotal: 126000 },
    ],
  },
  {
    id_transaksi: 1003, nama_pelanggan: "Ahmad Fauzi", tgl_transaksi: "2026-06-27", status_transaksi: "selesai", total: 300000,
    details: [
      { id_detail: 5, id_transaksi: 1003, id_varian: 3, id_batch: 5, qty_beli: 4, subtotal: 300000 },
    ],
  },
  {
    id_transaksi: 1004, nama_pelanggan: "Dewi Kartika", tgl_transaksi: "2026-06-27", status_transaksi: "selesai", total: 198000,
    details: [
      { id_detail: 6, id_transaksi: 1004, id_varian: 10, id_batch: 12, qty_beli: 2, subtotal: 110000 },
      { id_detail: 7, id_transaksi: 1004, id_varian: 9, id_batch: 11, qty_beli: 4, subtotal: 88000 },
    ],
  },
  {
    id_transaksi: 1005, nama_pelanggan: "Hendra Wijaya", tgl_transaksi: "2026-06-26", status_transaksi: "batal", total: 0,
    details: [],
  },
  {
    id_transaksi: 1006, nama_pelanggan: "Linda Susanti", tgl_transaksi: "2026-06-26", status_transaksi: "selesai", total: 462000,
    details: [
      { id_detail: 8, id_transaksi: 1006, id_varian: 4, id_batch: 6, qty_beli: 2, subtotal: 150000 },
      { id_detail: 9, id_transaksi: 1006, id_varian: 8, id_batch: 10, qty_beli: 2, subtotal: 50000 },
      { id_detail: 10, id_transaksi: 1006, id_varian: 1, id_batch: 1, qty_beli: 1, subtotal: 185000 },
    ],
  },
  {
    id_transaksi: 1007, nama_pelanggan: "Rizky Pratama", tgl_transaksi: "2026-06-25", status_transaksi: "selesai", total: 294000,
    details: [
      { id_detail: 11, id_transaksi: 1007, id_varian: 6, id_batch: 8, qty_beli: 6, subtotal: 72000 },
      { id_detail: 12, id_transaksi: 1007, id_varian: 2, id_batch: 3, qty_beli: 2, subtotal: 196000 },
    ],
  },
];

export const SUPPLIERS = [
  { id: "SUP-001", nama: "CV Maju Bersama" },
  { id: "SUP-002", nama: "PT Kulit Nusantara" },
  { id: "SUP-003", nama: "UD Sumber Sole" },
  { id: "SUP-004", nama: "Toko Kain Abadi" },
  { id: "SUP-005", nama: "PT Aksesoris Prima" },
  { id: "SUP-006", nama: "CV Benang Mas" },
];

export function getProductById(id: number) {
  return PRODUCTS.find((p) => p.id_produk === id);
}

export function getVariantById(id: number) {
  return VARIANTS.find((v) => v.id_varian === id);
}

export function getBatchesForVariant(id_varian: number) {
  return BATCH_STOCKS.filter((b) => b.id_varian === id_varian && b.qty_sisa > 0)
    .sort((a, b) => new Date(a.expired_date).getTime() - new Date(b.expired_date).getTime());
}

export function getVariantsForProduct(id_produk: number) {
  return VARIANTS.filter((v) => v.id_produk === id_produk);
}

export const ROPAlerts = VARIANTS.filter((v) => v.status_restock);
