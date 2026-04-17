<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import MechanicSelectSparepartForJobModal from "@/components/mechanic/dashboard/MechanicSelectSparepartForJobModal.vue";
import MechanicCompleteJobModal from "@/components/mechanic/dashboard/MechanicCompleteJobModal.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MechanicDashboardTabs from "@/components/mechanic/dashboard/MechanicDashboardTabs.vue";
import MechanicStatusFilters from "@/components/mechanic/dashboard/MechanicStatusFilters.vue";
import MechanicHistoryFilters from "@/components/mechanic/dashboard/MechanicHistoryFilters.vue";
import MechanicJobsGrid from "@/components/mechanic/dashboard/MechanicJobsGrid.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { getMechanicNextStatus } from "@/utils/statusBadge";
import { useMechanicBookings } from "@/composables/useMechanicBookings";
import type { MechanicBooking } from "@/types/booking";

const router = useRouter();
const toast = useToast();

// Refs
const activeTab = ref<"active" | "history">("active");
const showAddSparepartModal = ref(false);
const selectedBookingId = ref<number | null>(null);
const showCompleteJobModal = ref(false);
const isCompletingJob = ref(false);
const completeJobTarget = ref<{ id: number; kodePemesanan: string } | null>(
  null,
);
const {
  activeBookings,
  historyBookings,
  filteredBookings,
  loading,
  statusFilter,
  selectedYear,
  selectedMonth,
  historyPagination,
  fetchActiveJobs,
  fetchHistory,
  fetchData,
  onFilterChange,
  handlePageChange,
} = useMechanicBookings(activeTab);

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

const getValidAuthHeaders = () => {
  const headers = getAuthHeaders();
  if (!Object.keys(headers).length) {
    router.push("/");
    return null;
  }
  return headers;
};

// Update booking status with case-insensitive check
const handleUpdateStatus = async (bookingId: number) => {
  const booking = activeBookings.value.find((b) => b.id === bookingId);
  if (!booking) return;

  const newStatus = getMechanicNextStatus(booking.status);
  let confirmMessage = "";
  let variant: "danger" | "warning" | "info" = "info";

  if (newStatus === "In Progress") {
    confirmMessage = "Apakah Anda yakin ingin memulai pekerjaan ini?";
    variant = "info";
  } else if (newStatus === "Completed") {
    completeJobTarget.value = {
      id: booking.id,
      kodePemesanan: booking.kode_pemesanan,
    };
    showCompleteJobModal.value = true;
    return;
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
        const headers = getValidAuthHeaders();
        if (!headers) {
          return;
        }

        const response = await axios.put(
          `${API_URL}/mekanik/pemesanan/${bookingId}/status`,
          { status: newStatus },
          { headers },
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

const closeCompleteJobModal = () => {
  showCompleteJobModal.value = false;
  completeJobTarget.value = null;
};

const submitCompleteJob = async (catatanMekanik: string) => {
  if (!completeJobTarget.value) {
    return;
  }

  try {
    isCompletingJob.value = true;

    const headers = getValidAuthHeaders();
    if (!headers) {
      return;
    }

    const response = await axios.put(
      `${API_URL}/mekanik/pemesanan/${completeJobTarget.value.id}/status`,
      {
        status: "Completed",
        catatan_mekanik: catatanMekanik,
      },
      { headers },
    );

    if (response.data.success) {
      toast.success("Pekerjaan berhasil diselesaikan");
      closeCompleteJobModal();
      await fetchData();
    }
  } catch (error: any) {
    logError(error, "submitCompleteJob");
    toast.error(handleApiError(error));
  } finally {
    isCompletingJob.value = false;
  }
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
        const headers = getValidAuthHeaders();
        if (!headers) {
          return;
        }

        await axios.delete(
          `${API_URL}/mekanik/pemesanan/${bookingId}/item/${itemId}`,
          { headers },
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

// Lifecycle
onMounted(() => {
  void fetchActiveJobs();
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

    <MechanicCompleteJobModal
      :show="showCompleteJobModal"
      :loading="isCompletingJob"
      :booking-code="completeJobTarget?.kodePemesanan"
      @close="closeCompleteJobModal"
      @confirm="submitCompleteJob"
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
