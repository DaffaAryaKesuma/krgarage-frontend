// Bentuk ringkas suku cadang untuk relasi pemesanan atau kartu kecil.
export interface SukuCadangRingkasan {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_jual: number;
  batas_minimal_stok?: number;
  deskripsi?: string;
  stok_menipis?: boolean;
}

// Bentuk lengkap suku cadang pada halaman inventaris admin.
export interface InventarisSukuCadang {
  id: number;
  nama_suku_cadang: string;
  id_kategori: number | null;
  kategori: string | null;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

// Bentuk form tambah/edit suku cadang.
export interface InventarisSukuCadangForm {
  nama_suku_cadang: string;
  id_kategori: number | null;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number | null;
  deskripsi: string;
}

// Kategori suku cadang.
export interface InventarisCategory {
  id: number;
  nama: string;
}

// Metrik suku cadang teratas untuk analisa inventaris pemilik.
export interface TeratasSukuCadangMetric {
  id: number;
  nama_barang: string;
  jumlah_stok: number;
  harga_jual: number;
  total_terjual: number;
  total_pendapatan?: number;
}

// Riwayat restok suku cadang untuk laporan pengeluaran/inventaris.
export interface RiwayatRestokSukuCadang {
  id: number;
  jumlah: number;
  harga_beli_satuan: number;
  total_pengeluaran: number;
  stok_sebelum: number;
  stok_sesudah: number;
  catatan?: string | null;
  foto_struk?: string | null;
  created_at: string;
  suku_cadang?: {
    id: number;
    nama_suku_cadang: string;
  } | null;
  admin?: {
    id: number;
    nama: string;
  } | null;
}

// Log aktivitas penting untuk audit pemilik.
export interface LogAktivitas {
  id: number;
  id_pengguna?: number | null;
  role?: AuditActorRole | string | null;
  aksi: "tambah" | "edit" | "hapus" | "restok" | "batal" | string;
  modul: string;
  target_tipe?: string | null;
  target_id?: number | null;
  target_label?: string | null;
  deskripsi?: string | null;
  data_sebelum?: Record<string, unknown> | null;
  data_sesudah?: Record<string, unknown> | null;
  created_at: string;
  aktor?: {
    id: number;
    nama: string;
    role?: string;
  } | null;
}

export type AuditActorRole = "semua" | "admin" | "mekanik" | "pelanggan";

export type AuditModulKey =
  | "semua"
  | "inventaris"
  | "keuangan"
  | "pemesanan"
  | "layanan"
  | "karyawan";

export const AUDIT_MODULE_OPTIONS: Array<{
  value: AuditModulKey;
  label: string;
}> = [
  { value: "semua", label: "Semua Modul" },
  { value: "inventaris", label: "Inventaris" },
  { value: "keuangan", label: "Keuangan" },
  { value: "pemesanan", label: "Pemesanan" },
  { value: "layanan", label: "Layanan" },
  { value: "karyawan", label: "Karyawan" },
];

export const AUDIT_ACTOR_OPTIONS: Array<{
  value: AuditActorRole;
  label: string;
}> = [
  { value: "semua", label: "Semua Aktor" },
  { value: "admin", label: "Admin" },
  { value: "mekanik", label: "Mekanik" },
  { value: "pelanggan", label: "Pelanggan" },
];
