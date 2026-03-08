<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import MechanicSelectSparepartForJobModal from "../../components/mechanic/MechanicSelectSparepartForJobModal.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MechanicDashboardTabs from "@/components/mechanic/dashboard/MechanicDashboardTabs.vue";
import MechanicStatusFilters from "@/components/mechanic/dashboard/MechanicStatusFilters.vue";
import MechanicHistoryFilters from "@/components/mechanic/dashboard/MechanicHistoryFilters.vue";
import MechanicJobsGrid from "@/components/mechanic/dashboard/MechanicJobsGrid.vue";
import { API_URL } from "@/utils/api";

interface BookingItem {
  id: number;
  suku_cadang: {
    nama_suku_cadang: string;
    kategori: string;
  };
  jumlah: number;
  harga_saat_ini: number;
}

interface Booking {
  id: number;
  kode_pemesanan: string;
  pengguna: {
    nama: string;
    email: string;
  };
  vespa: {
    model: string;
    tahun_produksi: number;
    plat_nomor: string;
  };
  layanan?: { id: number; nama_layanan: string }[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  catatan_pelanggan?: string;
  item_pemesanan?: BookingItem[];
}

const router = useRouter();
const toast = useToast();

// Refs
const activeTab = ref<"active" | "history">("active");
const activeBookings = ref<Booking[]>([]);
const historyBookings = ref<Booking[]>([]);
const loading = ref(false);
const showAddSparepartModal = ref(false);
const selectedBookingId = ref<number | null>(null);
const statusFilter = ref<"all" | "pending" | "confirmed" | "in_progress">(
  "all",
);

// History filters and pagination
const selectedYear = ref<number>(0);
const selectedMonth = ref<number>(0);
const historyPagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
  from: 0,
  to: 0,
});

// Confirmation Modal States
const showConfirmModal = ref(false);
const confirmModalData = ref<{
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}>({
  title: "",
  message: "",
  variant: "info",
  onConfirm: () => {},
});

