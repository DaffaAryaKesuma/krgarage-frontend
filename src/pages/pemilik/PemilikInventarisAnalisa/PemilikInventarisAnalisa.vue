<script setup lang="ts">
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikInventarisAnalisaFilters from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaFilters.vue";
import PemilikInventarisAnalisaRingkasanKartu from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaRingkasanKartu.vue";
import PemilikInventarisAnalisaTeratasLayanan from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasLayanan.vue";
import PemilikInventarisAnalisaTeratasSukuCadang from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasSukuCadang.vue";
import PemilikInventarisAnalisaLowStockTable from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaLowStockTable.vue";
import { usePemilikInventarisAnalisaPage } from "./usePemilikInventarisAnalisaPage";

const {
  YEAR_OPTIONS,
  selectedMonth,
  selectedYear,
  topLayanan,
  topSukuCadang,
  lowStockItems,
  loading,
  ringkasan,
} = usePemilikInventarisAnalisaPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Analisa Inventaris"
      icon="mdi-package-variant"
      subtitle="Insight bisnis untuk optimasi stok dan layanan"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <PemilikInventarisAnalisaFilters
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        :year-options="YEAR_OPTIONS"
      />

      <PemilikInventarisAnalisaRingkasanKartu
        :ringkasan="ringkasan"
        :selected-month="selectedMonth"
        :selected-year="selectedYear"
      />

      <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PemilikInventarisAnalisaTeratasLayanan
          :layanan="topLayanan"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />

        <PemilikInventarisAnalisaTeratasSukuCadang
          :sukucadang="topSukuCadang"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />
      </div>

      <PemilikInventarisAnalisaLowStockTable
        :items="lowStockItems"
        :loading="loading"
      />
    </div>
  </div>
</template>
