// Key tab yang tersedia pada halaman keuangan pemilik.
export type PemilikKeuanganTabKey = "ringkasan" | "pemasukan" | "pengeluaran";

// Struktur satu tab.
export interface PemilikKeuanganTab {
  key: PemilikKeuanganTabKey;
  label: string;
  icon: string;
}

// Daftar tab dibuat konstan agar template tinggal melakukan v-for.
export const PEMILIK_KEUANGAN_TABS: PemilikKeuanganTab[] = [
  { key: "ringkasan", label: "Ringkasan", icon: "mdi-view-dashboard-outline" },
  { key: "pemasukan", label: "Pemasukan", icon: "mdi-cash-plus" },
  { key: "pengeluaran", label: "Pengeluaran", icon: "mdi-cash-minus" },
];
