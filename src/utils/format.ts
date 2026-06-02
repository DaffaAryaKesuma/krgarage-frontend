import { STORAGE_URL } from "@/utils/api";

/**
 * Format waktu dalam menit ke format yang lebih readable
 * @param minutes - Jumlah menit
 * @returns String format waktu (contoh: "2j 30m", "45 menit")
 */
export function formatWaktu(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return "N/A";

  if (minutes < 60) {
    return `${minutes} menit`;
  }

  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;

  if (menit > 0) {
    return `${jam}j ${menit}m`;
  }

  return `${jam} jam`;
}

/**
 * Get full URL for image stored in backend storage
 * @param imagePath - Path to image (e.g., "layanan/image.jpg")
 * @param apiUrl - API base URL (optional, defaults to VITE_API_URL)
 * @returns Full URL to image or placeholder
 */
export function getImageUrl(
  imagePath: string | null | undefined,
  apiUrl?: string,
): string {
  if (!imagePath) {
    return "https://placehold.co/600x400?text=No+Image";
  }

  const normalizedPath = imagePath.trim();

  if (/^(https?:|data:|blob:)/i.test(normalizedPath)) {
    return normalizedPath;
  }

  const storageUrl = apiUrl
    ? `${apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "")}/storage`
    : STORAGE_URL.replace(/\/$/, "");

  const pathWithoutStoragePrefix = normalizedPath
    .replace(/^\/+/, "")
    .replace(/^storage\/+/, "");

  return `${storageUrl}/${pathWithoutStoragePrefix}`;
}

/**
 * Format nama pengguna agar rapi (Title Case)
 * @param nama - Nama yang akan diformat
 * @returns Nama dengan huruf kapital di awal setiap kata
 */
export function formatNama(nama: string | null | undefined): string {
  if (!nama) return "-";

  return nama
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format plat nomor agar konsisten ditampilkan dalam huruf kapital.
 * @param platNomor - Plat nomor kendaraan
 * @returns Plat nomor uppercase atau "-"
 */
export function formatPlatNomor(platNomor: string | null | undefined): string {
  if (!platNomor) return "-";

  return platNomor.trim().replace(/\s+/g, " ").toUpperCase();
}

/**
 * Format tanggal menjadi format lokal YYYY-MM-DD
 * @param date - Objek Date yang akan diformat
 * @returns String format tanggal YYYY-MM-DD
 */
export function toLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
