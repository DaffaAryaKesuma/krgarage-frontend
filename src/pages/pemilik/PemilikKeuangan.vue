<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikKeuanganFilters from "@/components/pemilik/keuangan/PemilikKeuanganFilters.vue";
import PemilikKeuanganRingkasanKartu from "@/components/pemilik/keuangan/PemilikKeuanganRingkasanKartu.vue";
import PemilikKeuanganChart from "@/components/pemilik/keuangan/PemilikKeuanganChart.vue";
import PemilikKeuanganTable from "@/components/pemilik/keuangan/PemilikKeuanganTable.vue";
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
import type { KeuanganPemesanan } from "@/types/pemesanan";

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
// Default: 1 bulan terakhir (hari ini - 1 bulan s/d hari ini)
// Helper untuk format tanggal lokal YYYY-MM-DD
const toLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = new Date();
const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

const startDate = ref(toLocalISOString(oneMonthAgo));
const endDate = ref(toLocalISOString(today));

const revenueData = ref<any>({ labels: [], datasets: [] });
const pemesanan = ref<KeuanganPemesanan[]>([]);
const loading = ref(true);
const ringkasan = ref({
  totalRevenue: 0,
  totalPemesanan: 0,
  avgPemesanan: 0,
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchKeuanganData = async () => {
  loading.value = true;
  currentPage.value = 1; // Reset ke halaman pertama
  try {
    const headers = getAuthHeaders();

    // Kirim parameter tanggal ke backend
    const params = {
      start_date: startDate.value,
      end_date: endDate.value,
    };

    const [trendRes, pemesananRes] = await Promise.all([
      axios.get(`${API_URL}/pemilik/tren-pendapatan`, { headers, params }),
      axios.get(`${API_URL}/pemilik/transaksi`, { headers, params }),
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

    // Update Table & Ringkasan
    const pemesananData = pemesananRes.data.data || pemesananRes.data;
    pemesanan.value = Array.isArray(pemesananData) ? pemesananData : [];

    const total = pemesanan.value.reduce(
      (sum, b) => sum + Number(b.total_harga || 0),
      0,
    );

    ringkasan.value = {
      totalRevenue: total,
      totalPemesanan: pemesanan.value.length,
      avgPemesanan: pemesanan.value.length > 0 ? total / pemesanan.value.length : 0,
    };
  } catch (error: any) {
    logError(error, "fetchKeuanganData");
    pemesanan.value = [];
    revenueData.value = { labels: [], datasets: [] };
    ringkasan.value = { totalRevenue: 0, totalPemesanan: 0, avgPemesanan: 0 };
  } finally {
    loading.value = false;
  }
};

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

      <PemilikKeuanganRingkasanKartu :ringkasan="ringkasan" />

      <PemilikKeuanganChart
        :revenue-data="revenueData"
        :loading="loading"
        :start-date="startDate"
        :end-date="endDate"
      />

      <PemilikKeuanganTable
        :pemesanan="pemesanan"
        :loading="loading"
        :start-date="startDate"
        :end-date="endDate"
        v-model:currentPage="currentPage"
        :items-per-page="itemsPerPage"
      />
    </div>
  </div>
</template>
