<script setup lang="ts">
// onMounted dipakai untuk mengambil data saat halaman dibuka.
import { onMounted } from "vue";
// Header halaman laporan keuangan.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Filter tanggal awal dan akhir laporan.
import PemilikKeuanganFilters from "@/components/pemilik/keuangan/PemilikKeuanganFilters.vue";
// Kartu ringkasan pemasukan, pengeluaran, dan keuntungan.
import PemilikKeuanganRingkasanKartu from "@/components/pemilik/keuangan/PemilikKeuanganRingkasanKartu.vue";
// Grafik pendapatan.
import PemilikKeuanganChart from "@/components/pemilik/keuangan/PemilikKeuanganChart/PemilikKeuanganChart.vue";
// Tabel pemasukan/transaksi lunas.
import PemilikKeuanganTable from "@/components/pemilik/keuangan/PemilikKeuanganTable/PemilikKeuanganTable.vue";
// Tabel pengeluaran restok suku cadang.
import PemilikKeuanganPengeluaranRestokTable from "@/components/pemilik/keuangan/PemilikKeuanganPengeluaranRestokTable/PemilikKeuanganPengeluaranRestokTable.vue";
// Tab untuk memilih ringkasan, pemasukan, atau pengeluaran.
import PemilikKeuanganTabs from "@/components/pemilik/keuangan/PemilikKeuanganTabs/PemilikKeuanganTabs.vue";
// Mengambil logika halaman laporan keuangan pemilik.
import { usePemilikKeuanganPage } from "./usePemilikKeuanganPage";
// Import bagian Chart.js yang dibutuhkan oleh komponen grafik.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Mendaftarkan komponen Chart.js agar grafik bisa dirender.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Mengambil state dan fungsi laporan keuangan dari composable.
const {
  // Tanggal awal filter laporan.
  startDate,
  // Tanggal akhir filter laporan.
  endDate,
  // Data grafik pendapatan.
  revenueData,
  // Daftar transaksi pemasukan.
  pemesanan,
  // Daftar pengeluaran restok.
  pengeluaranRestok,
  // Status loading laporan.
  loading,
  // Data ringkasan laporan.
  ringkasan,
  // Halaman aktif tabel pemasukan.
  currentPage,
  // Halaman aktif tabel pengeluaran.
  expenseCurrentPage,
  // Jumlah item per halaman tabel.
  itemsPerPage,
  // Tab yang sedang aktif.
  activeTab,
  // Fungsi mengambil data laporan.
  fetchKeuanganData
} = usePemilikKeuanganPage();

// Saat halaman dibuka, ambil data laporan dari API.
onMounted(() => {
  fetchKeuanganData();
});
</script>

<template>
  <!-- Wrapper utama halaman laporan keuangan pemilik. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman laporan keuangan. -->
    <AppPageHeader
      title="Laporan Keuangan"
      icon="mdi-chart-line"
      subtitle="Ringkasan performa keuangan bengkel"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten laporan keuangan. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 pb-8">
      <!-- Filter rentang tanggal laporan. -->
      <PemilikKeuanganFilters
        v-model:startDate="startDate"
        v-model:endDate="endDate"
        :loading="loading"
        @apply="fetchKeuanganData"
      />

      <!-- Tab untuk mengganti tampilan ringkasan, pemasukan, atau pengeluaran. -->
      <PemilikKeuanganTabs v-model:active-tab="activeTab" />

      <!-- Tab ringkasan: tampilkan kartu ringkasan dan grafik. -->
      <template v-if="activeTab === 'ringkasan'">
        <PemilikKeuanganRingkasanKartu :ringkasan="ringkasan" />

        <PemilikKeuanganChart
          :revenue-data="revenueData"
          :loading="loading"
          :start-date="startDate"
          :end-date="endDate"
        />
      </template>

      <!-- Tab pemasukan: tampilkan tabel pemesanan yang sudah lunas. -->
      <PemilikKeuanganTable
        v-else-if="activeTab === 'pemasukan'"
        :pemesanan="pemesanan"
        :start-date="startDate"
        :end-date="endDate"
        v-model:currentPage="currentPage"
        :items-per-page="itemsPerPage"
      />

      <!-- Tab pengeluaran: tampilkan tabel restok suku cadang. -->
      <PemilikKeuanganPengeluaranRestokTable
        v-else
        :pengeluaran="pengeluaranRestok"
        :start-date="startDate"
        :end-date="endDate"
        v-model:currentPage="expenseCurrentPage"
        :items-per-page="itemsPerPage"
      />
    </div>
  </div>
</template>
