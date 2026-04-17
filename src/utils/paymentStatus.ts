export const PAYMENT_STATUS = {
  UNPAID: "Belum Lunas",
  PAID: "Lunas",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type PaymentStatusFilter = "all" | PaymentStatus;

const NORMALIZED_PAYMENT_STATUS_TO_CANONICAL: Record<string, PaymentStatus> = {
  "belum lunas": PAYMENT_STATUS.UNPAID,
  unpaid: PAYMENT_STATUS.UNPAID,
  lunas: PAYMENT_STATUS.PAID,
  paid: PAYMENT_STATUS.PAID,
};

const PAYMENT_STATUS_BADGE_MAP: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.UNPAID]: "bg-amber-100 text-amber-800",
  [PAYMENT_STATUS.PAID]: "bg-emerald-100 text-emerald-800",
};

export const PAYMENT_STATUS_FILTER_OPTIONS: Array<{
  value: PaymentStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Semua Pembayaran" },
  { value: PAYMENT_STATUS.UNPAID, label: "Belum Lunas" },
  { value: PAYMENT_STATUS.PAID, label: "Lunas" },
];

export const PAYMENT_STATUS_BADGE_BASE_CLASS =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

export function normalizePaymentStatus(
  status: string | null | undefined,
): string {
  return (status || "").trim().toLowerCase();
}

export function toPaymentStatus(
  status: string | null | undefined,
): PaymentStatus | null {
  const normalized = normalizePaymentStatus(status);
  return NORMALIZED_PAYMENT_STATUS_TO_CANONICAL[normalized] || null;
}

export function isPaidStatus(status: string | null | undefined): boolean {
  return toPaymentStatus(status) === PAYMENT_STATUS.PAID;
}

export function isUnpaidStatus(status: string | null | undefined): boolean {
  return toPaymentStatus(status) === PAYMENT_STATUS.UNPAID;
}

export function matchesPaymentStatusFilter(
  status: string | null | undefined,
  filter: PaymentStatusFilter | string,
): boolean {
  if (filter === "all") {
    return true;
  }

  return toPaymentStatus(status) === filter;
}

export function getPaymentStatusLabel(
  status: string | null | undefined,
): string {
  const canonicalStatus = toPaymentStatus(status);
  return canonicalStatus || status || PAYMENT_STATUS.UNPAID;
}

export function getPaymentStatusBadge(
  status: string | null | undefined,
): string {
  const canonicalStatus = toPaymentStatus(status);
  return canonicalStatus
    ? PAYMENT_STATUS_BADGE_MAP[canonicalStatus]
    : "bg-gray-100 text-gray-700";
}

export function getPaymentStatusBadgeClass(
  status: string | null | undefined,
): string {
  return `${PAYMENT_STATUS_BADGE_BASE_CLASS} ${getPaymentStatusBadge(status)}`;
}
