# Owner Portal - Fitur dan Endpoint

Dokumentasi singkat fitur pada halaman Owner (frontend) beserta endpoint API yang dipanggil.

---

**Navigasi / Layout**

- Menu Dashboard: akses ringkasan performa bengkel.
- Menu Laporan Keuangan: akses laporan pendapatan dan transaksi.
- Menu Analisa Inventory: akses analisa stok dan sparepart.
- User Info & Logout: menampilkan nama owner dan tombol logout.
- Mobile Menu: navigasi untuk tampilan mobile.

**Owner Dashboard (src/pages/owner/OwnerDashboard.vue)**

- Big Numbers: Omzet Hari Ini, Omzet Bulan Ini, Unit Masuk Hari Ini, Nilai Aset Stok.
- Status Operasional / Tim / Kepuasan: info singkat operasional.
- Recent Activity: tabel 5 booking terbaru hari ini.
- Status Badge pada booking untuk menampilkan status booking.

Endpoint yang dipanggil:

- GET /api/owner/stats -> data statistik (today_revenue, month_revenue, today_units, stock_value)
- GET /api/owner/recent-bookings -> daftar booking terbaru (biasanya dipotong 5 item di frontend)

**Laporan Keuangan (src/pages/owner/OwnerFinancial.vue)**

- Summary Cards: Total Pendapatan, Total Transaksi, Rata-rata Transaksi.
- Revenue Trend Chart: grafik pendapatan berdasarkan periode (hari/minggu/bulan).
- Periode Selector: tombol untuk memilih `today`, `week`, `month`.
- Transactions Table: daftar transaksi periode terpilih (tanggal, kode booking, customer, plat, total, status).

Endpoint yang dipanggil:

- GET /api/owner/revenue-trend?period={period} -> labels dan values untuk grafik pendapatan
- GET /api/owner/transactions?period={period} -> daftar transaksi untuk periode

**Analisa Inventory (src/pages/owner/OwnerInventoryAnalysis.vue)**

- Summary Cards: total layanan terjual (top), total sparepart terjual (top), jumlah item stok menipis.
- Top 5 Layanan Terlaris: peringkat layanan, jumlah booking, progress bar perbandingan.
- Top 5 Sparepart Terlaris: informasi stok, jumlah terjual, total revenue per item.
- Low Stock Alert & Table: listing barang yang stoknya menipis (nama, stok, min stok, harga beli, estimasi pembelian, status).
- Total Estimasi Pembelian: jumlah total perkiraan biaya untuk restock semua item menipis.
- Business Insight Card: rekomendasi singkat untuk pemilik.

Endpoint yang dipanggil:

- GET /api/owner/top-services -> data layanan terlaris
- GET /api/owner/top-spareparts -> data sparepart terlaris
- GET /api/owner/low-stock -> daftar item stok menipis

**Util / Export**

- `src/utils/export.ts` juga menggunakan pola endpoint `http://127.0.0.1:8000/api/owner/${endpoint}?period=${period}` untuk fitur export.

---

Jika ingin, saya bisa:

- menambahkan contoh response JSON untuk tiap endpoint (berdasarkan penggunaan di frontend), atau
- membuat file Markdown terpisah yang merinci setiap field yang digunakan dari response API.

Pilih aksi selanjutnya: tambahkan contoh response atau buat dokumentasi field?
