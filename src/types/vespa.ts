export interface VespaBasic {
  id: number;
  model: string;
  plat_nomor: string;
}

export interface VespaDetail extends VespaBasic {
  tahun_produksi: number;
  tanggal_servis_terakhir?: string;
  jeda_hari_servis?: number;
  tanggal_servis_selanjutnya?: string;
  perlu_servis?: boolean;
  hari_hingga_servis?: number;
}
