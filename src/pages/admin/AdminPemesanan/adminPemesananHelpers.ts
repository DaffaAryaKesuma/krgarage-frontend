import type { Pemesanan } from "@/types/pemesanan";
import type { PemesananStatusFilter } from "@/utils/statusBadge";
import type { PembayaranStatusFilter } from "@/utils/pembayaranStatus";
import { matchesPemesananStatusFilter } from "@/utils/statusBadge";
import { matchesPembayaranStatusFilter } from "@/utils/pembayaranStatus";

export interface AdminPemesananFilterState {
  query: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: PemesananStatusFilter;
  pembayaranFilter: PembayaranStatusFilter;
  todayOnly: boolean;
}

export function matchesAdminPemesananFilters(
  pemesanan: Pemesanan,
  filters: AdminPemesananFilterState,
): boolean {
  if (!matchesPemesananStatusFilter(pemesanan.status, filters.statusFilter)) {
    return false;
  }

  if (
    !matchesPembayaranStatusFilter(
      pemesanan.status_pembayaran,
      filters.pembayaranFilter,
    )
  ) {
    return false;
  }

  if (filters.monthFilter || filters.yearFilter) {
    const pemesananDate = new Date(pemesanan.tanggal_pemesanan);
    const pemesananMonth = String(pemesananDate.getMonth() + 1).padStart(2, "0");
    const pemesananYear = pemesananDate.getFullYear().toString();

    if (filters.monthFilter && pemesananMonth !== filters.monthFilter) {
      return false;
    }

    if (filters.yearFilter && pemesananYear !== filters.yearFilter) {
      return false;
    }
  }

  if (filters.todayOnly) {
    const today = new Date().toISOString().split("T")[0];
    const pemesananDate = pemesanan.tanggal_pemesanan.split("T")[0];

    if (pemesananDate !== today) {
      return false;
    }
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return (
    pemesanan.pengguna?.nama.toLowerCase().includes(normalizedQuery) ||
    pemesanan.vespa?.model.toLowerCase().includes(normalizedQuery) ||
    pemesanan.vespa?.plat_nomor.toLowerCase().includes(normalizedQuery)
  );
}
