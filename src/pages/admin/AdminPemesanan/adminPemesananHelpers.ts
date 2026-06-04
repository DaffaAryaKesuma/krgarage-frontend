// Helper ini dipakai untuk memisahkan logic filter dari composable halaman.
import type { Pemesanan } from "@/types/pemesanan";
import type { PemesananStatusFilter } from "@/utils/statusBadge";
import type { PembayaranStatusFilter } from "@/utils/pembayaranStatus";
import { matchesPemesananStatusFilter } from "@/utils/statusBadge";
import { matchesPembayaranStatusFilter } from "@/utils/pembayaranStatus";

// Bentuk semua filter yang aktif di halaman pemesanan admin.
export interface AdminPemesananFilterState {
  query: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: PemesananStatusFilter;
  pembayaranFilter: PembayaranStatusFilter;
  todayOnly: boolean;
}

// Mengecek apakah satu pemesanan cocok dengan seluruh filter.
export function matchesAdminPemesananFilters(
  pemesanan: Pemesanan,
  filters: AdminPemesananFilterState,
): boolean {
  // Filter status servis, misalnya Menunggu/Dikerjakan/Selesai/Batal.
  if (!matchesPemesananStatusFilter(pemesanan.status, filters.statusFilter)) {
    return false;
  }

  // Filter status pembayaran, misalnya Lunas atau Belum Lunas.
  if (
    !matchesPembayaranStatusFilter(
      pemesanan.status_pembayaran,
      filters.pembayaranFilter,
    )
  ) {
    return false;
  }

  // Filter bulan/tahun berdasarkan tanggal pemesanan.
  if (filters.monthFilter || filters.yearFilter) {
    const pemesananDate = new Date(pemesanan.tanggal_pemesanan);
    // getMonth() dimulai dari 0, jadi perlu +1.
    const pemesananMonth = String(pemesananDate.getMonth() + 1).padStart(2, "0");
    const pemesananYear = pemesananDate.getFullYear().toString();

    // Jika filter bulan aktif dan tidak cocok, item disembunyikan.
    if (filters.monthFilter && pemesananMonth !== filters.monthFilter) {
      return false;
    }

    // Jika filter tahun aktif dan tidak cocok, item disembunyikan.
    if (filters.yearFilter && pemesananYear !== filters.yearFilter) {
      return false;
    }
  }

  // Filter khusus untuk hanya menampilkan pemesanan hari ini.
  if (filters.todayOnly) {
    const today = new Date().toISOString().split("T")[0];
    const pemesananDate = pemesanan.tanggal_pemesanan.split("T")[0];

    // Jika tanggal pemesanan bukan hari ini, item disembunyikan.
    if (pemesananDate !== today) {
      return false;
    }
  }

  // Query pencarian dibuat lowercase agar tidak sensitif huruf besar/kecil.
  const normalizedQuery = filters.query.trim().toLowerCase();
  // Jika query kosong, item lolos setelah filter di atas.
  if (!normalizedQuery) return true;

  // Pencarian mencocokkan nama pelanggan, model Vespa, atau plat nomor.
  return (
    pemesanan.pengguna?.nama.toLowerCase().includes(normalizedQuery) ||
    pemesanan.vespa?.model.toLowerCase().includes(normalizedQuery) ||
    pemesanan.vespa?.plat_nomor.toLowerCase().includes(normalizedQuery)
  );
}
