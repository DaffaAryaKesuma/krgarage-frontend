<script setup lang="ts">
// Header standar halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Loading saat laporan masih diambil dari backend.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Filter tahun dan bulan laporan.
import AdminKeuanganFilters from "@/components/admin/keuangan/AdminKeuanganFilters.vue";
// Kartu ringkasan pendapatan dan transaksi.
import AdminKeuanganRingkasanKartu from "@/components/admin/keuangan/AdminKeuanganRingkasanKartu.vue";
// Grafik pendapatan bulanan.
import AdminKeuanganGrafik from "@/components/admin/keuangan/AdminKeuanganGrafik/AdminKeuanganGrafik.vue";
// Daftar layanan yang paling sering/tinggi dipakai.
import AdminKeuanganTeratasLayanan from "@/components/admin/keuangan/AdminKeuanganTeratasLayanan.vue";
// Tabel transaksi pemesanan yang masuk laporan.
import AdminKeuanganTransaksiTabel from "@/components/admin/keuangan/AdminKeuanganTransaksiTabel/AdminKeuanganTransaksiTabel.vue";
// Composable berisi logic fetch laporan keuangan.
import { useAdminKeuanganLaporanPage } from "./useAdminKeuanganLaporanPage";

// State laporan dan function fetch diambil dari composable.
const {
  selectedYear,
  selectedMonth,
  isLoading,
  ringkasan,
  monthlyData,
  topLayanan,
  pemesanan,
  fetchLaporan,
} = useAdminKeuanganLaporanPage();
</script>

<template>
  <!-- Container utama halaman laporan keuangan admin. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman. -->
    <AppPageHeader
      title="Laporan Keuangan"
      icon="mdi-chart-line"
      subtitle="Analisis pendapatan dan transaksi bengkel"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Area konten laporan. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Filter mengubah selectedYear/selectedMonth lalu memanggil fetchLaporan. -->
      <AdminKeuanganFilters
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        @change="fetchLaporan"
      />

      <!-- Loading saat request laporan belum selesai. -->
      <LoadingSpinner v-if="isLoading" message="Memuat laporan keuangan..." />

      <!-- Isi laporan tampil setelah data siap. -->
      <template v-else>
        <!-- Ringkasan total pendapatan, total pemesanan, dan rata-rata. -->
        <AdminKeuanganRingkasanKartu :ringkasan="ringkasan" />
        <!-- Grafik pendapatan per bulan. -->
        <AdminKeuanganGrafik
          :monthly-data="monthlyData"
          :selected-year="selectedYear"
        />
        <!-- Layanan teratas berdasarkan data laporan. -->
        <AdminKeuanganTeratasLayanan :top-layanan="topLayanan" />
        <!-- Tabel transaksi pemesanan yang dihitung ke laporan. -->
        <AdminKeuanganTransaksiTabel :pemesanan="pemesanan" />
      </template>
    </div>
  </div>
</template>
