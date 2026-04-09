<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { formatDateShort } from "../../utils/date";
import AdminDashboardStatsCards from "@/components/admin/dashboard/AdminDashboardStatsCards.vue";
import AdminDashboardRecentBookings from "@/components/admin/dashboard/AdminDashboardRecentBookings.vue";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

const toast = useToast();

// Interfaces
interface Stats {
  pemesanan_hari_ini: number;
  sedang_diproses: number;
  selesai_hari_ini: number;
}

interface Booking {
  id: number;
  kode_pemesanan: string;
  pengguna: { nama: string };
  tanggal_pemesanan: string;
  status: string;
  id_mekanik: number | null;
  mekanik?: { id: number; nama: string } | null;
}

interface Mechanic {
  id: number;
  nama: string;
  email: string;
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
const mechanics = ref<Mechanic[]>([]);
const selectedMechanicForBooking = ref<{ [bookingId: number]: number }>({});

// Computed

const mechanicOptions = computed(() =>
  mechanics.value.map((m) => ({ value: m.id, label: m.nama })),
);

// Functions

const changeStatus = async (booking: Booking, newStatus: string) => {
  try {
    await axios.patch(
      `${API_URL}/admin/bookings/${booking.id}/status`,
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
      `${API_URL}/admin/bookings/${booking.id}/assign-mechanic`,
      { id_mekanik: mechanicId },
      { headers: getAuthHeaders() },
    );

    // Update status ke In Progress
    await axios.patch(
      `${API_URL}/admin/bookings/${booking.id}/status`,
      { status: "In Progress" },
      { headers: getAuthHeaders() },
    );

    booking.status = "In Progress";
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
    const { data } = await axios.get(`${API_URL}/admin/mechanics`, {
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
      axios.get(`${API_URL}/admin/dashboard/stats`, {
        headers: getAuthHeaders(),
      }),
      axios.get(`${API_URL}/admin/dashboard/recent-bookings`, {
        headers: getAuthHeaders(),
      }),
      axios.get(`${API_URL}/admin/inventory/low-stock`, {
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
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 sm:gap-4">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <i class="mdi mdi-view-dashboard text-2xl sm:text-4xl"></i>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold mb-1">
                Dasbor Admin
              </h1>
              <p class="text-sm sm:text-base text-blue-100">
                {{ currentDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
