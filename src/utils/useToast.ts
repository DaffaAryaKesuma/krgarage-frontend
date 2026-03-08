import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

// Singleton state - shared across all components
const toasts = ref<Toast[]>([]);
let nextId = 1;

export function useToast() {
  function addToast(
    message: string,
    type: Toast["type"] = "info",
    duration = 3000
  ) {
    const id = nextId++;
    const toast = { id, message, type, duration };
    toasts.value.push(toast);

    // Don't auto-remove here - let ToastNotification handle it
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  function success(message: string, duration = 3000) {
    addToast(message, "success", duration);
  }

  function error(message: string, duration = 5000) {
    addToast(message, "error", duration);
  }

  function warning(message: string, duration = 4000) {
    addToast(message, "warning", duration);
  }

  function info(message: string, duration = 3000) {
    addToast(message, "info", duration);
  }

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
