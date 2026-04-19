import {
  BOOKING_STATUS,
  STATUS_BADGE_BASE_CLASS,
  STATUS_MAP,
  normalizeBookingStatus,
  toBookingStatus,
  type BookingStatus,
} from "./statusCore";

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

export function canPelangganCancelBooking(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status);
}

export function canAdminCancelBooking(
  status: string | null | undefined,
): boolean {
  return canPelangganCancelBooking(status);
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

export function canMekanikUpdateStatus(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status) || isInProgressStatus(status);
}

export function canMekanikAddSparepart(
  status: string | null | undefined,
): boolean {
  return isInProgressStatus(status);
}

export function getMekanikActionButtonText(
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

export function getMekanikActionButtonClass(
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

export function getMekanikNextStatus(
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

export function getStatusBadge(status: string | null): string {
  const canonicalStatus = toBookingStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.badge : null) ||
    "bg-gray-100 text-gray-800"
  );
}

export function getStatusBadgeClass(status: string | null): string {
  return `${STATUS_BADGE_BASE_CLASS} ${getStatusBadge(status)}`;
}

export function getStatusLabel(status: string | null): string {
  const canonicalStatus = toBookingStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.label : null) ||
    status ||
    "Tidak Diketahui"
  );
}

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
