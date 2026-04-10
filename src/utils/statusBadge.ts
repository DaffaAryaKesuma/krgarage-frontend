/**
 * Status badge and label mapping
 */
export const STATUS_MAP = {
  Pending: { badge: "bg-yellow-100 text-yellow-800", label: "Menunggu" },
  Confirmed: { badge: "bg-blue-100 text-blue-800", label: "Dikonfirmasi" },
  "In Progress": {
    badge: "bg-purple-100 text-purple-800",
    label: "Dikerjakan",
  },
  Completed: { badge: "bg-green-100 text-green-800", label: "Selesai" },
  Cancelled: { badge: "bg-red-100 text-red-800", label: "Batal" },
};

export const STATUS_BADGE_BASE_CLASS =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

/**
 * Get badge classes for status
 */
export function getStatusBadge(status: string | null): string {
  return (
    STATUS_MAP[status as keyof typeof STATUS_MAP]?.badge ||
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
  return (
    STATUS_MAP[status as keyof typeof STATUS_MAP]?.label ||
    status ||
    "Tidak Diketahui"
  );
}

/**
 * Get icon for status
 */
export function getStatusIcon(status: string | null): string {
  const iconMap: { [key: string]: string } = {
    Pending: "mdi-clock-outline",
    Confirmed: "mdi-check-circle",
    "In Progress": "mdi-cog",
    Completed: "mdi-check-all",
    Cancelled: "mdi-close-circle",
  };
  return iconMap[status as string] || "mdi-help-circle";
}
