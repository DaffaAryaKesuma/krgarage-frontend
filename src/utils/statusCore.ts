export const BOOKING_STATUS = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "batal",
} as const;

export const STATUS_MAP = {
  [BOOKING_STATUS.PENDING]: {
    badge: "bg-yellow-100 text-yellow-800",
    label: "Menunggu",
  },
  [BOOKING_STATUS.CONFIRMED]: {
    badge: "bg-blue-100 text-blue-800",
    label: "Dikonfirmasi",
  },
  [BOOKING_STATUS.IN_PROGRESS]: {
    badge: "bg-purple-100 text-purple-800",
    label: "Dikerjakan",
  },
  [BOOKING_STATUS.COMPLETED]: {
    badge: "bg-green-100 text-green-800",
    label: "Selesai",
  },
  [BOOKING_STATUS.CANCELLED]: {
    badge: "bg-red-100 text-red-800",
    label: "Batal",
  },
};

export type BookingStatus = keyof typeof STATUS_MAP;
export type BookingStatusFilter = "all" | BookingStatus;
export type MekanikStatusFilter =
  | "all"
  | "menunggu"
  | "dikonfirmasi"
  | "dikerjakan";

const NORMALIZED_STATUS_TO_CANONICAL: Record<string, BookingStatus> = {
  // Nilai Indonesia (canonical)
  menunggu: BOOKING_STATUS.PENDING,
  dikonfirmasi: BOOKING_STATUS.CONFIRMED,
  dikerjakan: BOOKING_STATUS.IN_PROGRESS,
  selesai: BOOKING_STATUS.COMPLETED,
  batal: BOOKING_STATUS.CANCELLED,
  // Legacy / fallback nilai lama
  diproses: BOOKING_STATUS.IN_PROGRESS,
  dibatalkan: BOOKING_STATUS.CANCELLED,
  pending: BOOKING_STATUS.PENDING,
  confirmed: BOOKING_STATUS.CONFIRMED,
  "in progress": BOOKING_STATUS.IN_PROGRESS,
  in_progress: BOOKING_STATUS.IN_PROGRESS,
  completed: BOOKING_STATUS.COMPLETED,
  cancelled: BOOKING_STATUS.CANCELLED,
  canceled: BOOKING_STATUS.CANCELLED,
};

export const BOOKING_STATUS_FILTER_OPTIONS: Array<{
  value: BookingStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua Status" },
  { value: BOOKING_STATUS.PENDING, label: "Menunggu" },
  { value: BOOKING_STATUS.CONFIRMED, label: "Dikonfirmasi" },
  { value: BOOKING_STATUS.IN_PROGRESS, label: "Dikerjakan" },
  { value: BOOKING_STATUS.COMPLETED, label: "Selesai" },
  { value: BOOKING_STATUS.CANCELLED, label: "Batal" },
];

export const MEKANIK_STATUS_FILTER_OPTIONS: Array<{
  value: MekanikStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dikerjakan", label: "Dikerjakan" },
];

export const STATUS_BADGE_BASE_CLASS =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

export function normalizeBookingStatus(
  status: string | null | undefined,
): string {
  return (status || "").trim().toLowerCase();
}

export function toBookingStatus(
  status: string | null | undefined,
): BookingStatus | null {
  const normalized = normalizeBookingStatus(status);
  return NORMALIZED_STATUS_TO_CANONICAL[normalized] || null;
}

export function matchesBookingStatusFilter(
  status: string | null | undefined,
  filter: BookingStatusFilter | string,
): boolean {
  if (filter === "all") {
    return true;
  }

  const canonicalStatus = toBookingStatus(status);
  return canonicalStatus === filter;
}

export function mapMekanikFilterToBookingStatus(
  filter: MekanikStatusFilter | string,
): BookingStatus | null {
  switch (filter) {
    case "menunggu":
    case "pending":
      return BOOKING_STATUS.PENDING;
    case "dikonfirmasi":
    case "confirmed":
      return BOOKING_STATUS.CONFIRMED;
    case "dikerjakan":
    case "diproses":
    case "in_progress":
      return BOOKING_STATUS.IN_PROGRESS;
    default:
      return null;
  }
}