// Fetch active jobs (no pagination needed, usually small dataset)
const fetchActiveJobs = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Fetch all active bookings (not Completed/Cancelled)
    const response = await axios.get(
      `${API_URL}/mechanic/bookings?per_page=1000`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // Filter client-side for active jobs only
    activeBookings.value = response.data.data.filter(
      (b: Booking) => b.status !== "Completed" && b.status !== "Cancelled",
    );
  } catch (error: any) {
    logError(error, "fetchActiveJobs");
    toast.error(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

// Fetch history with pagination and server-side filtering
const fetchHistory = async (page: number = 1) => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: historyPagination.value.per_page.toString(),
    });

    if (selectedYear.value !== 0) {
      params.append("year", selectedYear.value.toString());
    }
    if (selectedMonth.value !== 0) {
      params.append("month", selectedMonth.value.toString());
    }

    const response = await axios.get(
      `${API_URL}/mechanic/bookings?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    // Filter for completed/cancelled only
    historyBookings.value = response.data.data.filter(
      (b: Booking) => b.status === "Completed" || b.status === "Cancelled",
    );

    Object.assign(historyPagination.value, {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      per_page: response.data.per_page,
      from: response.data.from,
      to: response.data.to,
    });
  } catch (error: any) {
    logError(error, "fetchHistory");
    toast.error(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

// Unified fetch based on active tab
const fetchData = () => {
  if (activeTab.value === "active") {
    fetchActiveJobs();
  } else {
    fetchHistory(historyPagination.value.current_page);
  }
};

// Update booking status with case-insensitive check
const handleUpdateStatus = async (bookingId: number) => {
  const booking = activeBookings.value.find((b) => b.id === bookingId);
  if (!booking) return;

  const currentStatus = booking.status.toLowerCase();

  let newStatus = "";
  let confirmMessage = "";
  let variant: "danger" | "warning" | "info" = "info";

  if (currentStatus === "pending" || currentStatus === "confirmed") {
    newStatus = "In Progress";
    confirmMessage = "Apakah Anda yakin ingin memulai pekerjaan ini?";
    variant = "info";
  } else if (
    currentStatus === "in_progress" ||
    currentStatus === "in progress"
  ) {
    newStatus = "Completed";
    confirmMessage = "Apakah Anda yakin pekerjaan ini sudah selesai?";
    variant = "info";
  } else {
    toast.error("Status tidak dapat diubah");
    return;
  }

  showConfirm(
    "Konfirmasi Perubahan Status",
    confirmMessage,
    variant,
    async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/mechanic/bookings/${bookingId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          toast.success("Status berhasil diperbarui");
          await fetchData();
        }
      } catch (error: any) {
        logError(error, "handleUpdateStatus");
        toast.error(handleApiError(error));
      }
    },
  );
};

// Handle add sparepart
const handleAddSparepart = (bookingId: number) => {
  selectedBookingId.value = bookingId;
  showAddSparepartModal.value = true;
};

// Handle delete sparepart
const handleDeleteSparepart = async (bookingId: number, itemId: number) => {
  showConfirm(
    "Hapus Sparepart",
    "Apakah Anda yakin ingin menghapus sparepart ini?",
    "danger",
    async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_URL}/mechanic/bookings/${bookingId}/items/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Sparepart berhasil dihapus");
        await fetchData();
      } catch (error: any) {
        console.error("Error deleting sparepart:", error);
        toast.error("Gagal menghapus sparepart");
      }
    },
  );
};

// Confirmation Modal Functions
const showConfirm = (
  title: string,
  message: string,
  variant: "danger" | "warning" | "info",
  onConfirm: () => void,
) => {
  confirmModalData.value = { title, message, variant, onConfirm };
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  confirmModalData.value.onConfirm();
  showConfirmModal.value = false;
};

const handleCancel = () => {
  showConfirmModal.value = false;
};

// Close sparepart modal and refresh
const closeSparepartModal = () => {
  showAddSparepartModal.value = false;
  selectedBookingId.value = null;
};

const onSparepartAdded = async () => {
  closeSparepartModal();
  await fetchData();
  // Toast sudah ditampilkan di modal child
};

// Computed property for filtered bookings
const filteredBookings = computed(() => {
  if (activeTab.value === "history") {
    return historyBookings.value;
  }

  // Active tab - client-side filtering by status
  if (statusFilter.value === "all") {
    return activeBookings.value;
  }

  const statusMap: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
  };

  const targetStatus = statusMap[statusFilter.value];
  return activeBookings.value.filter((b) => b.status === targetStatus);
});

// Watch filters to refetch history
const onFilterChange = () => {
  if (activeTab.value === "history") {
    historyPagination.value.current_page = 1;
    fetchHistory(1);
  }
};

// Handle pagination change
const handlePageChange = (page: number) => {
  fetchHistory(page);
};

// Lifecycle
onMounted(() => {
  fetchActiveJobs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <MechanicDashboardTabs
      v-model:active-tab="activeTab"
      @history-click="fetchHistory(1)"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Active Jobs Tab -->
      <div v-if="activeTab === 'active'">
        <MechanicStatusFilters v-model:status-filter="statusFilter" />

        <MechanicJobsGrid
          :bookings="filteredBookings"
          :loading="loading"
          empty-title="Tidak ada pekerjaan"
          empty-message="Tidak ada pekerjaan aktif saat ini."
          @update-status="handleUpdateStatus"
          @add-sparepart="handleAddSparepart"
          @delete-sparepart="handleDeleteSparepart"
        />
      </div>

      <!-- History Tab -->
      <div v-else-if="activeTab === 'history'">
        <MechanicHistoryFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @filter-change="onFilterChange"
        />

        <MechanicJobsGrid
          :bookings="filteredBookings"
          :loading="loading"
          empty-icon="mdi mdi-history"
          empty-title="Tidak ada riwayat"
          empty-message="Belum ada pekerjaan yang selesai atau dibatalkan."
          loading-message="Memuat riwayat..."
          @update-status="handleUpdateStatus"
          @add-sparepart="handleAddSparepart"
          @delete-sparepart="handleDeleteSparepart"
        />

        <!-- Pagination -->
        <Pagination
          v-if="!loading && historyBookings.length > 0"
          :current-page="historyPagination.current_page"
          :last-page="historyPagination.last_page"
          :total="historyPagination.total"
          :per-page="historyPagination.per_page"
          :from="historyPagination.from"
          :to="historyPagination.to"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Select Sparepart Modal -->
    <MechanicSelectSparepartForJobModal
      v-if="showAddSparepartModal && selectedBookingId"
      :booking-id="selectedBookingId"
      :show="showAddSparepartModal"
      @close="closeSparepartModal"
      @success="onSparepartAdded"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      :variant="confirmModalData.variant"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>
