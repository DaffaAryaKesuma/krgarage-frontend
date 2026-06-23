/**
 * Utility untuk handle API errors dengan konsisten di seluruh aplikasi
 */

export interface ApiError {
  code?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string | string[]>;
    };
  };
  message?: string;
}

/**
 * Parse error response dari API dan return user-friendly message
 * @param error Error object dari axios
 * @returns Error message yang bisa ditampilkan ke user
 */
export function handleApiError(error: any): string {
  // Validation error (422), biasanya dari Laravel validation.
  if (error.response?.status === 422 && error.response?.data?.errors) {
    // Pesan backend sudah menyebut nama field secara ramah, jadi tidak perlu
    // ditambahi key database seperti "no_telepon:" atau "id_layanan:".
    const messages = Object.values(error.response.data.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(
        (message): message is string =>
          typeof message === "string" && message.trim() !== "",
      )
      .map((message) => message.trim());

    // Hindari pesan sama tampil dua kali, misalnya pada layanan duplikat.
    return [...new Set(messages)].join("\n");
  }

  // Server error (500), berarti masalah terjadi di backend.
  if (error.response?.status === 500) {
    return "Server error. Ada masalah di backend.";
  }

  // Unauthorized (401), biasanya token habis atau tidak valid.
  if (error.response?.status === 401) {
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string" && backendMessage.trim() !== "") {
      return backendMessage;
    }
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }

  // Forbidden (403), user login tetapi rolenya tidak boleh akses.
  if (error.response?.status === 403) {
    return "Anda tidak memiliki akses untuk melakukan aksi ini.";
  }

  // Not found (404), data/endpoint tidak ditemukan.
  if (error.response?.status === 404) {
    return "Data tidak ditemukan.";
  }

  // Rate limit (429), terlalu banyak request dalam waktu singkat.
  if (error.response?.status === 429) {
    return "Terlalu banyak request. Silakan tunggu beberapa saat.";
  }

  // Jika backend mengirim message khusus, gunakan message itu.
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Network error biasanya backend belum running atau URL salah.
  if (error.code === "ERR_NETWORK") {
    return "Koneksi gagal - pastikan backend sudah dijalankan (php artisan serve)";
  }

  // Timeout berarti request terlalu lama tidak mendapat response.
  if (error.code === "ECONNABORTED") {
    return "Request timeout - server terlalu lambat atau tidak merespons";
  }

  // Connection refused biasanya server backend mati.
  if (error.message?.includes("ECONNREFUSED")) {
    return "Tidak bisa terhubung ke server. Pastikan backend sudah running.";
  }

  // Fallback terakhir jika jenis error tidak dikenali.
  return "Terjadi kesalahan. Silakan coba lagi atau hubungi support.";
}

/**
 * Log error ke console untuk debugging (development only)
 */
export function logError(error: any, context?: string): void {
  // Log hanya muncul saat development agar production tidak terlalu berisik.
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : "[API Error]";
    console.error(prefix, error);
  }
}
