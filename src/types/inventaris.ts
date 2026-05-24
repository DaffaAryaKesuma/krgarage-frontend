export interface SukuCadangRingkasan {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_jual: number;
  batas_minimal_stok?: number;
  deskripsi?: string;
  stok_menipis?: boolean;
}

export interface InventarisSukuCadang {
  id: number;
  nama_suku_cadang: string;
  id_kategori: number | null;
  kategori: string | null;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

export interface InventarisSukuCadangForm {
  nama_suku_cadang: string;
  id_kategori: number | null;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number | null;
  deskripsi: string;
}

export interface InventarisCategory {
  id: number;
  nama: string;
}

export interface TeratasSukuCadangMetric {
  id: number;
  nama_barang: string;
  jumlah_stok: number;
  harga_jual: number;
  total_terjual: number;
  total_pendapatan?: number;
}

export interface RiwayatRestokSukuCadang {
  id: number;
  jumlah: number;
  harga_beli_satuan: number;
  total_pengeluaran: number;
  stok_sebelum: number;
  stok_sesudah: number;
  catatan?: string | null;
  created_at: string;
  suku_cadang?: {
    id: number;
    nama_suku_cadang: string;
  } | null;
  admin?: {
    id: number;
    nama: string;
  } | null;
}
