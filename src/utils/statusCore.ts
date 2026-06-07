import { BADGE_BASE_CLASS, badgeVariants } from "./badgeVariants";

// Daftar status servis yang dipakai konsisten di frontend.
export const PEMESANAN_STATUS = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  DIKERJAKAN: "Dikerjakan",
  SELESAI: "Selesai",
  BATAL: "Batal",
} as const;

// Mapping status ke tampilan badge dan label.
export const STATUS_MAP = {
  [PEMESANAN_STATUS.MENUNGGU]: {
    badge: badgeVariants.status.menunggu,
    label: "Menunggu",
  },
  [PEMESANAN_STATUS.DIKONFIRMASI]: {
    badge: badgeVariants.status.dikonfirmasi,
    label: "Dikonfirmasi",
  },
  [PEMESANAN_STATUS.DIKERJAKAN]: {
    badge: badgeVariants.status.dikerjakan,
    label: "Dikerjakan",
  },
  [PEMESANAN_STATUS.SELESAI]: {
    badge: badgeVariants.status.selesai,
    label: "Selesai",
  },
  [PEMESANAN_STATUS.BATAL]: {
    badge: badgeVariants.status.batal,
    label: "Batal",
  },
};

// Status valid adalah key dari STATUS_MAP.
export type PemesananStatus = keyof typeof STATUS_MAP;
// Filter status pemesanan bisa "semua" atau salah satu status valid.
export type PemesananStatusFilter = "semua" | PemesananStatus;
// Filter khusus halaman mekanik memakai value lowercase.
export type MekanikStatusFilter =
  | "semua"
  | "menunggu"
  | "dikonfirmasi"
  | "dikerjakan";

// Opsi dropdown filter status untuk halaman admin/pelanggan.
export const PEMESANAN_STATUS_FILTER_OPTIONS: Array<{
  value: PemesananStatusFilter;
  label: string;
}> = [
  { value: "semua", label: "Semua Status" },
  { value: PEMESANAN_STATUS.MENUNGGU, label: "Menunggu" },
  { value: PEMESANAN_STATUS.DIKONFIRMASI, label: "Dikonfirmasi" },
  { value: PEMESANAN_STATUS.DIKERJAKAN, label: "Dikerjakan" },
  { value: PEMESANAN_STATUS.SELESAI, label: "Selesai" },
  { value: PEMESANAN_STATUS.BATAL, label: "Batal" },
];

// Opsi dropdown filter status untuk halaman mekanik.
export const MEKANIK_STATUS_FILTER_OPTIONS: Array<{
  value: MekanikStatusFilter;
  label: string;
}> = [
  { value: "semua", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dikerjakan", label: "Dikerjakan" },
];

// Class dasar badge status, digabung dengan warna dari STATUS_MAP.
export const STATUS_BADGE_BASE_CLASS =
  BADGE_BASE_CLASS;

// Mengubah string status dari backend menjadi status canonical frontend.
export function toPemesananStatus(
  status: string | null | undefined,
): PemesananStatus | null {
  if (!status) {
    return null;
  }

  // Lowercase supaya "selesai" dan "Selesai" tetap dianggap sama.
  const normalizedStatus = status.toLowerCase();
  const validStatus = (Object.values(PEMESANAN_STATUS) as PemesananStatus[]).find(
    (item) => item.toLowerCase() === normalizedStatus,
  );

  // Jika cocok, return versi resmi dari PEMESANAN_STATUS.
  if (validStatus) {
    return validStatus;
  }

  // null berarti status tidak dikenali.
  return null;
}

// Mengecek apakah status pemesanan cocok dengan filter yang dipilih.
export function matchesPemesananStatusFilter(
  status: string | null | undefined,
  filter: PemesananStatusFilter | string,
): boolean {
  // "semua" dan "all" berarti tidak memfilter status.
  if (filter === "semua" || filter === "all") {
    return true;
  }

  // Bandingkan status setelah dinormalisasi.
  const canonicalStatus = toPemesananStatus(status);
  return canonicalStatus === filter;
}

// Mengubah filter mekanik lowercase menjadi status resmi pemesanan.
export function mapMekanikFilterToPemesananStatus(
  filter: MekanikStatusFilter | string,
): PemesananStatus | null {
  switch (filter) {
    case "menunggu":
      return PEMESANAN_STATUS.MENUNGGU;
    case "dikonfirmasi":
      return PEMESANAN_STATUS.DIKONFIRMASI;
    case "dikerjakan":
      return PEMESANAN_STATUS.DIKERJAKAN;
    default:
      return null;
  }
}
