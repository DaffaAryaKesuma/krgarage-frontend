import { API_URL } from "@/utils/api";

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
 * @param imagePath - Path to image (e.g., "services/image.jpg")
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

  const baseUrl = apiUrl || API_URL;
  const storageUrl = baseUrl.replace(/\/api\/?$/, "");

  return `${storageUrl}/storage/${imagePath}`;
}
