// computed dipakai untuk pagination lokal.
import { computed } from "vue";
// Tipe riwayat restok suku cadang.
import type { RiwayatRestokSukuCadang } from "@/types/inventaris";

// Props tabel pengeluaran restok.
export interface PemilikKeuanganPengeluaranRestokTableProps {
  pengeluaran: RiwayatRestokSukuCadang[];
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

// Header tabel pengeluaran restok.
export const TABLE_HEADERS = [
  "Tanggal",
  "Suku Cadang",
  "Jumlah",
  "Harga/Unit",
  "Total",
  "Stok",
  "Admin",
  "Struk",
];

// Composable untuk pagination data pengeluaran restok.
export function usePemilikKeuanganPengeluaranRestokTable(
  props: PemilikKeuanganPengeluaranRestokTableProps,
) {
  // Total halaman berdasarkan jumlah pengeluaran dan item per halaman.
  const totalPages = computed(() =>
    Math.ceil(props.pengeluaran.length / props.itemsPerPage),
  );

  // Nomor data pertama pada halaman aktif.
  const from = computed(() => {
    if (props.pengeluaran.length === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
  });

  // Nomor data terakhir pada halaman aktif.
  const to = computed(() => {
    if (props.pengeluaran.length === 0) return 0;
    return Math.min(
      props.currentPage * props.itemsPerPage,
      props.pengeluaran.length,
    );
  });

  // Data pengeluaran yang tampil di halaman aktif.
  const paginatedPengeluaran = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    return props.pengeluaran.slice(start, start + props.itemsPerPage);
  });

  // Nilai pagination dikembalikan ke komponen tabel.
  return {
    totalPages,
    from,
    to,
    paginatedPengeluaran,
  };
}
