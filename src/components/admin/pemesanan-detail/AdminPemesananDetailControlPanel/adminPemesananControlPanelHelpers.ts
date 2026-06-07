import { PEMESANAN_STATUS } from "@/utils/statusBadge";
import { PEMBAYARAN_STATUS } from "@/utils/pembayaranStatus";
import { getButtonClass, getFullWidthButtonClass } from "@/utils/buttonVariants";

// Bentuk data mekanik yang dibutuhkan panel kontrol.
export interface Mekanik {
  id: number;
  nama: string;
  email: string;
}

// Jenis aksi yang bisa dikonfirmasi dari panel kontrol.
export type PemesananAksiType = "confirm" | "complete" | "cancel" | "markPaid";

// Bentuk konfigurasi modal konfirmasi untuk satu aksi.
export interface AksiConfirmationConfig {
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "warning" | "info" | "success";
  requestType: "status" | "pembayaran";
  value: string;
  successMessage: string;
}

// Konfigurasi semua aksi supaya judul, pesan, status target, dan pesan sukses konsisten.
export const AKSI_CONFIG: Record<PemesananAksiType, AksiConfirmationConfig> = {
  confirm: {
    title: "Konfirmasi Pemesanan",
    message: "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
    confirmText: "Ya, Konfirmasi",
    variant: "info",
    requestType: "status",
    value: PEMESANAN_STATUS.DIKONFIRMASI,
    successMessage: "Pemesanan berhasil dikonfirmasi!",
  },
  complete: {
    title: "Tandai Selesai",
    message: "Apakah Anda yakin ingin menandai servis ini telah selesai?",
    confirmText: "Ya, Selesaikan",
    variant: "success",
    requestType: "status",
    value: PEMESANAN_STATUS.SELESAI,
    successMessage: "Pemesanan berhasil diselesaikan!",
  },
  cancel: {
    title: "Batalkan Pemesanan",
    message: "Apakah Anda yakin ingin membatalkan pemesanan ini?",
    confirmText: "Ya, Batalkan",
    variant: "danger",
    requestType: "status",
    value: PEMESANAN_STATUS.BATAL,
    successMessage: "Pemesanan berhasil dibatalkan!",
  },
  markPaid: {
    title: "Tandai Pembayaran Lunas",
    message: "Apakah Anda yakin pembayaran untuk pemesanan ini sudah lunas?",
    confirmText: "Ya, Tandai Lunas",
    variant: "success",
    requestType: "pembayaran",
    value: PEMBAYARAN_STATUS.PAID,
    successMessage: "Status pembayaran berhasil diperbarui menjadi lunas!",
  },
};

// Class tombol dibangun di helper agar template panel lebih ringkas.
export const CANCEL_BUTTON_CLASS =
  getFullWidthButtonClass("dangerOutline", "md");

export const CONFIRM_BUTTON_CLASS =
  getFullWidthButtonClass("infoOutline", "md");

export const COMPLETE_BUTTON_CLASS =
  getFullWidthButtonClass("successOutline", "md");

export const MARK_PAID_BUTTON_CLASS = getButtonClass(
  "success",
  "sm",
  "text-xs",
);
