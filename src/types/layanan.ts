export interface LayananRingkasan {
  id: number;
  nama_layanan: string;
  harga: number;
  deskripsi?: string;
  durasi_pengerjaan?: number | null;
  gambar?: string | null;
}

export interface LayananCatalogItem {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string | null;
}

export interface TeratasLayananMetric {
  id: number;
  nama_layanan: string;
  harga: number;
  total: number;
}
