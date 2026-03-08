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
  // Validation error (422)
  if (error.response?.status === 422 && error.response?.data?.errors) {
    return Object.entries(error.response.data.errors)
      .map(([key, value]: [string, any]) => {
        const fieldName = key.replace(/_/g, " ");
        const errorMsg = Array.isArray(value) ? value[0] : value;
        return `${fieldName}: ${errorMsg}`;
      })
      .join("\n");
  }

  // Server error (500)
  if (error.response?.status === 500) {
    return "Server error - ada masalah di backend. Hubungi administrator.";
  }

  // Unauthorized (401)
  if (error.response?.status === 401) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }

  // Forbidden (403)
  if (error.response?.status === 403) {
    return "Anda tidak memiliki akses untuk melakukan aksi ini.";
  }

  // Not found (404)
  if (error.response?.status === 404) {
    return "Data tidak ditemukan.";
  }

  // Rate limit (429)
  if (error.response?.status === 429) {
    return "Terlalu banyak request. Silakan tunggu beberapa saat.";
  }

  // Backend error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Network error
  if (error.code === "ERR_NETWORK") {
    return "Koneksi gagal - pastikan backend sudah dijalankan (php artisan serve)";
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    return "Request timeout - server terlalu lambat atau tidak merespons";
  }

  // Connection refused
  if (error.message?.includes("ECONNREFUSED")) {
    return "Tidak bisa terhubung ke server. Pastikan backend sudah running.";
  }

  // Default error message
  return "Terjadi kesalahan. Silakan coba lagi atau hubungi support.";
}

/**
 * Log error ke console untuk debugging (development only)
 */
export function logError(error: any, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    const prefix = context ? `[${context}]` : "[API Error]";
    console.error(prefix, error);
  }
}
