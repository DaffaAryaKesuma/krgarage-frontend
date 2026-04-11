<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { formatDateShort } from "../../utils/date";
import AdminDashboardStatsCards from "@/components/admin/dashboard/AdminDashboardStatsCards.vue";
import AdminDashboardRecentBookings from "@/components/admin/dashboard/AdminDashboardRecentBookings.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { BOOKING_STATUS } from "@/utils/statusBadge";
import type { Booking } from "@/types/booking";
import type { MechanicProfile } from "@/types/user";

const toast = useToast();

// Interfaces
interface Stats {
  pemesanan_hari_ini: number;
  sedang_diproses: number;
  selesai_hari_ini: number;
}

// State
const stats = ref<Stats>({
  pemesanan_hari_ini: 0,
  sedang_diproses: 0,
  selesai_hari_ini: 0,
});

const lowStockCount = ref(0);
const recentBookings = ref<Booking[]>([]);
const currentDate = ref("");
const mechanics = ref<MechanicProfile[]>([]);
const selectedMechanicForBooking = ref<{ [bookingId: number]: number }>({});

// Computed

const mechanicOptions = computed(() =>
  mechanics.value.map((m) => ({ value: m.id, label: m.nama })),
);

// Functions

const changeStatus = async (booking: Booking, newStatus: string) => {
  try {
    await axios.patch(
      `${API_URL}/admin/pemesanan/${booking.id}/status`,
      { status: newStatus },
      { headers: getAuthHeaders() },
    );

    booking.status = newStatus;
    toast.success("Status pemesanan berhasil diubah!");
  } catch (error: any) {
    logError(error, "changeStatus");
    toast.error(handleApiError(error));
  }
};

const assignMechanicAndStart = async (booking: Booking) => {
  const mechanicId = selectedMechanicForBooking.value[booking.id];

  if (!mechanicId) {
    toast.error("Pilih mekanik terlebih dahulu");
    return;
  }

  try {
    // Assign mekanik
    await axios.patch(
      `${API_URL}/admin/pemesanan/${booking.id}/tugaskan-mekanik`,
      { id_mekanik: mechanicId },
      { headers: getAuthHeaders() },
    );

    // Update status ke In Progress
    await axios.patch(
      `${API_URL}/admin/pemesanan/${booking.id}/status`,
      { status: BOOKING_STATUS.IN_PROGRESS },
      { headers: getAuthHeaders() },
    );

    booking.status = BOOKING_STATUS.IN_PROGRESS;
    booking.id_mekanik = mechanicId;
    booking.mekanik = mechanics.value.find((m) => m.id === mechanicId) || null;

    toast.success("Mekanik di-assign dan servis dimulai!");
    await fetchDashboardData();
  } catch (error: any) {
    logError(error, "assignMechanicAndStart");
    toast.error(handleApiError(error));
  }
};

const fetchMechanics = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
      headers: getAuthHeaders(),
    });
    mechanics.value = data.data || [];
  } catch (error: any) {
    logError(error, "fetchMechanics");
    toast.error(handleApiError(error));
  }
};

const fetchDashboardData = async () => {
  try {
    const [statsRes, bookingsRes, lowStockRes] = await Promise.all([
      axios.get(`${API_URL}/admin/dashboard/statistik`, {
        headers: getAuthHeaders(),
      }),
      axios.get(`${API_URL}/admin/dashboard/pemesanan-terbaru`, {
        headers: getAuthHeaders(),
      }),
      axios.get(`${API_URL}/admin/inventori/stok-menipis`, {
        headers: getAuthHeaders(),
      }),
    ]);

    stats.value = statsRes.data;
    recentBookings.value = bookingsRes.data;
    lowStockCount.value = lowStockRes.data.data?.length || 0;
  } catch (error: any) {
    logError(error, "fetchDashboardData");
    toast.error(handleApiError(error));
  }
};

// Lifecycle
onMounted(() => {
  fetchDashboardData();
  fetchMechanics();
  currentDate.value = formatDateShort(new Date());
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Dasbor Admin"
      icon="mdi-view-dashboard"
      :subtitle="currentDate"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Summary Cards -->
      <AdminDashboardStatsCards
        :stats="stats"
        :low-stock-count="lowStockCount"
      />

      <!-- Recent Bookings -->
      <AdminDashboardRecentBookings
        :bookings="recentBookings"
        :mechanic-options="mechanicOptions"
        v-model:selected-mechanics="selectedMechanicForBooking"
        @status-change="changeStatus"
        @assign-and-start="assignMechanicAndStart"
      />
    </div>
  </div>
</template>
