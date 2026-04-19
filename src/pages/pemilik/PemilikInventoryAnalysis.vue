<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikInventoryAnalysisFilters from "@/components/pemilik/inventory-analysis/PemilikInventoryAnalysisFilters.vue";
import PemilikInventoryAnalysisSummaryCards from "@/components/pemilik/inventory-analysis/PemilikInventoryAnalysisSummaryCards.vue";
import PemilikInventoryAnalysisTopServices from "@/components/pemilik/inventory-analysis/PemilikInventoryAnalysisTopServices.vue";
import PemilikInventoryAnalysisTopSpareparts from "@/components/pemilik/inventory-analysis/PemilikInventoryAnalysisTopSpareparts.vue";
import PemilikInventoryAnalysisLowStockTable from "@/components/pemilik/inventory-analysis/PemilikInventoryAnalysisLowStockTable.vue";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { getYearOptions } from "@/utils/dateFilters";
import { API_URL } from "@/utils/api";

// --- CONFIG FILTER ---
const YEAR_OPTIONS = computed(() =>
  getYearOptions(6).map((opt) => Number(opt.value)),
);

// --- STATE ---
const selectedMonth = ref(new Date().getMonth() + 1); // Default bulan ini
const selectedYear = ref(new Date().getFullYear()); // Default tahun ini

const topServices = ref<any[]>([]);
const topSpareparts = ref<any[]>([]);
const lowStockItems = ref<any[]>([]);
const loading = ref(true);

const summary = ref({
  totalServices: 0,
  totalSpareparts: 0,
  lowStockCount: 0,
});

// Fetch data
const fetchInventoryAnalysis = async () => {
  loading.value = true;
  try {
    const headers = getAuthHeaders();

    // Params filter hanya untuk Services & Spareparts (History transaksi)
    const params = {
      month: selectedMonth.value,
      year: selectedYear.value,
    };

    const [servicesRes, sparepartsRes, lowStockRes] = await Promise.all([
      axios.get(`${API_URL}/pemilik/layanan-terpopuler`, { headers, params }),
      axios.get(`${API_URL}/pemilik/suku-cadang-terlaris`, { headers, params }),
      axios.get(`${API_URL}/pemilik/stok-menipis`, { headers }), // Stok tidak pakai filter tanggal (realtime)
    ]);

    topServices.value = servicesRes.data;
    topSpareparts.value = sparepartsRes.data;
    lowStockItems.value = lowStockRes.data;

    summary.value = {
      totalServices: topServices.value.reduce(
        (sum, s) => sum + parseInt(s.total_pemesanan || 0),
        0,
      ),
      totalSpareparts: topSpareparts.value.reduce(
        (sum, s) => sum + parseInt(s.total_terjual || 0),
        0,
      ),
      lowStockCount: lowStockItems.value.length,
    };
  } catch (error: any) {
    logError(error, "fetchInventoryData");
  } finally {
    loading.value = false;
  }
};

// Watch perubahan filter untuk fetch ulang
watch([selectedMonth, selectedYear], () => {
  fetchInventoryAnalysis();
});

onMounted(fetchInventoryAnalysis);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Analisa Inventory"
      icon="mdi-package-variant"
      subtitle="Insight bisnis untuk optimasi stok dan layanan"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <PemilikInventoryAnalysisFilters
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        :year-options="YEAR_OPTIONS"
      />

      <PemilikInventoryAnalysisSummaryCards
        :summary="summary"
        :selected-month="selectedMonth"
        :selected-year="selectedYear"
      />

      <div
        class="mb-8 grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-2"
      >
        <PemilikInventoryAnalysisTopServices
          :services="topServices"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />

        <PemilikInventoryAnalysisTopSpareparts
          :spareparts="topSpareparts"
          :loading="loading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
        />
      </div>

      <PemilikInventoryAnalysisLowStockTable
        :items="lowStockItems"
        :loading="loading"
      />
    </div>
  </div>
</template>
