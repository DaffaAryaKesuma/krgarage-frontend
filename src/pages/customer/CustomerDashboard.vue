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
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { CustomerBooking } from "@/types/booking";
import type { VespaDetail } from "@/types/vespa";

const toast = useToast();

const bookingList = ref<CustomerBooking[]>([]);
const vespaList = ref<VespaDetail[]>([]);
const vespasDueService = ref<any[]>([]);
const isLoading = ref(true);
const user = ref({ nama: "Guest" });

async function fetchDashboardData() {
  const headers = getAuthHeaders();
  if (!Object.keys(headers).length) {
    isLoading.value = false;
    return;
  }

  try {
    const [bookingResponse, vespaResponse, dueServiceResponse] =
      await Promise.all([
        axios.get(`${API_URL}/pemesanan`, {
          headers,
        }),
        axios.get(`${API_URL}/vespa-saya`, {
          headers,
        }),
        axios.get(`${API_URL}/vespa-saya/perlu-servis`, {
          headers,
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
    <AppPageHeader
      :title="`Selamat Datang, ${user.nama}!`"
      icon="mdi-account"
      subtitle="Ini adalah ringkasan aktivitas Anda di KRGarage"
      subtitle-class="max-w-2xl text-sm text-red-100 sm:text-base"
    />

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
