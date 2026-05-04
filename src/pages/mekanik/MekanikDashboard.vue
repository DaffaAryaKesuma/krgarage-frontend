<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import MekanikSelectSparepartForJobModal from "@/components/mekanik/dashboard/MekanikSelectSparepartForJobModal.vue";
import MekanikCompleteJobModal from "@/components/mekanik/dashboard/MekanikCompleteJobModal.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MekanikDashboardTabs from "@/components/mekanik/dashboard/MekanikDashboardTabs.vue";
import MekanikStatusFilters from "@/components/mekanik/dashboard/MekanikStatusFilters.vue";
import MekanikHistoryFilters from "@/components/mekanik/dashboard/MekanikHistoryFilters.vue";
import MekanikJobsGrid from "@/components/mekanik/dashboard/MekanikJobsGrid.vue";
import { useMekanikBookings } from "@/composables/useMekanikBookings";
import { useMekanikDashboardActions } from "@/composables/useMekanikDashboardActions";

// Refs
const activeTab = ref<"active" | "history">("active");
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
} = useMekanikBookings(activeTab);

const {
  showAddSparepartModal,
  selectedBookingId,
  showCompleteJobModal,
  isCompletingJob,
  completeJobTarget,
  showConfirmModal,
  confirmModalData,
  handleUpdateStatus,
  closeCompleteJobModal,
  submitCompleteJob,
  handleAddSparepart,
  handleDeleteSparepart,
  handleConfirm,
  handleCancel,
  closeSparepartModal,
  onSparepartAdded,
} = useMekanikDashboardActions({
  activeBookings,
  fetchData,
});

// Activity ping to update last_seen
let pingTimer: number | undefined;

async function sendPing() {
  try {
    await axios.post("/api/ping");
  } catch (error) {
    // Ignore errors silently - just for activity tracking
    console.debug("Ping error (non-critical):", error);
  }
}

// Lifecycle
onMounted(() => {
  void fetchActiveJobs();

  // Send ping immediately and then every 30 seconds
  sendPing();
  pingTimer = window.setInterval(sendPing, 30 * 1000);
});

onUnmounted(() => {
  if (pingTimer) clearInterval(pingTimer);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <MekanikDashboardTabs
      v-model:active-tab="activeTab"
      @history-click="fetchHistory(1)"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Active Jobs Tab -->
      <div v-if="activeTab === 'active'">
        <MekanikJobsGrid
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
        <MekanikHistoryFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @filter-change="onFilterChange"
        />

        <MekanikJobsGrid
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
    <MekanikSelectSparepartForJobModal
      v-if="showAddSparepartModal && selectedBookingId"
      :booking-id="selectedBookingId"
      :show="showAddSparepartModal"
      @close="closeSparepartModal"
      @success="onSparepartAdded"
    />

    <MekanikCompleteJobModal
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
