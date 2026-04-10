<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import CustomerServiceReminderBanner from "@/components/customer/dashboard/CustomerServiceReminderBanner.vue";
import CustomerQuickActions from "@/components/customer/dashboard/CustomerQuickActions.vue";
import CustomerStatsCards from "@/components/customer/dashboard/CustomerStatsCards.vue";
import CustomerTipsWidget from "@/components/customer/dashboard/CustomerTipsWidget.vue";
import CustomerUpcomingBookings from "@/components/customer/dashboard/CustomerUpcomingBookings.vue";
import CustomerRecentBookings from "@/components/customer/dashboard/CustomerRecentBookings.vue";
import { API_URL } from "@/utils/api";

interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at: string;
  status: string;
  tanggal_pemesanan: string;
  total_harga?: number;
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
}

interface Vespa {
  id: number;
  model: string;
  tahun_produksi: number;
  plat_nomor: string;
}

const toast = useToast();

const bookingList = ref<Booking[]>([]);
const vespaList = ref<Vespa[]>([]);
const vespasDueService = ref<any[]>([]);
const isLoading = ref(true);
const user = ref({ nama: "Guest" });

async function fetchDashboardData() {
  const token = localStorage.getItem("token");
  if (!token) {
    isLoading.value = false;
    return;
  }

  try {
    const [bookingResponse, vespaResponse, dueServiceResponse] =
      await Promise.all([
        axios.get(`${API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/my-vespas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/vespas/due-service`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    bookingList.value = bookingResponse.data.data || bookingResponse.data;
    vespaList.value = vespaResponse.data;
    vespasDueService.value = dueServiceResponse.data;
  } catch (error: any) {
    logError(error, "fetchDashboardData");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
  await fetchDashboardData();
});

// Computed properties
const upcomingBookings = computed(() =>
  bookingList.value
    .filter((b) => b.status === "Pending" || b.status === "In Progress")
    .slice(0, 3),
);

const recentBookings = computed(() =>
  bookingList.value
    .filter((b) => b.status === "Completed" || b.status === "Cancelled")
    .slice(0, 3),
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with gradient (like dashboard) -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <i class="mdi mdi-account text-3xl"></i>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">
              Selamat Datang, {{ user.nama }}!
            </h1>
            <p class="max-w-2xl text-sm text-red-100 sm:text-base">
              Ini adalah ringkasan aktivitas Anda di KRGarage
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <div v-else class="space-y-4 sm:space-y-5 lg:space-y-6">
        <!-- Service Reminder Banner -->
        <CustomerServiceReminderBanner :vespas="vespasDueService" />

        <!-- Quick Actions -->
        <CustomerQuickActions />

        <!-- Stats Cards -->
        <CustomerStatsCards
          :vespa-count="vespaList.length"
          :total-bookings="bookingList.length"
          :active-bookings="upcomingBookings.length"
        />

        <!-- Quick Tips Widget -->
        <CustomerTipsWidget />

        <!-- Upcoming Bookings Section -->
        <CustomerUpcomingBookings
          :bookings="upcomingBookings"
          :is-loading="isLoading"
        />

        <!-- Recent Bookings Section -->
        <CustomerRecentBookings
          :bookings="recentBookings"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>
