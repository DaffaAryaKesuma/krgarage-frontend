import { BADGE_BASE_CLASS, badgeVariants } from "./badgeVariants";

export const PEMESANAN_STATUS = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  DIKERJAKAN: "Dikerjakan",
  SELESAI: "Selesai",
  BATAL: "Batal",
} as const;

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

export type PemesananStatus = keyof typeof STATUS_MAP;
export type PemesananStatusFilter = "semua" | PemesananStatus;
export type MekanikStatusFilter =
  | "semua"
  | "menunggu"
  | "dikonfirmasi"
  | "dikerjakan";

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

export const MEKANIK_STATUS_FILTER_OPTIONS: Array<{
  value: MekanikStatusFilter;
  label: string;
}> = [
  { value: "semua", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dikerjakan", label: "Dikerjakan" },
];

export const STATUS_BADGE_BASE_CLASS =
  BADGE_BASE_CLASS;

export function toPemesananStatus(
  status: string | null | undefined,
): PemesananStatus | null {
  if (!status) {
    return null;
  }

  const normalizedStatus = status.toLowerCase();
  const validStatus = (Object.values(PEMESANAN_STATUS) as PemesananStatus[]).find(
    (item) => item.toLowerCase() === normalizedStatus,
  );

  if (validStatus) {
    return validStatus;
  }

  return null;
}

export function matchesPemesananStatusFilter(
  status: string | null | undefined,
  filter: PemesananStatusFilter | string,
): boolean {
  if (filter === "semua" || filter === "all") {
    return true;
  }

  const canonicalStatus = toPemesananStatus(status);
  return canonicalStatus === filter;
}

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
