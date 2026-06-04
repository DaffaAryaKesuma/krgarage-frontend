<script setup lang="ts">
// Header halaman pemilik.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Loading saat data dashboard sedang dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Komponen kartu angka utama seperti pendapatan dan stok.
import PemilikStatistikGrid from "@/components/pemilik/dasbor/PemilikStatistikGrid.vue";
// Komponen insight cepat untuk ringkasan operasional.
import PemilikQuickInsights from "@/components/pemilik/dasbor/PemilikQuickInsights/PemilikQuickInsights.vue";
// Komponen tabel aktivitas pemesanan terbaru.
import PemilikTerbaruActivity from "@/components/pemilik/dasbor/PemilikTerbaruActivity.vue";
// Mengambil logika dashboard pemilik.
import { usePemilikDasborPage } from "./usePemilikDasborPage";

// Mengambil data dashboard dari composable.
const { statistik, ringkasan, metrik, terbaruPemesanan } =
  usePemilikDasborPage();
</script>

<template>
  <!-- Wrapper utama halaman dashboard pemilik. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman. -->
    <AppPageHeader
      title="Dasbor Pemilik"
      icon="mdi-view-dashboard"
      subtitle="Monitoring real-time performa bengkel Anda"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten dashboard. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Tampilkan loading saat statistik masih dimuat. -->
      <LoadingSpinner
        v-if="statistik.loading"
        message="Memuat data dasbor..."
      />

      <!-- Jika loading selesai, tampilkan konten dashboard. -->
      <template v-else>
        <!-- Insight cepat untuk memantau kondisi operasional bengkel. -->
        <PemilikQuickInsights :ringkasan="ringkasan" :statistik="statistik" />

        <!-- Kartu statistik angka besar. -->
        <PemilikStatistikGrid :statistik="statistik" :ringkasan="ringkasan" />

        <!-- Aktivitas pemesanan terbaru. -->
        <PemilikTerbaruActivity :pemesanan="terbaruPemesanan" />
      </template>
    </div>
  </div>
</template>
