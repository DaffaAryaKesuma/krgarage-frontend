<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import AdminBookingsFilters from "@/components/admin/bookings/AdminBookingsFilters.vue";
import AdminBookingCard from "@/components/admin/bookings/AdminBookingCard.vue";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

const toast = useToast();

// Interfaces
interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  total_harga: number | null;
  id_mekanik: number | null;
  pengguna: { nama: string; email: string };
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
  mekanik?: { id: number; nama: string } | null;
}

interface Mechanic {
  id: number;
  nama: string;
  email: string;
}

// State
const bookings = ref<Booking[]>([]);
const mechanics = ref<Mechanic[]>([]);
const showTodayOnly = ref(false);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
});

const isLoading = ref(true);
const error = ref("");
const searchQuery = ref("");
const monthFilter = ref("");
const yearFilter = ref(new Date().getFullYear().toString());
const statusFilter = ref("all");

// Computed
const filteredBookings = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  return bookings.value.filter((booking) => {
    if (statusFilter.value !== "all" && booking.status !== statusFilter.value) {
      return false;
    }

    // Filter berdasarkan bulan dan tahun_produksi
    if (monthFilter.value || yearFilter.value) {
      const bookingDate = new Date(booking.tanggal_pemesanan);
      const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, "0");
      const bookingYear = bookingDate.getFullYear().toString();

      if (monthFilter.value && bookingMonth !== monthFilter.value) {
        return false;
      }

      if (yearFilter.value && bookingYear !== yearFilter.value) {
        return false;
      }
    }

    // Filter booking hari ini
    if (showTodayOnly.value) {
      const bookingDate = booking.tanggal_pemesanan.split("T")[0];
      if (bookingDate !== today) {
        return false;
      }
    }

    if (!query) return true;

    return (
      booking.pengguna?.nama.toLowerCase().includes(query) ||
      booking.vespa?.model.toLowerCase().includes(query) ||
      booking.vespa?.plat_nomor.toLowerCase().includes(query)
    );
  });
});

// Functions
async function fetchAllBookings(page = 1) {
  isLoading.value = true;
  error.value = "";

  try {
    const { data } = await axios.get(
      `${API_URL}/admin/bookings?page=${page}&per_page=${pagination.value.per_page}`,
      { headers: getAuthHeaders() },
    );

    bookings.value = data.data || [];
    Object.assign(pagination.value, {
      current_page: data.current_page,
      last_page: data.last_page,
      per_page: data.per_page,
      total: data.total,
      from: data.from || 0,
      to: data.to || 0,
    });
  } catch (err: any) {
    console.error("Gagal mengambil data pemesanan:", err);
    error.value =
      err.response?.status === 401
        ? "Sesi tidak valid. Silakan login kembali."
        : "Gagal memuat data pemesanan.";
  } finally {
    isLoading.value = false;
  }
}

async function changeStatus(booking: Booking, newStatus: string) {
  try {
    const { data } = await axios.patch(
      `${API_URL}/admin/bookings/${booking.id}/status`,
      { status: newStatus },
      { headers: getAuthHeaders() },
    );

    booking.status = data.pemesanan?.status ?? newStatus;
    toast.success("Status pemesanan berhasil diubah!");
    await fetchAllBookings(pagination.value.current_page);
  } catch (err: any) {
    console.error("Gagal mengubah status:", err);
    toast.error(
      err.response?.data?.message || "Gagal mengubah status pemesanan.",
    );
  }
}

async function fetchMechanics() {
  try {
    const { data } = await axios.get(`${API_URL}/admin/mechanics`, {
      headers: getAuthHeaders(),
    });
    mechanics.value = data.data || [];
  } catch (err: any) {
    console.error("Gagal mengambil data mekanik:", err);
  }
}

// Quick action functions
async function confirmBooking(booking: Booking) {
  await changeStatus(booking, "Confirmed");
}

async function cancelBooking(booking: Booking) {
  await changeStatus(booking, "Cancelled");
}

async function completeBooking(booking: Booking) {
  await changeStatus(booking, "Completed");
}

const selectedMechanicForBooking = ref<{ [bookingId: number]: number }>({});

async function assignMechanicAndStart(booking: Booking) {
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

    toast.success("Mekanik di-assign dan servis dimulai!");
    await fetchAllBookings(pagination.value.current_page);
  } catch (err: any) {
    console.error("Gagal assign mekanik dan mulai servis:", err);
    toast.error(err.response?.data?.message || "Gagal memproses pemesanan.");
  }
}

const mechanicOptions = computed(() =>
  mechanics.value.map((m) => ({ value: m.id, label: m.nama })),
);

// Lifecycle
onMounted(() => {
  fetchAllBookings();
  fetchMechanics();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <i class="mdi mdi-clipboard-list text-2xl sm:text-4xl"></i>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold mb-1">
                Kelola Pemesanan
              </h1>
              <p class="text-sm sm:text-base text-red-100">
                Pantau dan kelola semua pemesanan servis pelanggan anda di sini
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <section class="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Loading State -->
        <LoadingSpinner v-if="isLoading" message="Memuat data pemesanan..." />

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-600 py-8">
          {{ error }}
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else-if="bookings.length === 0"
          icon="mdi mdi-clipboard-list"
          title="Belum Ada Pemesanan"
          message="Belum ada pemesanan yang masuk dari customer."
        />

        <!-- Main Content -->
        <div v-else>
          <!-- Filters -->
          <AdminBookingsFilters
            v-model:search-query="searchQuery"
            v-model:month-filter="monthFilter"
            v-model:year-filter="yearFilter"
            v-model:status-filter="statusFilter"
            v-model:show-today-only="showTodayOnly"
            :total-bookings="bookings.length"
            :filtered-count="filteredBookings.length"
          />

          <!-- Empty Filtered Results -->
          <EmptyState
            v-if="filteredBookings.length === 0"
            icon="mdi mdi-magnify-close"
            title="Tidak Ada Hasil"
            message="Tidak ada pemesanan yang sesuai dengan filter yang dipilih."
          />

          <!-- Booking Cards Grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminBookingCard
              v-for="booking in filteredBookings"
              :key="booking.id"
              :booking="booking"
              :mechanic-options="mechanicOptions"
              v-model:selected-mechanic-id="
                selectedMechanicForBooking[booking.id]
              "
              @confirm="confirmBooking"
              @cancel="cancelBooking"
              @complete="completeBooking"
              @assign-and-start="assignMechanicAndStart"
            />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="filteredBookings.length > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :total="pagination.total"
            :per-page="pagination.per_page"
            :from="pagination.from"
            :to="pagination.to"
            @page-change="(page) => fetchAllBookings(page)"
          />
        </div>
      </section>
    </div>
  </div>
</template>
