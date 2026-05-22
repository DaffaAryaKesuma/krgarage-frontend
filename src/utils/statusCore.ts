export const PEMESANAN_STATUS = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  DIKERJAKAN: "Dikerjakan",
  SELESAI: "Selesai",
  BATAL: "batal",
} as const;

export const STATUS_MAP = {
  [PEMESANAN_STATUS.MENUNGGU]: {
    badge: "bg-gray-100 text-gray-700",
    label: "Menunggu",
  },
  [PEMESANAN_STATUS.DIKONFIRMASI]: {
    badge: "bg-blue-100 text-blue-700",
    label: "Dikonfirmasi",
  },
  [PEMESANAN_STATUS.DIKERJAKAN]: {
    badge: "bg-amber-100 text-amber-700",
    label: "Dikerjakan",
  },
  [PEMESANAN_STATUS.SELESAI]: {
    badge: "bg-emerald-100 text-emerald-700",
    label: "Selesai",
  },
  [PEMESANAN_STATUS.BATAL]: {
    badge: "bg-red-100 text-red-700",
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
  "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold";

export function toPemesananStatus(
  status: string | null | undefined,
): PemesananStatus | null {
  const validStatuses = Object.values(PEMESANAN_STATUS) as string[];
  if (status && validStatuses.includes(status)) {
    return status as PemesananStatus;
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
