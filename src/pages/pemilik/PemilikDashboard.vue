<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PemilikStatsGrid from "@/components/pemilik/dashboard/PemilikStatsGrid.vue";
import PemilikMetrikKeuanganChart from "@/components/pemilik/dashboard/PemilikMetrikKeuanganChart.vue";
import PemilikQuickInsights from "@/components/pemilik/dashboard/PemilikQuickInsights.vue";
import PemilikRecentActivity from "@/components/pemilik/dashboard/PemilikRecentActivity.vue";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";

// Data
const stats = ref({
  pendapatanHariIni: 0,
  pendapatanBulanIni: 0,
  unitHariIni: 0,
  nilaiStok: 0,
  loading: true,
});

const ringkasan = ref(null);
const metrik = ref(null);

const recentBookings = ref<any[]>([]);

const fetchDashboardData = async () => {
  try {
    const headers = getAuthHeaders();

    const [statsRes, bookingsRes, ringkasanRes, metrikRes] = await Promise.all([
      axios.get(`${API_URL}/pemilik/statistik`, { headers }),
      axios.get(`${API_URL}/pemilik/pemesanan-terbaru`, { headers }),
      axios.get(`${API_URL}/pemilik/ringkasan`, { headers }),
      axios.get(`${API_URL}/pemilik/metrik-keuangan`, { headers }),
    ]);

    stats.value = {
      pendapatanHariIni: statsRes.data.data?.pendapatan_hari_ini ?? statsRes.data.pendapatan_hari_ini ?? 0,
      pendapatanBulanIni: statsRes.data.data?.pendapatan_bulan_ini ?? statsRes.data.pendapatan_bulan_ini ?? 0,
      unitHariIni: statsRes.data.data?.unit_hari_ini ?? statsRes.data.unit_hari_ini ?? 0,
      nilaiStok: statsRes.data.data?.nilai_stok ?? statsRes.data.nilai_stok ?? 0,
      loading: false,
    };

    ringkasan.value = ringkasanRes.data.data ?? ringkasanRes.data;
    metrik.value = metrikRes.data.data ?? metrikRes.data;

    const bookings = bookingsRes.data.data ?? bookingsRes.data;
    recentBookings.value = Array.isArray(bookings) ? bookings.slice(0, 5) : [];
  } catch (error: any) {
    logError(error, "fetchDashboardData");
    stats.value.loading = false;
  }
};

onMounted(fetchDashboardData);
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
      <LoadingSpinner v-if="stats.loading" message="Memuat data dasbor..." />

      <template v-else>
        <!-- Big Numbers Grid -->
        <PemilikStatsGrid :stats="stats" :ringkasan="ringkasan" />

        <!-- Quick Insights / Operational -->
        <PemilikQuickInsights :ringkasan="ringkasan" :stats="stats" />

        <!-- Recent Activity -->
        <PemilikRecentActivity
          :bookings="recentBookings"
          :loading="stats.loading"
        />
      </template>
    </div>
  </div>
</template>
