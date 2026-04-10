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
