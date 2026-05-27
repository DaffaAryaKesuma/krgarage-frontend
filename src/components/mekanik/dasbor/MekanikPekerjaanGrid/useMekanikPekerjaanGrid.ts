import { formatDateShort, formatTimeShort } from "@/utils/date";
import {
  canMekanikAddSukuCadang,
  canMekanikUpdateStatus,
  getMekanikAksiButtonText,
  getStatusBadgeClass,
  getStatusLabel,
  isStatusSelesai,
} from "@/utils/statusBadge";
import type { MekanikPemesanan } from "@/types/pemesanan";

export interface MekanikPekerjaanGridProps {
  pemesanan: MekanikPemesanan[];
  loading: boolean;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export const MEKANIK_PEKERJAAN_GRID_DEFAULTS = {
  emptyIcon: "mdi mdi-clipboard-text-off",
  emptyTitle: "Tidak ada pekerjaan",
  emptyMessage: "Tidak ada pekerjaan saat ini.",
  loadingMessage: "Memuat data...",
};

export function useMekanikPekerjaanGrid() {
  return {
    formatDateShort,
    formatTimeShort,
    canMekanikAddSukuCadang,
    canMekanikUpdateStatus,
    getMekanikAksiButtonText,
    getStatusBadgeClass,
    getStatusLabel,
    isStatusSelesai,
  };
}
