export interface SparepartSummary {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_jual: number;
  batas_minimal_stok?: number;
  deskripsi?: string;
  stok_menipis?: boolean;
}

export interface InventorySparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

export interface InventorySparepartForm {
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
}

export interface TopSparepartMetric {
  id: number;
  nama_barang: string;
  jumlah_stok: number;
  harga_jual: number;
  total_terjual: number;
  total_pendapatan?: number;
}
