// Metadata pagination dari response API Laravel.
export interface ApiPagination {
  // Halaman yang sedang aktif.
  current_page: number;
  // Halaman terakhir.
  last_page: number;
  // Jumlah data per halaman.
  per_page: number;
  // Total seluruh data.
  total: number;
  // Nomor data pertama pada halaman aktif.
  from: number;
  // Nomor data terakhir pada halaman aktif.
  to: number;
}
