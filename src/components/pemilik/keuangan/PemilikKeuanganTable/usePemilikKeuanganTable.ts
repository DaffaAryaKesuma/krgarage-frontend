import { computed } from "vue";
import { toMoneyNumber } from "@/utils/money";
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

export interface PemilikKeuanganTableProps {
  pemesanan: KeuanganPemesanan[];
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

export const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Plat Nomor",
  "Total Biaya",
  "Status",
  "Pembayaran",
];

export function usePemilikKeuanganTable(
  props: PemilikKeuanganTableProps,
  emit: (e: "update:currentPage", value: number) => void,
) {
  const totalPages = computed(() =>
    Math.ceil(props.pemesanan.length / props.itemsPerPage),
  );

  const from = computed(() => {
    if (props.pemesanan.length === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
  });

  const to = computed(() => {
    if (props.pemesanan.length === 0) return 0;
    return Math.min(
      props.currentPage * props.itemsPerPage,
      props.pemesanan.length,
    );
  });

  const paginatedPemesanan = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.pemesanan.slice(start, end);
  });

  const handlePageChange = (page: number) => {
    emit("update:currentPage", page);
  };

  const getPemesananDate = (pemesanan: KeuanganPemesanan) =>
    pemesanan.paid_at || pemesanan.updated_at || pemesanan.tanggal_pemesanan || "";

  const getPemesananPlateNumber = (pemesanan: KeuanganPemesanan) =>
    pemesanan.vespa?.plat_nomor || "-";

  const getPemesananStatus = (pemesanan: KeuanganPemesanan) =>
    pemesanan.status || "Selesai";

  const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.reduce(
      (total, itemLayanan) =>
        total + toMoneyNumber(itemLayanan.pivot.harga_saat_pesan || 0),
      0,
    );

  const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
    pemesanan.total_harga || calculateLayananTotal(pemesanan.layanan);

  return {
    totalPages,
    from,
    to,
    paginatedPemesanan,
    handlePageChange,
    getPemesananDate,
    getPemesananPlateNumber,
    getPemesananStatus,
    getPemesananTotal,
  };
}
