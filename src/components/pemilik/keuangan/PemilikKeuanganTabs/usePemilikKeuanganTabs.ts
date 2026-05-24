export type PemilikKeuanganTabKey = "ringkasan" | "pemasukan" | "pengeluaran";

export interface PemilikKeuanganTab {
  key: PemilikKeuanganTabKey;
  label: string;
  icon: string;
}

export const PEMILIK_KEUANGAN_TABS: PemilikKeuanganTab[] = [
  { key: "ringkasan", label: "Ringkasan", icon: "mdi-view-dashboard-outline" },
  { key: "pemasukan", label: "Pemasukan", icon: "mdi-cash-plus" },
  { key: "pengeluaran", label: "Pengeluaran", icon: "mdi-cash-minus" },
];
