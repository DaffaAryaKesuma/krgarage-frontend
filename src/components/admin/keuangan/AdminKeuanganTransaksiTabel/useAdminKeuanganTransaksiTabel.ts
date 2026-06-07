import { computed, ref, watch } from "vue";
// Helper angka uang aman.
import { toMoneyNumber } from "@/utils/money";
import {
  TABLE_BODY_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
  buildTableHeaderCellClass,
} from "@/utils/tableVariants";
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

// Jumlah transaksi per halaman pada tabel frontend.
const ITEMS_PER_PAGE = 10;

// Header tabel transaksi.
export const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Suku Cadang",
  "Total",
];

// Class tabel dan wrapper transaksi.
export const TABLE_WRAPPER_CLASS_WITH_MARGIN = `mb-8 ${TABLE_WRAPPER_CLASS}`;

export const TABLE_COLUMN_WIDTHS = ["16%", "12%", "12%", "24%", "24%", "12%"];

export const TABLE_CLASS = buildFixedTableClass("min-w-full");

export const TABLE_HEADER_CELL_CLASS =
  buildTableHeaderCellClass("text-gray-900");

// Composable logic tabel transaksi keuangan.
export function useAdminKeuanganTransaksiTabel(
  getPemesanan: () => KeuanganPemesanan[],
) {
  // Halaman aktif pagination frontend.
  const currentPage = ref(1);

  // Total halaman berdasarkan jumlah transaksi.
  const totalPages = computed(() =>
    Math.ceil(getPemesanan().length / ITEMS_PER_PAGE),
  );

  // Data transaksi yang tampil di halaman saat ini.
  const paginatedPemesanan = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return getPemesanan().slice(start, start + ITEMS_PER_PAGE);
  });

  // Index awal data yang sedang ditampilkan.
  const from = computed(() => {
    if (getPemesanan().length === 0) return 0;
    return (currentPage.value - 1) * ITEMS_PER_PAGE + 1;
  });

  // Index akhir data yang sedang ditampilkan.
  const to = computed(() =>
    getPemesanan().length === 0
      ? 0
      : Math.min(currentPage.value * ITEMS_PER_PAGE, getPemesanan().length),
  );

  // Ubah halaman pagination.
  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  // Jika jumlah data berubah karena filter, kembali ke halaman 1.
  watch(
    () => getPemesanan().length,
    () => { currentPage.value = 1; },
  );

  // Hitung subtotal layanan dari harga pivot.
  const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.reduce(
      (sum, s) => sum + toMoneyNumber(s.pivot.harga_saat_pesan || 0),
      0,
    );

  // Ambil nama layanan untuk ditampilkan.
  const getPemesananLayanan = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.map((s) => s.nama_layanan);

  // Ambil nama item suku cadang dan jumlahnya.
  const getPemesananItems = (items?: KeuanganPemesanan["item_pemesanan"]) =>
    items?.length
      ? items.map(
          (item) =>
            `${item.nama_suku_cadang_saat_ini || item.suku_cadang?.nama_suku_cadang || "Suku Cadang"} (x${item.jumlah})`,
        )
      : [];

  // Total mengutamakan total_harga, fallback subtotal layanan.
  const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
    Number(pemesanan.total_harga) || calculateLayananTotal(pemesanan.layanan);

  // State dan helper yang dipakai tabel transaksi.
  return {
    currentPage,
    totalPages,
    paginatedPemesanan,
    from,
    to,
    handlePageChange,
    getPemesananLayanan,
    getPemesananItems,
    getPemesananTotal,
    ITEMS_PER_PAGE,
  };
}
