// Ringkasan suku cadang dipakai pada item pemesanan.
import type { SukuCadangRingkasan } from "./inventaris";
// Profil user dan mekanik dipakai pada relasi pemesanan.
import type { MekanikProfile, UserProfile } from "./user";

// Data Vespa yang menempel pada detail pemesanan.
export interface PemesananVespa {
  model: string;
  plat_nomor: string;
  tahun_produksi?: number;
}

// Satu baris suku cadang yang dipakai dalam pemesanan.
export interface PemesananItem {
  id: number;
  // Snapshot nama saat suku cadang dipakai, agar tetap konsisten jika master berubah.
  nama_suku_cadang_saat_ini?: string;
  suku_cadang:
    | (Pick<SukuCadangRingkasan, "nama_suku_cadang" | "kategori"> & {
        id?: number;
      })
    | null;
  jumlah: number;
  harga_saat_ini: number;
}

// Satu baris layanan yang dipilih dalam pemesanan.
export interface PemesananLayananLine {
  id?: number;
  nama_layanan?: string;
  harga?: number;
  // Pivot adalah data dari tabel layanan_pemesanan.
  pivot?: {
    // Snapshot harga saat pelanggan membuat pemesanan.
    harga_saat_pesan?: number;
    // Snapshot nama layanan saat pelanggan membuat pemesanan.
    nama_layanan_saat_ini?: string;
  };
}

// Bentuk data detail pemesanan lengkap.
export interface Pemesanan {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  // Waktu servis dinyatakan selesai.
  completed_at?: string | null;
  // Waktu pembayaran dinyatakan lunas.
  paid_at?: string | null;
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

// Opsi mekanik untuk select/combobox admin.
export interface MekanikOption {
  value: number;
  label: string;
}

// Bentuk data pemesanan pada halaman pelanggan.
export interface PelangganPemesanan {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  completed_at?: string | null;
  paid_at?: string | null;
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

// Bentuk layanan yang ringkas untuk kartu mekanik.
export interface MekanikPemesananLayanan {
  id: number;
  nama_layanan: string;
}

// Bentuk data pemesanan pada dashboard mekanik.
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
  completed_at?: string | null;
  paid_at?: string | null;
  catatan_pelanggan?: string;
  catatan_mekanik?: string;
  item_pemesanan?: PemesananItem[];
}

// Layanan pemesanan yang dipakai di laporan keuangan.
export interface KeuanganPemesananLayanan {
  nama_layanan: string;
  pivot: {
    harga_saat_pesan: number;
  };
}

// Bentuk pemesanan untuk laporan keuangan admin/pemilik.
export interface KeuanganPemesanan {
  id: number;
  kode_pemesanan: string;
  updated_at?: string;
  completed_at?: string | null;
  paid_at?: string | null;
  tanggal_pemesanan?: string;
  total_harga: number | null;
  status?: string;
  status_pembayaran?: string | null;
  pengguna: Pick<UserProfile, "nama">;
  vespa?: Pick<PemesananVespa, "plat_nomor">;
  layanan: KeuanganPemesananLayanan[];
  item_pemesanan?: Array<{
    jumlah: number;
    nama_suku_cadang_saat_ini?: string;
    suku_cadang: {
      nama_suku_cadang: string;
    } | null;
  }>;
}

// Bentuk aktivitas terbaru di dashboard pemilik.
export interface PemilikTerbaruPemesananActivity {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  completed_at?: string | null;
  paid_at?: string | null;
  nama_pelanggan: string;
  nama_layanan: string;
  total_harga: number;
  status: string;
  status_pembayaran?: string | null;
}
