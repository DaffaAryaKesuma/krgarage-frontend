export interface ServiceSummary {
  id: number;
  nama_layanan: string;
  harga: number;
  deskripsi?: string;
  durasi_pengerjaan?: number | null;
  gambar?: string | null;
}
