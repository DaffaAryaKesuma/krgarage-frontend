<script setup lang="ts">
// Header halaman analisis inventaris.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Filter bulan dan tahun analisa.
import PemilikInventarisAnalisaFilters from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaFilters.vue";
// Kartu ringkasan total layanan, suku cadang, dan stok menipis.
import PemilikInventarisAnalisaRingkasanKartu from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaRingkasanKartu.vue";
// Komponen daftar layanan terpopuler.
import PemilikInventarisAnalisaTeratasLayanan from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasLayanan.vue";
// Komponen daftar suku cadang terlaris.
import PemilikInventarisAnalisaTeratasSukuCadang from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasSukuCadang.vue";
// Tabel stok menipis.
import PemilikInventarisAnalisaLowStockTable from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaLowStockTable.vue";
// Mengambil logika halaman analisis inventaris.
import { usePemilikInventarisAnalisaPage } from "./usePemilikInventarisAnalisaPage";

// Mengambil state analisis inventaris dari composable.
const {
  // Pilihan tahun yang tersedia untuk filter.
  YEAR_OPTIONS,
  // Bulan terpilih.
  selectedMonth,
  // Tahun terpilih.
  selectedYear,
  // Data layanan terpopuler.
  topLayanan,
  // Data suku cadang terlaris.
  topSukuCadang,
  // Data stok menipis.
  lowStockItems,
  // Status loading.
  loading,
  // Data ringkasan analisa.
  ringkasan,
} = usePemilikInventarisAnalisaPage();
</script>

<template>
  <!-- Wrapper utama halaman analisis inventaris. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman. -->
    <AppPageHeader
      title="Analisis Inventaris"
      icon="mdi-package-variant"
      subtitle="Insight bisnis untuk optimasi stok dan layanan"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten analisis inventaris. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Filter bulan dan tahun. -->
      <PemilikInventarisAnalisaFilters
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        :year-options="YEAR_OPTIONS"
      />

      <!-- Kartu ringkasan hasil analisa. -->
      <PemilikInventarisAnalisaRingkasanKartu
        :ringkasan="ringkasan"
        :selected-month="selectedMonth"
        :selected-year="selectedYear"
      />

      <!-- Grid layanan terpopuler dan suku cadang terlaris. -->
      <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Daftar layanan paling sering dipesan. -->
        <PemilikInventarisAnalisaTeratasLayanan
          :layanan="topLayanan"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />

        <!-- Daftar suku cadang paling banyak digunakan/terjual. -->
        <PemilikInventarisAnalisaTeratasSukuCadang
          :sukucadang="topSukuCadang"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />
      </div>

      <!-- Tabel barang dengan stok menipis. -->
      <PemilikInventarisAnalisaLowStockTable
        :items="lowStockItems"
        :loading="loading"
      />
    </div>
  </div>
</template>
