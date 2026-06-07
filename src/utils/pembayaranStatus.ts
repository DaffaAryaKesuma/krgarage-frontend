import { BADGE_BASE_CLASS, badgeVariants } from "./badgeVariants";

// Daftar status pembayaran yang dipakai sistem.
export const PEMBAYARAN_STATUS = {
  UNPAID: "Belum Lunas",
  PAID: "Lunas",
} as const;

// Type union dari value PEMBAYARAN_STATUS, yaitu "Belum Lunas" atau "Lunas".
export type PembayaranStatus =
  (typeof PEMBAYARAN_STATUS)[keyof typeof PEMBAYARAN_STATUS];

// Filter pembayaran bisa semua atau salah satu status pembayaran.
export type PembayaranStatusFilter = "all" | PembayaranStatus;

// Mapping status pembayaran ke warna badge.
const PEMBAYARAN_STATUS_BADGE_MAP: Record<PembayaranStatus, string> = {
  [PEMBAYARAN_STATUS.UNPAID]: badgeVariants.payment.belumLunas,
  [PEMBAYARAN_STATUS.PAID]: badgeVariants.payment.lunas,
};

// Opsi dropdown filter pembayaran.
export const PEMBAYARAN_STATUS_FILTER_OPTIONS: Array<{
  value: PembayaranStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua Pembayaran" },
  { value: PEMBAYARAN_STATUS.UNPAID, label: "Belum Lunas" },
  { value: PEMBAYARAN_STATUS.PAID, label: "Lunas" },
];

// Class dasar badge pembayaran.
export const PEMBAYARAN_STATUS_BADGE_BASE_CLASS =
  BADGE_BASE_CLASS;

// Mengecek apakah status adalah Lunas.
export function isPaidStatus(status: string | null | undefined): boolean {
  return status === PEMBAYARAN_STATUS.PAID;
}

// Mengecek apakah status dianggap Belum Lunas.
export function isUnpaidStatus(status: string | null | undefined): boolean {
  // Null/undefined dianggap belum lunas.
  if (!status) return true;
  return status === PEMBAYARAN_STATUS.UNPAID;
}

// Mengecek apakah status pembayaran cocok dengan filter.
export function matchesPembayaranStatusFilter(
  status: string | null | undefined,
  filter: PembayaranStatusFilter | string,
): boolean {
  // "all" berarti tampilkan semua status pembayaran.
  if (filter === "all") {
    return true;
  }

  return status === filter;
}

// Mengambil label status pembayaran, fallback ke Belum Lunas.
export function getPembayaranStatusLabel(
  status: string | null | undefined,
): string {
  return status || PEMBAYARAN_STATUS.UNPAID;
}

// Mengambil class warna badge pembayaran.
export function getPembayaranStatusBadge(
  status: string | null | undefined,
): string {
  // Status lunas pakai warna lunas.
  if (status === PEMBAYARAN_STATUS.PAID) {
    return PEMBAYARAN_STATUS_BADGE_MAP[PEMBAYARAN_STATUS.PAID];
  }
  // Status belum lunas pakai warna belum lunas.
  if (status === PEMBAYARAN_STATUS.UNPAID) {
    return PEMBAYARAN_STATUS_BADGE_MAP[PEMBAYARAN_STATUS.UNPAID];
  }
  // Status tidak dikenali dianggap belum lunas agar aman.
  return badgeVariants.payment.belumLunas;
}

// Menggabungkan class dasar badge dengan class warna pembayaran.
export function getPembayaranStatusBadgeClass(
  status: string | null | undefined,
): string {
  return `${PEMBAYARAN_STATUS_BADGE_BASE_CLASS} ${getPembayaranStatusBadge(status)}`;
}
