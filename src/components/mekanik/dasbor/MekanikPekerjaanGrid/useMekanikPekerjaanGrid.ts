// Helper format tanggal dan waktu untuk kartu pekerjaan.
import { formatDateShort, formatDateTimeShort, formatTimeShort } from "@/utils/date";
// Helper aturan status dan tampilan badge/teks aksi mekanik.
import {
  canMekanikAddSukuCadang,
  canMekanikUpdateStatus,
  getMekanikAksiButtonText,
  getStatusBadgeClass,
  getStatusLabel,
  isStatusSelesai,
} from "@/utils/statusBadge";
// Tipe pemesanan yang ditampilkan ke mekanik.
import type { MekanikPemesanan } from "@/types/pemesanan";

// Props grid pekerjaan mekanik.
export interface MekanikPekerjaanGridProps {
  pemesanan: MekanikPemesanan[];
  loading: boolean;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

// Default teks empty/loading agar parent tidak wajib mengirim semuanya.
export const MEKANIK_PEKERJAAN_GRID_DEFAULTS = {
  emptyIcon: "mdi mdi-clipboard-text-off",
  emptyTitle: "Tidak ada pekerjaan",
  emptyMessage: "Tidak ada pekerjaan saat ini.",
  loadingMessage: "Memuat data...",
};

// Composable ini mengumpulkan helper yang dipakai template grid.
export function useMekanikPekerjaanGrid() {
  return {
    formatDateShort,
    formatDateTimeShort,
    formatTimeShort,
    canMekanikAddSukuCadang,
    canMekanikUpdateStatus,
    getMekanikAksiButtonText,
    getStatusBadgeClass,
    getStatusLabel,
    isStatusSelesai,
  };
}
