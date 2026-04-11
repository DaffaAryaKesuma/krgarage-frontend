export interface ServiceSummary {
  id: number;
  nama_layanan: string;
  harga: number;
  deskripsi?: string;
  durasi_pengerjaan?: number | null;
  gambar?: string | null;
}

export interface ServiceCatalogItem {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string | null;
}

export interface TopServiceMetric {
  id: number;
  nama_layanan: string;
  harga: number;
  total_pemesanan: number;
}
