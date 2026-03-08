<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import OwnerDashboardHeader from "@/components/owner/dashboard/OwnerDashboardHeader.vue";
import OwnerStatsGrid from "@/components/owner/dashboard/OwnerStatsGrid.vue";
import OwnerQuickInsights from "@/components/owner/dashboard/OwnerQuickInsights.vue";
import OwnerRecentActivity from "@/components/owner/dashboard/OwnerRecentActivity.vue";
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

const recentBookings = ref<any[]>([]);

const fetchDashboardData = async () => {
  try {
    const headers = getAuthHeaders();

    const [statsRes, bookingsRes] = await Promise.all([
      axios.get(`${API_URL}/owner/stats`, { headers }),
      axios.get(`${API_URL}/owner/recent-bookings`, { headers }),
    ]);

    stats.value = {
      pendapatanHariIni: statsRes.data.pendapatan_hari_ini || 0,
      pendapatanBulanIni: statsRes.data.pendapatan_bulan_ini || 0,
      unitHariIni: statsRes.data.unit_hari_ini || 0,
      nilaiStok: statsRes.data.nilai_stok || 0,
      loading: false,
    };

    recentBookings.value = bookingsRes.data.slice(0, 5);
  } catch (error: any) {
    logError(error, "fetchDashboardData");
    stats.value.loading = false;
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="space-y-6">
      <!-- Page Header -->
      <OwnerDashboardHeader />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <!-- Big Numbers Grid -->
        <OwnerStatsGrid :stats="stats" />

        <!-- Quick Insights -->
        <OwnerQuickInsights />

        <!-- Recent Activity -->
        <OwnerRecentActivity
          :bookings="recentBookings"
          :loading="stats.loading"
        />
      </div>
    </div>
  </div>
</template>
