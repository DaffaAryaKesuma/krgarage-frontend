import type { RouteLocationRaw } from "vue-router";
import { normalizeUserRole, type CanonicalUserRole } from "@/utils/roleRoutes";
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

// Bentuk data notifikasi dari backend.
export interface AppNotification {
  id: number;
  tipe: string;
  judul: string;
  pesan: string;
  sudah_dibaca: boolean;
  id_pemesanan: number | null;
  created_at: string;
  pemesanan?: {
    id?: number;
    kode_pemesanan: string;
  };
}

// Role aplikasi yang sudah dinormalisasi.
type AppRole = CanonicalUserRole;

// Mapping tipe notifikasi ke icon.
const NOTIFICATION_ICONS: Record<string, string> = {
  pemesanan_dikonfirmasi: "mdi-check-circle",
  pemesanan_diproses:     "mdi-wrench-cog",
  pemesanan_selesai:      "mdi-check-all",
  pemesanan_dibatalkan:   "mdi-close-circle",
  pemesanan_ditugaskan:   "mdi-account-check",
  pemesanan_dihapus:      "mdi-delete-circle",
  pemesanan_diperbarui:   "mdi-pencil-circle",
  stok_menipis:           "mdi-alert",
  pembayaran_diterima:    "mdi-cash-check",
};

// Mapping tipe notifikasi ke warna icon.
const NOTIFICATION_TONES: Record<string, IconToneKey> = {
  pemesanan_dikonfirmasi: "info",
  pemesanan_diproses: "warning",
  pemesanan_selesai: "success",
  pemesanan_dibatalkan: "danger",
  pemesanan_ditugaskan: "warning",
  pemesanan_dihapus: "danger",
  pemesanan_diperbarui: "neutral",
  stok_menipis: "warning",
  pembayaran_diterima: "success",
};

// Normalisasi role supaya alias lama tetap aman.
export function normalizeRole(role?: string | null): AppRole {
  return normalizeUserRole(role);
}

// Mengambil id pemesanan dari notifikasi, baik dari field langsung maupun relasi.
export function getPemesananIdFromNotification(
  notifikasi: AppNotification,
): number | null {
  // Coba ambil dari id_pemesanan langsung.
  const directPemesananId = Number(notifikasi.id_pemesanan);
  if (Number.isFinite(directPemesananId) && directPemesananId > 0) {
    return directPemesananId;
  }

  // Jika tidak ada, coba ambil dari relasi pemesanan.
  const relationPemesananId = Number(notifikasi.pemesanan?.id);
  if (Number.isFinite(relationPemesananId) && relationPemesananId > 0) {
    return relationPemesananId;
  }

  // null berarti notifikasi tidak terkait pemesanan tertentu.
  return null;
}

// Menentukan tujuan route ketika notifikasi diklik.
export function resolveNotificationTarget(
  role: AppRole,
  idPemesanan: number | null,
  notifikasiType?: string,
): RouteLocationRaw {
  // Admin diarahkan ke detail pemesanan jika ada id.
  if (role === "admin") {
    if (idPemesanan) {
      return {
        name: "admin-pemesanan-detail",
        params: { id: String(idPemesanan) },
      };
    }

    return { name: "admin-pemesanan" };
  }

  // Mekanik tetap ke dasbor, id pemesanan dikirim via query.
  if (role === "mekanik") {
    if (idPemesanan) {
      return {
        name: "mekanik-dasbor",
        query: { pemesanan: String(idPemesanan) },
      };
    }

    return { name: "mekanik-dasbor" };
  }

  // Pemilik diarahkan berdasarkan jenis notifikasi.
  if (role === "pemilik") {
    if (notifikasiType === "stok_menipis") {
      return { name: "pemilik-analisa-inventaris" };
    }

    if (notifikasiType === "pembayaran_diterima") {
      return { name: "pemilik-laporan-keuangan" };
    }

    if (idPemesanan) {
      return { name: "pemilik-laporan-keuangan" };
    }

    return { name: "pemilik-dasbor" };
  }

  // Pelanggan diarahkan ke detail riwayat jika ada id pemesanan.
  if (idPemesanan) {
    return {
      name: "pelanggan-riwayat-detail",
      params: { id: String(idPemesanan) },
    };
  }

  // Fallback pelanggan ke halaman riwayat.
  return { name: "pelanggan-riwayat" };
}

// Mengambil icon berdasarkan tipe notifikasi.
export function getNotificationIcon(tipe: string): string {
  return NOTIFICATION_ICONS[tipe] || "mdi-bell";
}

// Mengambil class warna icon berdasarkan tipe notifikasi.
export function getNotificationColor(tipe: string): string {
  return getIconToneClass(NOTIFICATION_TONES[tipe] || "neutral");
}
