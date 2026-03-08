<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import OwnerFinancialHeader from "@/components/owner/financial/OwnerFinancialHeader.vue";
import OwnerFinancialFilters from "@/components/owner/financial/OwnerFinancialFilters.vue";
import OwnerFinancialSummaryCards from "@/components/owner/financial/OwnerFinancialSummaryCards.vue";
import OwnerFinancialChart from "@/components/owner/financial/OwnerFinancialChart.vue";
import OwnerFinancialTable from "@/components/owner/financial/OwnerFinancialTable.vue";
import { logError } from "@/utils/errorHandler";
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
import { getAuthHeaders } from "@/utils/auth";
import { API_URL } from "@/utils/api";

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

// --- STATE TANGGAL ---
// Default: Awal bulan ini s/d Hari ini
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

// Konversi ke format YYYY-MM-DD untuk input date HTML5
const startDate = ref(firstDay.toISOString().split("T")[0]);
const endDate = ref(today.toISOString().split("T")[0]);

const revenueData = ref<any>({ labels: [], datasets: [] });
const bookings = ref<any[]>([]);
const loading = ref(true);
const summary = ref({
  totalRevenue: 0,
  totalBookings: 0,
  avgBooking: 0,
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchFinancialData = async () => {
  loading.value = true;
  currentPage.value = 1; // Reset ke halaman pertama
  try {
    const headers = getAuthHeaders();

    // Kirim parameter tanggal ke backend
    const params = {
      start_date: startDate.value,
      end_date: endDate.value,
    };

    const [trendRes, bookingsRes] = await Promise.all([
      axios.get(`${API_URL}/owner/revenue-trend`, { headers, params }),
      axios.get(`${API_URL}/owner/transactions`, { headers, params }),
    ]);

    // Update Chart
    const trendData = trendRes.data.data || trendRes.data;

    revenueData.value = {
      labels: trendData.labels || [],
      datasets: [
        {
          label: `Pendapatan`,
          data: trendData.values || [],
          borderColor: "rgb(220, 38, 38)",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    // Update Table & Summary
    const bookingsData = bookingsRes.data.data || bookingsRes.data;
    bookings.value = Array.isArray(bookingsData) ? bookingsData : [];

    const total = bookings.value.reduce(
      (sum, b) => sum + (parseFloat(b.total_harga) || 0),
      0,
    );

    summary.value = {
      totalRevenue: total,
      totalBookings: bookings.value.length,
      avgBooking: bookings.value.length > 0 ? total / bookings.value.length : 0,
    };
  } catch (error: any) {
    logError(error, "fetchFinancialData");
    bookings.value = [];
    revenueData.value = { labels: [], datasets: [] };
    summary.value = { totalRevenue: 0, totalBookings: 0, avgBooking: 0 };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFinancialData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="space-y-6">
      <!-- Header -->
      <OwnerFinancialHeader />

      <!-- Filter Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OwnerFinancialFilters
          v-model:startDate="startDate"
          v-model:endDate="endDate"
          :loading="loading"
          @apply="fetchFinancialData"
        />
      </div>

      <!-- Summary Cards -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OwnerFinancialSummaryCards :summary="summary" />
      </div>

      <!-- Chart Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OwnerFinancialChart
          :revenue-data="revenueData"
          :loading="loading"
          :start-date="startDate"
          :end-date="endDate"
        />
      </div>

      <!-- Table Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <OwnerFinancialTable
          :bookings="bookings"
          :loading="loading"
          :start-date="startDate"
          :end-date="endDate"
          v-model:currentPage="currentPage"
          :items-per-page="itemsPerPage"
        />
      </div>
    </div>
  </div>
</template>
