// computed dipakai untuk pagination lokal.
import { computed } from "vue";
// Helper memastikan nilai uang menjadi number.
import { toMoneyNumber } from "@/utils/money";
// Tipe data pemesanan untuk laporan keuangan.
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

// Props tabel pemasukan pemilik.
export interface PemilikKeuanganTableProps {
  pemesanan: KeuanganPemesanan[];
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

// Header tabel pemasukan.
export const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Plat Nomor",
  "Total Biaya",
  "Status",
  "Pembayaran",
];

// Composable untuk pagination dan helper field tabel pemasukan.
export function usePemilikKeuanganTable(
  props: PemilikKeuanganTableProps,
  emit: (e: "update:currentPage", value: number) => void,
) {
  // Total halaman berdasarkan jumlah data dan item per halaman.
  const totalPages = computed(() =>
    Math.ceil(props.pemesanan.length / props.itemsPerPage),
  );

  // Nomor data pertama di halaman aktif.
  const from = computed(() => {
    if (props.pemesanan.length === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
  });

  // Nomor data terakhir di halaman aktif.
  const to = computed(() => {
    if (props.pemesanan.length === 0) return 0;
    return Math.min(
      props.currentPage * props.itemsPerPage,
      props.pemesanan.length,
    );
  });

  // Data yang ditampilkan sesuai halaman aktif.
  const paginatedPemesanan = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.pemesanan.slice(start, end);
  });

  // Mengirim halaman baru ke parent.
  const handlePageChange = (page: number) => {
    emit("update:currentPage", page);
  };

  // Tanggal pemasukan diprioritaskan dari paid_at, lalu updated_at, lalu tanggal pemesanan.
  const getPemesananDate = (pemesanan: KeuanganPemesanan) =>
    pemesanan.paid_at || pemesanan.updated_at || pemesanan.tanggal_pemesanan || "";

  // Plat nomor fallback '-' jika relasi Vespa tidak ada.
  const getPemesananPlateNumber = (pemesanan: KeuanganPemesanan) =>
    pemesanan.vespa?.plat_nomor || "-";

  // Status fallback Selesai untuk transaksi keuangan lama.
  const getPemesananStatus = (pemesanan: KeuanganPemesanan) =>
    pemesanan.status || "Selesai";

  // Hitung total layanan dari pivot jika total_harga kosong.
  const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
    layanan.reduce(
      (total, itemLayanan) =>
        total + toMoneyNumber(itemLayanan.pivot.harga_saat_pesan || 0),
      0,
    );

  // Total pemasukan memakai total_harga, fallback ke total layanan.
  const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
    pemesanan.total_harga || calculateLayananTotal(pemesanan.layanan);

  // Nilai dan helper yang dipakai komponen tabel.
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
