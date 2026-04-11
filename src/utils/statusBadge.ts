/**
 * Status badge and label mapping
 */
export const BOOKING_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
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
export type MechanicStatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "in_progress";

const NORMALIZED_STATUS_TO_CANONICAL: Record<string, BookingStatus> = {
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

export const MECHANIC_STATUS_FILTER_OPTIONS: Array<{
  value: MechanicStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "in_progress", label: "Dikerjakan" },
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

export function mapMechanicFilterToBookingStatus(
  filter: MechanicStatusFilter,
): BookingStatus | null {
  switch (filter) {
    case "pending":
      return BOOKING_STATUS.PENDING;
    case "confirmed":
      return BOOKING_STATUS.CONFIRMED;
    case "in_progress":
      return BOOKING_STATUS.IN_PROGRESS;
    default:
      return null;
  }
}

export function isPendingStatus(status: string | null | undefined): boolean {
  return normalizeBookingStatus(status) === "pending";
}

export function isConfirmedStatus(status: string | null | undefined): boolean {
  return normalizeBookingStatus(status) === "confirmed";
}

export function isCancelledStatus(status: string | null | undefined): boolean {
  const normalized = normalizeBookingStatus(status);
  return normalized === "cancelled" || normalized === "canceled";
}

export function isPendingOrConfirmedStatus(
  status: string | null | undefined,
): boolean {
  return isPendingStatus(status) || isConfirmedStatus(status);
}

export function isInProgressStatus(status: string | null | undefined): boolean {
  const normalized = normalizeBookingStatus(status);
  return normalized === "in progress" || normalized === "in_progress";
}

export function isCompletedStatus(status: string | null | undefined): boolean {
  return normalizeBookingStatus(status) === "completed";
}

export function isCompletedOrCancelledStatus(
  status: string | null | undefined,
): boolean {
  return isCompletedStatus(status) || isCancelledStatus(status);
}

export function canCustomerCancelBooking(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status);
}

export function canAdminCancelBooking(
  status: string | null | undefined,
): boolean {
  return canCustomerCancelBooking(status);
}

export function canAdminConfirmBooking(
  status: string | null | undefined,
): boolean {
  return isPendingStatus(status);
}

export function canAdminAssignAndStart(
  status: string | null | undefined,
): boolean {
  return isConfirmedStatus(status);
}

export function canAdminCompleteBooking(
  status: string | null | undefined,
): boolean {
  return isInProgressStatus(status);
}

export function canMechanicUpdateStatus(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status) || isInProgressStatus(status);
}

export function canMechanicAddSparepart(
  status: string | null | undefined,
): boolean {
  return isInProgressStatus(status);
}

export function getMechanicActionButtonText(
  status: string | null | undefined,
): string {
  if (isPendingOrConfirmedStatus(status)) {
    return "Mulai Pekerjaan";
  }
  if (isInProgressStatus(status)) {
    return "Selesaikan Pekerjaan";
  }
  return "";
}

export function getMechanicActionButtonClass(
  status: string | null | undefined,
): string {
  if (isPendingOrConfirmedStatus(status)) {
    return "bg-blue-600 hover:bg-blue-700";
  }
  if (isInProgressStatus(status)) {
    return "bg-green-600 hover:bg-green-700";
  }
  return "";
}

export function getMechanicNextStatus(
  currentStatus: string | null | undefined,
): BookingStatus | null {
  if (isPendingOrConfirmedStatus(currentStatus)) {
    return BOOKING_STATUS.IN_PROGRESS;
  }
  if (isInProgressStatus(currentStatus)) {
    return BOOKING_STATUS.COMPLETED;
  }
  return null;
}

/**
 * Get badge classes for status
 */
export function getStatusBadge(status: string | null): string {
  const canonicalStatus = toBookingStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.badge : null) ||
    "bg-gray-100 text-gray-800"
  );
}

/**
 * Get full class list for status badge
 */
export function getStatusBadgeClass(status: string | null): string {
  return `${STATUS_BADGE_BASE_CLASS} ${getStatusBadge(status)}`;
}

/**
 * Get label for status
 */
export function getStatusLabel(status: string | null): string {
  const canonicalStatus = toBookingStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.label : null) ||
    status ||
    "Tidak Diketahui"
  );
}

/**
 * Get icon for status
 */
export function getStatusIcon(status: string | null): string {
  const canonicalStatus = toBookingStatus(status);
  const iconMap: Record<BookingStatus, string> = {
    [BOOKING_STATUS.PENDING]: "mdi-clock-outline",
    [BOOKING_STATUS.CONFIRMED]: "mdi-check-circle",
    [BOOKING_STATUS.IN_PROGRESS]: "mdi-cog",
    [BOOKING_STATUS.COMPLETED]: "mdi-check-all",
    [BOOKING_STATUS.CANCELLED]: "mdi-close-circle",
  };
  return canonicalStatus ? iconMap[canonicalStatus] : "mdi-help-circle";
}
