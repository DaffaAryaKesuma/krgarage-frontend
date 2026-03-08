/**
 * Format tanggal ke format singkat
 * Format: Kam, 1 Jan 2026
 */
export function formatDateShort(
  date: string | Date | null | undefined
): string {
  if (!date) return "Belum ditentukan";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validasi date
  if (isNaN(dateObj.getTime())) {
    return "Format tanggal tidak valid";
  }

  return dateObj.toLocaleDateString("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format waktu ke format singkat
 * Format: HH:MM
 */
export function formatTimeShort(
  time: string | Date | null | undefined
): string {
  if (!time) return "-";

  // Jika sudah dalam format HH:MM, return langsung
  if (typeof time === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return time.substring(0, 5); // Ambil HH:MM saja
  }

  // Jika Date object atau string date, parse dan format
  const dateObj = typeof time === "string" ? new Date(time) : time;

  // Validasi date
  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
