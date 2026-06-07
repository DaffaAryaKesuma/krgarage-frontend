// Bentuk data Vespa paling ringkas, biasanya untuk pilihan pemesanan.
export interface VespaBasic {
  id: number;
  model: string;
  plat_nomor: string;
  // True jika Vespa sedang punya pemesanan aktif.
  pemesanan_aktif?: boolean;
}

// Bentuk data Vespa lengkap untuk halaman Vespa Saya.
export interface VespaDetail extends VespaBasic {
  tahun_produksi: number;
  tanggal_servis_terakhir?: string;
  jeda_hari_servis?: number;
  tanggal_servis_selanjutnya?: string;
  // True jika Vespa sudah perlu servis berdasarkan jadwal.
  perlu_servis?: boolean;
  // Jumlah hari menuju jadwal servis berikutnya.
  hari_hingga_servis?: number;
}
