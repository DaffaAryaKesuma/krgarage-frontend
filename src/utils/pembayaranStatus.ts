export const PEMBAYARAN_STATUS = {
  UNPAID: "Belum Lunas",
  PAID: "Lunas",
} as const;

export type PembayaranStatus =
  (typeof PEMBAYARAN_STATUS)[keyof typeof PEMBAYARAN_STATUS];

export type PembayaranStatusFilter = "all" | PembayaranStatus;

const NORMALIZED_PEMBAYARAN_STATUS_TO_CANONICAL: Record<string, PembayaranStatus> = {
  "belum lunas": PEMBAYARAN_STATUS.UNPAID,
  unpaid: PEMBAYARAN_STATUS.UNPAID,
  lunas: PEMBAYARAN_STATUS.PAID,
  paid: PEMBAYARAN_STATUS.PAID,
};

const PEMBAYARAN_STATUS_BADGE_MAP: Record<PembayaranStatus, string> = {
  [PEMBAYARAN_STATUS.UNPAID]: "bg-amber-100 text-amber-800",
  [PEMBAYARAN_STATUS.PAID]: "bg-emerald-100 text-emerald-800",
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
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

export function normalizePembayaranStatus(
  status: string | null | undefined,
): string {
  return (status || "").trim().toLowerCase();
}

export function toPembayaranStatus(
  status: string | null | undefined,
): PembayaranStatus | null {
  const normalized = normalizePembayaranStatus(status);
  return NORMALIZED_PEMBAYARAN_STATUS_TO_CANONICAL[normalized] || null;
}

export function isPaidStatus(status: string | null | undefined): boolean {
  return toPembayaranStatus(status) === PEMBAYARAN_STATUS.PAID;
}

export function isUnpaidStatus(status: string | null | undefined): boolean {
  // Null/undefined dianggap belum lunas
  if (!status) return true;
  return toPembayaranStatus(status) === PEMBAYARAN_STATUS.UNPAID;
}

export function matchesPembayaranStatusFilter(
  status: string | null | undefined,
  filter: PembayaranStatusFilter | string,
): boolean {
  if (filter === "all") {
    return true;
  }

  return toPembayaranStatus(status) === filter;
}

export function getPembayaranStatusLabel(
  status: string | null | undefined,
): string {
  const canonicalStatus = toPembayaranStatus(status);
  return canonicalStatus || status || PEMBAYARAN_STATUS.UNPAID;
}

export function getPembayaranStatusBadge(
  status: string | null | undefined,
): string {
  const canonicalStatus = toPembayaranStatus(status);
  return canonicalStatus
    ? PEMBAYARAN_STATUS_BADGE_MAP[canonicalStatus]
    : "bg-gray-100 text-gray-700";
}

export function getPembayaranStatusBadgeClass(
  status: string | null | undefined,
): string {
  return `${PEMBAYARAN_STATUS_BADGE_BASE_CLASS} ${getPembayaranStatusBadge(status)}`;
}
