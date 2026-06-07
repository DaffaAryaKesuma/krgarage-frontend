import { ref } from "vue";

// Bentuk satu toast/notifikasi.
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

// Singleton state: semua komponen memakai daftar toast yang sama.
const toasts = ref<Toast[]>([]);
// Id naik terus agar setiap toast punya key unik.
let nextId = 1;

// Composable toast global.
export function useToast() {
  // Menambahkan toast baru ke daftar.
  function addToast(
    message: string,
    type: Toast["type"] = "info",
    duration = 3000
  ) {
    const id = nextId++;
    const toast = { id, message, type, duration };
    toasts.value.push(toast);

    // Tidak auto-remove di sini; ToastNotification yang mengatur durasi tampil.
  }

  // Menghapus toast berdasarkan id.
  function removeToast(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  // Shortcut toast sukses.
  function success(message: string, duration = 3000) {
    addToast(message, "success", duration);
  }

  // Shortcut toast error, durasi lebih lama agar sempat dibaca.
  function error(message: string, duration = 5000) {
    addToast(message, "error", duration);
  }

  // Shortcut toast peringatan.
  function warning(message: string, duration = 4000) {
    addToast(message, "warning", duration);
  }

  // Shortcut toast info.
  function info(message: string, duration = 3000) {
    addToast(message, "info", duration);
  }

  // Return state dan function agar bisa dipakai komponen.
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
