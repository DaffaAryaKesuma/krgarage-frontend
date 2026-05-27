<script setup lang="ts">
import { onMounted } from "vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikKeuanganFilters from "@/components/pemilik/keuangan/PemilikKeuanganFilters.vue";
import PemilikKeuanganRingkasanKartu from "@/components/pemilik/keuangan/PemilikKeuanganRingkasanKartu.vue";
import PemilikKeuanganChart from "@/components/pemilik/keuangan/PemilikKeuanganChart/PemilikKeuanganChart.vue";
import PemilikKeuanganTable from "@/components/pemilik/keuangan/PemilikKeuanganTable/PemilikKeuanganTable.vue";
import PemilikKeuanganPengeluaranRestokTable from "@/components/pemilik/keuangan/PemilikKeuanganPengeluaranRestokTable/PemilikKeuanganPengeluaranRestokTable.vue";
import PemilikKeuanganTabs from "@/components/pemilik/keuangan/PemilikKeuanganTabs/PemilikKeuanganTabs.vue";
import { usePemilikKeuanganPage } from "./usePemilikKeuanganPage";
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

// 2. Panggil dan ekstrak variabel-variabelnya
const {
  startDate,
  endDate,
  revenueData,
  pemesanan,
  pengeluaranRestok,
  loading,
  ringkasan,
  currentPage,
  expenseCurrentPage,
  itemsPerPage,
  activeTab,
  fetchKeuanganData
} = usePemilikKeuanganPage();

// 3. Panggil saat halaman dimuat
onMounted(() => {
  fetchKeuanganData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Laporan Keuangan"
      icon="mdi-chart-line"
      subtitle="Ini adalah ringkasan performa keuangan bengkel"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 pb-8">
      <PemilikKeuanganFilters
        v-model:startDate="startDate"
        v-model:endDate="endDate"
        :loading="loading"
        @apply="fetchKeuanganData"
      />

      <PemilikKeuanganTabs v-model:active-tab="activeTab" />

      <template v-if="activeTab === 'ringkasan'">
        <PemilikKeuanganRingkasanKartu :ringkasan="ringkasan" />

        <PemilikKeuanganChart
          :revenue-data="revenueData"
          :loading="loading"
          :start-date="startDate"
          :end-date="endDate"
        />
      </template>

      <PemilikKeuanganTable
        v-else-if="activeTab === 'pemasukan'"
        :pemesanan="pemesanan"
        :start-date="startDate"
        :end-date="endDate"
        v-model:currentPage="currentPage"
        :items-per-page="itemsPerPage"
      />

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
