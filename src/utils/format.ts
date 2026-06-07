import { API_BASE_URL, STORAGE_URL } from "@/utils/api";

/**
 * Format waktu dalam menit ke format yang lebih readable
 * @param minutes - Jumlah menit
 * @returns String format waktu (contoh: "2j 30m", "45 menit")
 */
export function formatWaktu(minutes: number | null | undefined): string {
  // Jika durasi kosong atau 0, tampilkan N/A.
  if (!minutes || minutes === 0) return "N/A";

  // Durasi di bawah 1 jam cukup ditampilkan sebagai menit.
  if (minutes < 60) {
    return `${minutes} menit`;
  }

  // Bagi menit menjadi jam dan sisa menit.
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;

  // Jika ada sisa menit, tampilkan format gabungan.
  if (menit > 0) {
    return `${jam}j ${menit}m`;
  }

  // Jika pas kelipatan 60, tampilkan jam saja.
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
  // Jika tidak ada gambar, tampilkan placeholder.
  if (!imagePath) {
    return "https://placehold.co/600x400?text=No+Image";
  }

  // Bersihkan spasi kiri/kanan.
  const normalizedPath = imagePath.trim();

  // Jika path sudah berupa URL penuh/data/blob, langsung pakai apa adanya.
  if (/^(https?:|data:|blob:)/i.test(normalizedPath)) {
    return normalizedPath;
  }

  // Jika apiUrl dikirim manual, buat URL storage dari situ.
  const storageUrl = apiUrl
    ? `${apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "")}/storage`
    : STORAGE_URL.replace(/\/$/, "");

  // Hilangkan awalan / atau storage/ agar path tidak dobel.
  const pathWithoutStoragePrefix = normalizedPath
    .replace(/^\/+/, "")
    .replace(/^storage\/+/, "");

  // Beberapa gambar lama mungkin tersimpan di folder services langsung dari base URL.
  if (pathWithoutStoragePrefix.startsWith("services/")) {
    return `${API_BASE_URL.replace(/\/$/, "")}/${pathWithoutStoragePrefix}`;
  }

  // Default gambar diambil dari URL storage Laravel.
  return `${storageUrl}/${pathWithoutStoragePrefix}`;
}

/**
 * Format nama pengguna agar rapi (Title Case)
 * @param nama - Nama yang akan diformat
 * @returns Nama dengan huruf kapital di awal setiap kata
 */
export function formatNama(nama: string | null | undefined): string {
  if (!nama) return "-";

  // Ubah ke Title Case sederhana, contoh: "daffa bagus".
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

  // Rapikan spasi lalu ubah semua huruf menjadi kapital.
  return platNomor.trim().replace(/\s+/g, " ").toUpperCase();
}

/**
 * Format tanggal menjadi format lokal YYYY-MM-DD
 * @param date - Objek Date yang akan diformat
 * @returns String format tanggal YYYY-MM-DD
 */
export function toLocalISOString(date: Date): string {
  // Ambil bagian tanggal dari timezone lokal, bukan UTC.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
