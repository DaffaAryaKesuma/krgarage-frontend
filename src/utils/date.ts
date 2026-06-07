/**
 * Format tanggal ke format singkat
 * Format: Kam, 1 Jan 2026
 */
export function formatDateShort(
  date: string | Date | null | undefined
): string {
  // Jika data kosong, tampilkan teks aman.
  if (!date) return "Belum ditentukan";

  // Jika input string, ubah dulu menjadi Date.
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validasi date.
  if (isNaN(dateObj.getTime())) {
    return "Format tanggal tidak valid";
  }

  // Format mengikuti bahasa Indonesia.
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
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

  // Jika sudah dalam format HH:MM, return langsung.
  if (typeof time === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return time.substring(0, 5); // Ambil HH:MM saja
  }

  // Jika Date object atau string date, parse dan format.
  const dateObj = typeof time === "string" ? new Date(time) : time;

  // Validasi date.
  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  // hour12 false agar hasilnya 24 jam.
  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Format tanggal dan jam singkat.
 * Format: Kamis, 4 Juni 2026, 14.30
 */
export function formatDateTimeShort(
  dateTime: string | Date | null | undefined
): string {
  if (!dateTime) return "-";

  // Terima string timestamp atau object Date.
  const dateObj = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  // replace titik menjadi titik dua agar format jam konsisten seperti 14:30.
  return `${formatDateShort(dateObj)}, ${formatTimeShort(dateObj).replace(/\./g, ":")}`;
}
