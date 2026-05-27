import { computed } from "vue";
import type { RiwayatRestokSukuCadang } from "@/types/inventaris";

export interface PemilikKeuanganPengeluaranRestokTableProps {
  pengeluaran: RiwayatRestokSukuCadang[];
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

export const TABLE_HEADERS = [
  "Tanggal",
  "Suku Cadang",
  "Jumlah",
  "Harga/Unit",
  "Total",
  "Stok",
  "Admin",
];

export function usePemilikKeuanganPengeluaranRestokTable(
  props: PemilikKeuanganPengeluaranRestokTableProps,
) {
  const totalPages = computed(() =>
    Math.ceil(props.pengeluaran.length / props.itemsPerPage),
  );

  const from = computed(() => {
    if (props.pengeluaran.length === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
  });

  const to = computed(() => {
    if (props.pengeluaran.length === 0) return 0;
    return Math.min(
      props.currentPage * props.itemsPerPage,
      props.pengeluaran.length,
    );
  });

  const paginatedPengeluaran = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    return props.pengeluaran.slice(start, start + props.itemsPerPage);
  });

  return {
    totalPages,
    from,
    to,
    paginatedPengeluaran,
  };
}
