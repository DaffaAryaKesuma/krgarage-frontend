export const PEMESANAN_STATUS = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Batal",
} as const;

export const STATUS_MAP = {
  [PEMESANAN_STATUS.PENDING]: {
    badge: "bg-yellow-100 text-yellow-800",
    label: "Menunggu",
  },
  [PEMESANAN_STATUS.CONFIRMED]: {
    badge: "bg-blue-100 text-blue-800",
    label: "Dikonfirmasi",
  },
  [PEMESANAN_STATUS.IN_PROGRESS]: {
    badge: "bg-purple-100 text-purple-800",
    label: "Dikerjakan",
  },
  [PEMESANAN_STATUS.COMPLETED]: {
    badge: "bg-green-100 text-green-800",
    label: "Selesai",
  },
  [PEMESANAN_STATUS.CANCELLED]: {
    badge: "bg-red-100 text-red-800",
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

const NORMALIZED_STATUS_TO_CANONICAL: Record<string, PemesananStatus> = {
  // Nilai Indonesia (canonical)
  menunggu: PEMESANAN_STATUS.PENDING,
  dikonfirmasi: PEMESANAN_STATUS.CONFIRMED,
  dikerjakan: PEMESANAN_STATUS.IN_PROGRESS,
  selesai: PEMESANAN_STATUS.COMPLETED,
  batal: PEMESANAN_STATUS.CANCELLED,
};

export const PEMESANAN_STATUS_FILTER_OPTIONS: Array<{
  value: PemesananStatusFilter;
  label: string;
}> = [
  { value: "semua", label: "Semua Status" },
  { value: PEMESANAN_STATUS.PENDING, label: "Menunggu" },
  { value: PEMESANAN_STATUS.CONFIRMED, label: "Dikonfirmasi" },
  { value: PEMESANAN_STATUS.IN_PROGRESS, label: "Dikerjakan" },
  { value: PEMESANAN_STATUS.COMPLETED, label: "Selesai" },
  { value: PEMESANAN_STATUS.CANCELLED, label: "Batal" },
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
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

export function toPemesananStatus(
  status: string | null | undefined,
): PemesananStatus | null {
  const normalized = (status || "").trim().toLowerCase();
  return NORMALIZED_STATUS_TO_CANONICAL[normalized] || null;
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
      return PEMESANAN_STATUS.PENDING;
    case "dikonfirmasi":
      return PEMESANAN_STATUS.CONFIRMED;
    case "dikerjakan":
      return PEMESANAN_STATUS.IN_PROGRESS;
    default:
      return null;
  }
}
