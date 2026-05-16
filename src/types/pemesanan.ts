import type { SukuCadangRingkasan } from "./inventaris";
import type { MekanikProfile, UserProfile } from "./user";

export interface PemesananVespa {
  model: string;
  plat_nomor: string;
  tahun_produksi?: number;
}

export interface PemesananItem {
  id: number;
  suku_cadang: Pick<SukuCadangRingkasan, "nama_suku_cadang" | "kategori"> & {
    id?: number;
  };
  jumlah: number;
  harga_saat_ini: number;
}

export interface PemesananLayananLine {
  id?: number;
  nama_layanan: string;
  harga?: number;
  pivot?: {
    harga_saat_pesan?: number;
  };
}

export interface Pemesanan {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  status_pembayaran?: string | null;
  total_harga: number | null;
  id_mekanik: number | null;
  catatan_pelanggan?: string;
  catatan_mekanik?: string;
  pengguna: UserProfile;
  vespa: PemesananVespa;
  layanan: PemesananLayananLine[];
  mekanik?: MekanikProfile | null;
  item_pemesanan?: PemesananItem[];
}

export interface MekanikOption {
  value: number;
  label: string;
}

export interface PelangganPemesanan {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  tanggal_pemesanan: string;
  jam_pemesanan?: string;
  status: string;
  status_pembayaran?: string | null;
  total_harga?: number | null;
  catatan_mekanik?: string;
  vespa: Pick<PemesananVespa, "model" | "plat_nomor">;
  layanan: PemesananLayananLine[];
  item_pemesanan?: PemesananItem[];
}

export interface MekanikPemesananLayanan {
  id: number;
  nama_layanan: string;
}

export interface MekanikPemesanan {
  id: number;
  kode_pemesanan: string;
  pengguna: UserProfile;
  vespa: PemesananVespa;
  layanan?: MekanikPemesananLayanan[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  status_pembayaran?: string | null;
  catatan_pelanggan?: string;
  catatan_mekanik?: string;
  item_pemesanan?: PemesananItem[];
}

export interface KeuanganPemesananLayanan {
  nama_layanan: string;
  pivot: {
    harga_saat_pesan: number;
  };
}

export interface KeuanganPemesanan {
  id: number;
  kode_pemesanan: string;
  updated_at?: string;
  tanggal_pemesanan?: string;
  total_harga: number | null;
  status?: string;
  status_pembayaran?: string | null;
  pengguna: Pick<UserProfile, "nama">;
  vespa?: Pick<PemesananVespa, "plat_nomor">;
  layanan: KeuanganPemesananLayanan[];
  item_pemesanan?: Array<{
    jumlah: number;
    suku_cadang: {
      nama_suku_cadang: string;
    };
  }>;
}

export interface PemilikTerbaruPemesananActivity {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  nama_pelanggan: string;
  nama_layanan: string;
  total_harga: number;
  status: string;
  status_pembayaran?: string | null;
}
