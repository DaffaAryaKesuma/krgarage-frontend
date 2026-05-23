import { computed, ref, watch } from "vue";
import { toMoneyNumber } from "@/utils/money";
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

const ITEMS_PER_PAGE = 10;

export const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Suku Cadang",
  "Total",
];

export const TABLE_WRAPPER_CLASS =
  "mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

export const TABLE_CLASS = "min-w-full table-fixed divide-y divide-gray-200";

export const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-900 sm:px-6 " +
  "[&:nth-child(1)]:w-[16%] [&:nth-child(2)]:w-[12%] [&:nth-child(3)]:w-[12%] [&:nth-child(4)]:w-[24%] [&:nth-child(5)]:w-[24%] [&:nth-child(6)]:w-[12%]";

export const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

export const TABLE_MOBILE_KARTU_CLASS = "space-y-4 bg-gray-50 p-4";

export function useAdminKeuanganTransaksiTabel(
  getPemesanan: () => KeuanganPemesanan[],
) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.ceil(getPemesanan().length / ITEMS_PER_PAGE),
  );

  const paginatedPemesanan = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return getPemesanan().slice(start, start + ITEMS_PER_PAGE);
  });

  const from = computed(() => {
    if (getPemesanan().length === 0) return 0;
    return (currentPage.value - 1) * ITEMS_PER_PAGE + 1;
  });

  const to = computed(() =>
    getPemesanan().length === 0
      ? 0
      : Math.min(currentPage.value * ITEMS_PER_PAGE, getPemesanan().length),
  );

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  watch(
    () => getPemesanan().length,
    () => { currentPage.value = 1; },
  );

  const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.reduce(
      (sum, s) => sum + toMoneyNumber(s.pivot.harga_saat_pesan || 0),
      0,
    );

  const getPemesananLayanan = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.map((s) => s.nama_layanan);

  const getPemesananItems = (items?: KeuanganPemesanan["item_pemesanan"]) =>
    items?.length
      ? items.map(
          (item) =>
            `${item.nama_suku_cadang_saat_ini || item.suku_cadang?.nama_suku_cadang || "Suku Cadang"} (x${item.jumlah})`,
        )
      : [];

  const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
    Number(pemesanan.total_harga) || calculateLayananTotal(pemesanan.layanan);

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
