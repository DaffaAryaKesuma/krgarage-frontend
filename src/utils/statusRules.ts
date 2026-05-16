import {
  PEMESANAN_STATUS,
  STATUS_BADGE_BASE_CLASS,
  STATUS_MAP,
  toPemesananStatus,
  type PemesananStatus,
} from "./statusCore";

export function isStatusMenunggu(status: string | null | undefined): boolean {
  return status?.toLowerCase() === "menunggu";
}

export function isStatusDikonfirmasi(status: string | null | undefined): boolean {
  return status?.toLowerCase() === "dikonfirmasi";
}

export function isStatusBatal(status: string | null | undefined): boolean {
  const s = status?.toLowerCase();
  return s === "batal" || s === "dibatalkan";
}

export function isStatusDikerjakan(status: string | null | undefined): boolean {
  const s = status?.toLowerCase();
  return s === "dikerjakan" || s === "diproses";
}

export function isStatusSelesai(status: string | null | undefined): boolean {
  return status?.toLowerCase() === "selesai";
}

export function isPendingOrConfirmedStatus(
  status: string | null | undefined,
): boolean {
  return isStatusMenunggu(status) || isStatusDikonfirmasi(status);
}

export function isCompletedOrCancelledStatus(
  status: string | null | undefined,
): boolean {
  return isStatusSelesai(status) || isStatusBatal(status);
}

export function canPelangganCancelPemesanan(
  status: string | null | undefined,
): boolean {
  return isPendingOrConfirmedStatus(status);
}

export function canAdminCancelPemesanan(
  status: string | null | undefined,
): boolean {
  return canPelangganCancelPemesanan(status);
}

export function canAdminConfirmPemesanan(
  status: string | null | undefined,
): boolean {
  return isStatusMenunggu(status);
}

export function canAdminAssignAndStart(
  status: string | null | undefined,
): boolean {
  return isStatusDikonfirmasi(status);
}

export function canAdminCompletePemesanan(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

export function canMekanikUpdateStatus(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

export function canMekanikAddSukuCadang(
  status: string | null | undefined,
): boolean {
  return isStatusDikerjakan(status);
}

export function getMekanikAksiButtonText(
  status: string | null | undefined,
): string {
  if (isStatusDikerjakan(status)) {
    return "Selesaikan Pekerjaan";
  }
  return "";
}

export function getMekanikAksiButtonClass(
  status: string | null | undefined,
): string {
  if (isStatusDikerjakan(status)) {
    return "bg-green-600 hover:bg-green-700";
  }
  return "";
}

export function getMekanikNextStatus(
  currentStatus: string | null | undefined,
): PemesananStatus | null {
  if (isStatusDikerjakan(currentStatus)) {
    return PEMESANAN_STATUS.COMPLETED;
  }
  return null;
}

export function getStatusBadge(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.badge : null) ||
    "bg-gray-100 text-gray-800"
  );
}

export function getStatusBadgeClass(status: string | null): string {
  return `${STATUS_BADGE_BASE_CLASS} ${getStatusBadge(status)}`;
}

export function getStatusLabel(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  return (
    (canonicalStatus ? STATUS_MAP[canonicalStatus]?.label : null) ||
    status ||
    "Tidak Diketahui"
  );
}

export function getStatusIcon(status: string | null): string {
  const canonicalStatus = toPemesananStatus(status);
  const iconMap: Record<PemesananStatus, string> = {
    [PEMESANAN_STATUS.PENDING]: "mdi-clock-outline",
    [PEMESANAN_STATUS.CONFIRMED]: "mdi-check-circle",
    [PEMESANAN_STATUS.IN_PROGRESS]: "mdi-cog",
    [PEMESANAN_STATUS.COMPLETED]: "mdi-check-all",
    [PEMESANAN_STATUS.CANCELLED]: "mdi-close-circle",
  };

  return canonicalStatus ? iconMap[canonicalStatus] : "mdi-help-circle";
}
