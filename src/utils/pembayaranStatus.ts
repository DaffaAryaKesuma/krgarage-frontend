export const PEMBAYARAN_STATUS = {
  UNPAID: "Belum Lunas",
  PAID: "Lunas",
} as const;

export type PembayaranStatus =
  (typeof PEMBAYARAN_STATUS)[keyof typeof PEMBAYARAN_STATUS];

export type PembayaranStatusFilter = "all" | PembayaranStatus;

const PEMBAYARAN_STATUS_BADGE_MAP: Record<PembayaranStatus, string> = {
  [PEMBAYARAN_STATUS.UNPAID]: "bg-gray-100 text-gray-700",
  [PEMBAYARAN_STATUS.PAID]: "bg-emerald-100 text-emerald-700",
};

export const PEMBAYARAN_STATUS_FILTER_OPTIONS: Array<{
  value: PembayaranStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua Pembayaran" },
  { value: PEMBAYARAN_STATUS.UNPAID, label: "Belum Lunas" },
  { value: PEMBAYARAN_STATUS.PAID, label: "Lunas" },
];

export const PEMBAYARAN_STATUS_BADGE_BASE_CLASS =
  "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold";

export function isPaidStatus(status: string | null | undefined): boolean {
  return status === PEMBAYARAN_STATUS.PAID;
}

export function isUnpaidStatus(status: string | null | undefined): boolean {
  // Null/undefined dianggap belum lunas
  if (!status) return true;
  return status === PEMBAYARAN_STATUS.UNPAID;
}

export function matchesPembayaranStatusFilter(
  status: string | null | undefined,
  filter: PembayaranStatusFilter | string,
): boolean {
  if (filter === "all") {
    return true;
  }

  return status === filter;
}

export function getPembayaranStatusLabel(
  status: string | null | undefined,
): string {
  return status || PEMBAYARAN_STATUS.UNPAID;
}

export function getPembayaranStatusBadge(
  status: string | null | undefined,
): string {
  if (status === PEMBAYARAN_STATUS.PAID) {
    return PEMBAYARAN_STATUS_BADGE_MAP[PEMBAYARAN_STATUS.PAID];
  }
  if (status === PEMBAYARAN_STATUS.UNPAID) {
    return PEMBAYARAN_STATUS_BADGE_MAP[PEMBAYARAN_STATUS.UNPAID];
  }
  return "bg-gray-100 text-gray-700";
}

export function getPembayaranStatusBadgeClass(
  status: string | null | undefined,
): string {
  return `${PEMBAYARAN_STATUS_BADGE_BASE_CLASS} ${getPembayaranStatusBadge(status)}`;
}
