// Format angka menjadi mata uang Rupiah tanpa angka desimal.
export const toIDR = (n: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(toMoneyNumber(n));

// Mengubah input apa pun menjadi number aman untuk perhitungan uang.
export const toMoneyNumber = (value: unknown): number => {
  const parsed = Number(value);
  // Jika hasil parse bukan angka valid, fallback ke 0.
  return Number.isFinite(parsed) ? parsed : 0;
};
