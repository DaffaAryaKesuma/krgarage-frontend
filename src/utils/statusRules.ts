import {
  PEMESANAN_STATUS,
  STATUS_BADGE_BASE_CLASS,
  STATUS_MAP,
  toPemesananStatus,
  type PemesananStatus,
} from "./statusCore";
import { badgeVariants } from "./badgeVariants";

// Mengecek apakah status masih Menunggu.
export function isStatusMenunggu(status: string | null | undefined): boolean {
  return status?.toLowerCase() === "menunggu";
}

// Mengecek apakah status sudah Dikonfirmasi.
export function isStatusDikonfirmasi(
  status: string | null | undefined,
): boolean {
  return status?.toLowerCase() === "dikonfirmasi";
}

// Mengecek apakah status Batal.
export function isStatusBatal(status: string | null | undefined): boolean {
  const s = status?.toLowerCase();
  return s === "batal";
}

// Mengecek apakah status sedang Dikerjakan.
export function isStatusDikerjakan(status: string | null | undefined): boolean {
  const s = status?.toLowerCase();
  return s === "dikerjakan";
}

// Mengecek apakah status Selesai.
export function isStatusSelesai(status: string | null | undefined): boolean {
  return status?.toLowerCase() === "selesai";
}

// Status ini masih boleh dibatalkan oleh pelanggan/admin.
export function isPendingOrConfirmedStatus(
  status: string | null | undefined,
): boolean {
  return isStatusMenunggu(status) || isStatusDikonfirmasi(status);
}

// Status akhir yang tidak seharusnya diproses lagi.
export function isCompletedOrCancelledStatus(
  status: string | null | undefined,
): boolean {
  return isStatusSelesai(status) || isStatusBatal(status);
}

// Pelanggan boleh membatalkan jika masih menunggu atau dikonfirmasi.
export function canPelangganCancelPemesanan(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status);
}

// Admin memakai aturan batal yang sama dengan pelanggan.
export function canAdminCancelPemesanan(
  status: string | null | undefined,
): boolean {
  return canPelangganCancelPemesanan(status);
}

// Admin hanya bisa konfirmasi jika status masih Menunggu.
export function canAdminConfirmPemesanan(
  status: string | null | undefined,
): boolean {
  return isStatusMenunggu(status);
}

// Admin bisa assign mekanik dan mulai servis setelah pemesanan dikonfirmasi.
export function canAdminAssignAndStart(
  status: string | null | undefined,
): boolean {
  return isStatusDikonfirmasi(status);
}

// Admin bisa menyelesaikan pemesanan jika status sedang Dikerjakan.
export function canAdminCompletePemesanan(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

// Mekanik bisa update status saat pekerjaan sedang Dikerjakan.
export function canMekanikUpdateStatus(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

// Mekanik bisa tambah suku cadang saat pekerjaan sedang Dikerjakan.
export function canMekanikAddSukuCadang(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

// Teks tombol aksi mekanik berdasarkan status.
export function getMekanikAksiButtonText(
  status: string | null | undefined,
): string {
  if (isStatusDikerjakan(status)) {
    return "Selesaikan Pekerjaan";
  }
  return "";
}

// Status berikutnya saat mekanik menekan aksi utama.
export function getMekanikNextStatus(
  currentStatus: string | null | undefined,
): PemesananStatus | null {
  if (isStatusDikerjakan(currentStatus)) {
    return PEMESANAN_STATUS.SELESAI;
  }
  return null;
}

// Mengambil class warna badge status.
export function getStatusBadge(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.badge : null) ||
    badgeVariants.status.menunggu
  );
}

// Menggabungkan class dasar badge dengan warna status.
export function getStatusBadgeClass(status: string | null): string {
  return `${STATUS_BADGE_BASE_CLASS} ${getStatusBadge(status)}`;
}

// Mengambil label status yang aman ditampilkan di UI.
export function getStatusLabel(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.label : null) ||
    status ||
    "Tidak Diketahui"
  );
}

// Mengambil icon Material Design sesuai status.
export function getStatusIcon(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  const iconMap: Record<PemesananStatus, string> = {
    [PEMESANAN_STATUS.MENUNGGU]: "mdi-clock-outline",
    [PEMESANAN_STATUS.DIKONFIRMASI]: "mdi-check-circle",
    [PEMESANAN_STATUS.DIKERJAKAN]: "mdi-wrench-cog",
    [PEMESANAN_STATUS.SELESAI]: "mdi-check-all",
    [PEMESANAN_STATUS.BATAL]: "mdi-close-circle",
  };

  return canonicalStatus ? iconMap[canonicalStatus] : "mdi-help-circle";
}
