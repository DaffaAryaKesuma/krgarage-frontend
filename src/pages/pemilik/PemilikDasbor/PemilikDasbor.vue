<script setup lang="ts">
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PemilikStatistikGrid from "@/components/pemilik/dasbor/PemilikStatistikGrid.vue";
import PemilikMetrikKeuanganChart from "@/components/pemilik/dasbor/PemilikMetrikKeuanganChart.vue";
import PemilikQuickInsights from "@/components/pemilik/dasbor/PemilikQuickInsights/PemilikQuickInsights.vue";
import PemilikTerbaruActivity from "@/components/pemilik/dasbor/PemilikTerbaruActivity.vue";
import { usePemilikDasborPage } from "./usePemilikDasborPage";

const { statistik, ringkasan, metrik, terbaruPemesanan } =
  usePemilikDasborPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Dasbor Pemilik"
      icon="mdi-view-dashboard"
      subtitle="Monitoring real-time performa bengkel Anda"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner
        v-if="statistik.loading"
        message="Memuat data dasbor..."
      />

      <template v-else>
        <!-- Quick Insights / Operational -->
        <PemilikQuickInsights :ringkasan="ringkasan" :statistik="statistik" />

        <!-- Big Numbers Grid -->
        <PemilikStatistikGrid :statistik="statistik" :ringkasan="ringkasan" />

        <!-- Terbaru Activity -->
        <PemilikTerbaruActivity
          :pemesanan="terbaruPemesanan"
          :loading="statistik.loading"
        />
      </template>
    </div>
  </div>
</template>
