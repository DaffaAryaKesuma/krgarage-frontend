<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { logError, handleApiError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminFinancialFilters from "@/components/admin/financial/AdminFinancialFilters.vue";
import AdminFinancialSummaryCards from "@/components/admin/financial/AdminFinancialSummaryCards.vue";
import AdminFinancialChart from "@/components/admin/financial/AdminFinancialChart.vue";
import AdminFinancialTopServices from "@/components/admin/financial/AdminFinancialTopServices.vue";
import AdminFinancialTransactionsTable from "@/components/admin/financial/AdminFinancialTransactionsTable.vue";
import type { FinancialBooking } from "@/types/booking";

const toast = useToast();

// Interfaces
interface Summary {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

interface MonthlyData {
  bulan: number;
  pendapatan: string;
}

// State
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref<number | string>("");

const summary = ref<Summary>({
  total_pendapatan: 0,
  total_pemesanan: 0,
  rata_rata_nilai_pesan: 0,
});

const monthlyData = ref<MonthlyData[]>([]);
const topServices = ref<any[]>([]);
const bookings = ref<FinancialBooking[]>([]);

const fetchReport = async () => {
  try {
    const params = {
      year: selectedYear.value,
      ...(selectedMonth.value && { month: selectedMonth.value }),
    };

    const { data } = await axios.get(`${API_URL}/admin/laporan/keuangan`, {
      params,
      headers: getAuthHeaders(),
    });

    summary.value = data.ringkasan;
    monthlyData.value = data.data_bulanan;
    topServices.value = data.layanan_terpopuler;
    bookings.value = data.pemesanan;
  } catch (error: any) {
    logError(error, "fetchReport");
    toast.error(handleApiError(error));
  }
};

// Lifecycle
onMounted(() => fetchReport());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Laporan Keuangan"
      icon="mdi-chart-line"
      subtitle="Analisis pendapatan dan transaksi bengkel"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <AdminFinancialFilters
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        @change="fetchReport"
      />

      <AdminFinancialSummaryCards :summary="summary" />

      <AdminFinancialChart
        :monthly-data="monthlyData"
        :selected-year="selectedYear"
      />

      <AdminFinancialTopServices :top-services="topServices" />

      <AdminFinancialTransactionsTable :bookings="bookings" />
    </div>
  </div>
</template>
