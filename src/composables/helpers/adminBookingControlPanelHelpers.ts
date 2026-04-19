import { BOOKING_STATUS } from "@/utils/statusBadge";
import { PAYMENT_STATUS } from "@/utils/paymentStatus";

export interface Mekanik {
  id: number;
  nama: string;
  email: string;
}

export type BookingActionType = "confirm" | "complete" | "cancel" | "markPaid";

export interface ActionConfirmationConfig {
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "warning" | "info" | "success";
  requestType: "status" | "payment";
  value: string;
  successMessage: string;
}

export const ACTION_CONFIG: Record<
  BookingActionType,
  ActionConfirmationConfig
> = {
  confirm: {
    title: "Konfirmasi Pemesanan",
    message: "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
    confirmText: "Ya, Konfirmasi",
    variant: "info",
    requestType: "status",
    value: BOOKING_STATUS.CONFIRMED,
    successMessage: "Pemesanan berhasil dikonfirmasi!",
  },
  complete: {
    title: "Selesaikan Pemesanan",
    message: "Apakah Anda yakin ingin menandai servis ini telah selesai?",
    confirmText: "Ya, Selesaikan",
    variant: "success",
    requestType: "status",
    value: BOOKING_STATUS.COMPLETED,
    successMessage: "Pemesanan berhasil diselesaikan!",
  },
  cancel: {
    title: "Batalkan Pemesanan",
    message: "Apakah Anda yakin ingin membatalkan pemesanan ini?",
    confirmText: "Ya, Batalkan",
    variant: "danger",
    requestType: "status",
    value: BOOKING_STATUS.CANCELLED,
    successMessage: "Pemesanan berhasil dibatalkan!",
  },
  markPaid: {
    title: "Tandai Pembayaran Lunas",
    message: "Apakah Anda yakin pembayaran untuk pemesanan ini sudah lunas?",
    confirmText: "Ya, Tandai Lunas",
    variant: "success",
    requestType: "payment",
    value: PAYMENT_STATUS.PAID,
    successMessage: "Status pembayaran berhasil diperbarui menjadi lunas!",
  },
};

export const CANCEL_BUTTON_CLASS =
  "w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition font-semibold";
