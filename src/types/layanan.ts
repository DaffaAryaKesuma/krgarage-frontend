// Bentuk ringkas layanan untuk tampilan umum atau relasi sederhana.
export interface LayananRingkasan {
  id: number;
  nama_layanan: string;
  harga: number;
  deskripsi?: string;
  durasi_pengerjaan?: number | null;
  gambar?: string | null;
}

// Bentuk layanan katalog, misalnya untuk halaman pemesanan pelanggan.
export interface LayananCatalogItem {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string | null;
}

// Metrik layanan teratas untuk dashboard/laporan pemilik.
export interface TeratasLayananMetric {
  id: number;
  nama_layanan: string;
  harga: number;
  total: number;
}
