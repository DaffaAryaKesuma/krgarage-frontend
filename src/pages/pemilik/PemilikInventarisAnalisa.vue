<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikInventarisAnalisaFilters from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaFilters.vue";
import PemilikInventarisAnalisaRingkasanKartu from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaRingkasanKartu.vue";
import PemilikInventarisAnalisaTeratasLayanan from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasLayanan.vue";
import PemilikInventarisAnalisaTeratasSukuCadang from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaTeratasSukuCadang.vue";
import PemilikInventarisAnalisaLowStockTable from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaLowStockTable.vue";
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

const topLayanan = ref<any[]>([]);
const topSukuCadang = ref<any[]>([]);
const lowStockItems = ref<any[]>([]);
const loading = ref(true);

const ringkasan = ref({
  totalLayanan: 0,
  totalSukuCadang: 0,
  lowStockCount: 0,
});

// Fetch data
const fetchInventarisAnalisa = async () => {
  loading.value = true;
  try {
    const headers = getAuthHeaders();

    // Params filter hanya untuk Layanan & SukuCadang (Riwayat transaksi)
    const params = {
      month: selectedMonth.value,
      year: selectedYear.value,
    };

    const [layananRes, sukucadangRes, lowStockRes] = await Promise.all([
      axios.get(`${API_URL}/pemilik/layanan-terpopuler`, { headers, params }),
      axios.get(`${API_URL}/pemilik/suku-cadang-terlaris`, { headers, params }),
      axios.get(`${API_URL}/pemilik/stok-menipis`, { headers }), // Stok tidak pakai filter tanggal (realtime)
    ]);

    topLayanan.value = layananRes.data.data ?? layananRes.data;
    topSukuCadang.value = sukucadangRes.data.data ?? sukucadangRes.data;
    lowStockItems.value = lowStockRes.data.data ?? lowStockRes.data;

    ringkasan.value = {
      totalLayanan: Array.isArray(topLayanan.value)
        ? topLayanan.value.reduce((sum, s) => sum + parseInt(s.total || s.total_pemesanan || 0), 0)
        : 0,
      totalSukuCadang: Array.isArray(topSukuCadang.value)
        ? topSukuCadang.value.reduce((sum, s) => sum + parseInt(s.total_terjual || 0), 0)
        : 0,
      lowStockCount: Array.isArray(lowStockItems.value) ? lowStockItems.value.length : 0,
    };
  } catch (error: any) {
    logError(error, "fetchInventarisData");
  } finally {
    loading.value = false;
  }
};

// Watch perubahan filter untuk fetch ulang
watch([selectedMonth, selectedYear], () => {
  fetchInventarisAnalisa();
});

onMounted(fetchInventarisAnalisa);
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
