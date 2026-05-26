<script setup lang="ts">
import { onMounted } from "vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { ref } from "vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminPemesananFilters from "@/components/admin/pemesanan/AdminPemesananFilters.vue";
import AdminPemesananKartu from "@/components/admin/pemesanan/AdminPemesananKartu.vue";
import { useAdminPemesananPage } from "./useAdminPemesananPage";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";

const {
  pemesanan,
  showTodayOnly,
  pagination,
  isLoading,
  error,
  searchQuery,
  monthFilter,
  yearFilter,
  statusFilter,
  pembayaranFilter,
  filteredPemesanan,
  selectedMekanikForPemesanan,
  mekanikOptions,
  fetchAllPemesanan,
  fetchMekaniks,
  confirmPemesanan,
  cancelPemesanan,
  completePemesanan,
  markPemesananAsPaid,
  assignMekanikAndStart,
  isCompleteModalOpen,
  handleCompleteClick,
  handleCompleteConfirm,
  isPaidConfirmOpen,
  handleMarkPaidClick,
  handleMarkPaidConfirm,
  isConfirmModalOpen,
  handleConfirmClick,
  handleConfirmConfirm,
  isCancelModalOpen,
  handleCancelClick,
  handleCancelConfirm,
  isAssignStartModalOpen,
  handleAssignStartClick,
  handleAssignStartConfirm,
} = useAdminPemesananPage();

onMounted(() => {
  fetchAllPemesanan();
  fetchMekaniks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Kelola Pemesanan"
      icon="mdi-clipboard-list"
      subtitle="Pantau dan kelola semua pemesanan servis pelanggan anda di sini"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

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
          v-else-if="pemesanan.length === 0"
          icon="mdi mdi-clipboard-list"
          title="Belum Ada Pemesanan"
          message="Belum ada pemesanan yang masuk dari pelanggan."
        />

        <!-- Main Content -->
        <div v-else>
          <!-- Filters -->
          <AdminPemesananFilters
            v-model:search-query="searchQuery"
            v-model:month-filter="monthFilter"
            v-model:year-filter="yearFilter"
            v-model:status-filter="statusFilter"
            v-model:pembayaran-filter="pembayaranFilter"
            v-model:show-today-only="showTodayOnly"
            :total-pemesanan="pemesanan.length"
            :filtered-count="filteredPemesanan.length"
          />

          <!-- Empty Filtered Results -->
          <EmptyState
            v-if="filteredPemesanan.length === 0"
            icon="mdi mdi-magnify-close"
            title="Tidak Ada Hasil"
            message="Tidak ada pemesanan yang sesuai dengan filter yang dipilih."
          />

          <!-- Pemesanan Kartu Grid -->
          <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminPemesananKartu
              v-for="pemesanan in filteredPemesanan"
              :key="pemesanan.id"
              :pemesanan="pemesanan"
              :mekanik-options="mekanikOptions"
              v-model:selected-mekanik-id="
                selectedMekanikForPemesanan[pemesanan.id]
              "
              @confirm="handleConfirmClick"
              @cancel="handleCancelClick"
              @complete="handleCompleteClick"
              @mark-paid="handleMarkPaidClick"
              @assign-and-start="handleAssignStartClick"
            />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="filteredPemesanan.length > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :total="pagination.total"
            :per-page="pagination.per_page"
            :from="pagination.from"
            :to="pagination.to"
            @page-change="fetchAllPemesanan"
          />
        </div>
      </section>
    </div>
  </div>

  <CatatanInputModal
    :show="isCompleteModalOpen"
    title="Tandai Selesai"
    message="Tuliskan catatan servis untuk pelanggan"
    confirm-text="Tandai Selesai"
    required
    @confirm="handleCompleteConfirm"
    @cancel="isCompleteModalOpen = false"
  />

  <ConfirmationModal
    :show="isPaidConfirmOpen"
    title="Konfirmasi Pembayaran"
    message="Apakah Anda yakin ingin menandai pemesanan ini sebagai Lunas? Tindakan ini tidak dapat dibatalkan."
    confirm-text="Ya, Tandai Lunas"
    cancel-text="Batal"
    variant="success"
    @confirm="handleMarkPaidConfirm"
    @cancel="isPaidConfirmOpen = false"
  />

  <ConfirmationModal
    :show="isConfirmModalOpen"
    title="Konfirmasi Pemesanan"
    message="Apakah Anda yakin ingin menyetujui dan mengonfirmasi pemesanan ini?"
    confirm-text="Ya, Konfirmasi"
    cancel-text="Batal"
    variant="info"
    @confirm="handleConfirmConfirm"
    @cancel="isConfirmModalOpen = false"
  />

  <ConfirmationModal
    :show="isCancelModalOpen"
    title="Batalkan Pemesanan"
    message="Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dibatalkan."
    confirm-text="Ya, Batalkan"
    cancel-text="Batal"
    variant="danger"
    @confirm="handleCancelConfirm"
    @cancel="isCancelModalOpen = false"
  />

  <ConfirmationModal
    :show="isAssignStartModalOpen"
    title="Mulai Pekerjaan Servis"
    message="Apakah Anda yakin ingin menugaskan mekanik yang dipilih dan memulai pekerjaan servis ini?"
    confirm-text="Ya, Mulai Servis"
    cancel-text="Batal"
    variant="info"
    @confirm="handleAssignStartConfirm"
    @cancel="isAssignStartModalOpen = false"
  />
</template>
