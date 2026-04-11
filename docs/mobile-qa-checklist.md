# Mobile QA Checklist (320-390)

## 1) Persiapan

- Jalankan backend: `cd krgarage-backend && php artisan serve --host=0.0.0.0 --port=8000`
- Jalankan frontend: `cd krgarage-frontend && npm run dev`
- Buka dari HP: gunakan URL Network yang tampil di terminal Vite
- Uji minimal 3 lebar layar: 320, 360, 390

## 2) Kriteria Lulus Umum

- Tidak ada teks keluar card/container
- Tidak ada tombol terpotong atau tidak bisa ditekan
- Grid card tetap terbaca (tidak terlalu sempit dan tidak memanjang berlebihan)
- Scroll horizontal tidak muncul pada halaman utama
- Modal tidak terpotong dan tombol aksi tetap terlihat

## 3) Scope Halaman

### Customer

- Dashboard
- Booking (form + selector layanan/vespa)
- Riwayat booking
- Daftar vespa

### Admin

- Dashboard (stats + recent bookings)
- Booking list + detail booking
- Layanan
- Inventory
- Financial report

### Mekanik

- Dashboard
- Booking queue + update status
- Pilih sparepart untuk job

### Pemilik

- Dashboard
- Financial
- Inventory analysis
- Recent activity

## 4) Skenario Uji Inti

- Data panjang: email panjang, nomor telepon panjang, nama customer panjang
- State kosong: halaman tanpa data
- State loading: skeleton/loader tetap rapi
- Error state: pesan error tetap terbaca, tidak overlap
- Navigasi: pindah tab/halaman tidak merusak layout

## 5) Template Laporan Ringkas

- Role:
- Halaman:
- Lebar layar:
- Langkah uji:
- Hasil aktual:
- Hasil yang diharapkan:
- Screenshot/rekaman:
- Prioritas: High / Medium / Low
