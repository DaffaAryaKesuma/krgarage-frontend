<script setup lang="ts">
import { ref, onMounted } from "vue";
import TambahSukuCadangModal from "@/components/ui/TambahSukuCadangModal/TambahSukuCadangModal.vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MekanikDasborTabs from "@/components/mekanik/dasbor/MekanikDasborTabs.vue";
import MekanikRiwayatFilters from "@/components/mekanik/dasbor/MekanikRiwayatFilters.vue";
import MekanikPekerjaanGrid from "@/components/mekanik/dasbor/MekanikPekerjaanGrid/MekanikPekerjaanGrid.vue";
import { useMekanikPemesanan } from "./useMekanikPemesanan";
import { useMekanikDasborAksi } from "./useMekanikDasborAksi";
import { usePing } from "./usePing";

// Refs
const activeTab = ref<"active" | "riwayat">("active");
const {
  activePemesanan,
  riwayatPemesanan,
  filteredPemesanan,
  loading,
  selectedYear,
  selectedMonth,
  riwayatPagination,
  fetchActiveJobs,
  fetchRiwayat,
  fetchData,
  onFilterChange,
  handlePageChange,
} = useMekanikPemesanan(activeTab);

const {
  showAddSukuCadangModal,
  selectedPemesananId,
  sukuCadangList,
  isLoadingSukuCadang,
  isAddingSukuCadang,
  showCompleteJobModal,
  isCompletingJob,
  completeJobTarget,
  showConfirmModal,
  confirmModalData,
  handleUpdateStatus,
  closeCompleteJobModal,
  submitCompleteJob,
  handleAddSukuCadang,
  submitSukuCadangItems,
  handleDeleteSukuCadang,
  handleConfirm,
  handleCancel,
  closeSukuCadangModal,
} = useMekanikDasborAksi({
  activePemesanan,
  fetchData,
});

// Activity ping to update last_seen
usePing();

// Lifecycle
onMounted(() => {
  void fetchActiveJobs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <MekanikDasborTabs
      v-model:active-tab="activeTab"
      @riwayat-click="fetchRiwayat(1)"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Active Jobs Tab -->
      <div v-if="activeTab === 'active'">
        <MekanikPekerjaanGrid
          :pemesanan="filteredPemesanan"
          :loading="loading"
          empty-title="Tidak ada pekerjaan"
          empty-message="Tidak ada pekerjaan aktif saat ini."
          @update-status="handleUpdateStatus"
          @add-suku-cadang="handleAddSukuCadang"
          @delete-suku-cadang="handleDeleteSukuCadang"
        />
      </div>

      <!-- Riwayat Tab -->
      <div v-else-if="activeTab === 'riwayat'">
        <MekanikRiwayatFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @filter-change="onFilterChange"
        />

        <MekanikPekerjaanGrid
          :pemesanan="filteredPemesanan"
          :loading="loading"
          empty-icon="mdi mdi-history"
          empty-title="Tidak ada riwayat"
          empty-message="Belum ada pekerjaan yang selesai atau dibatalkan."
          loading-message="Memuat riwayat..."
          @update-status="handleUpdateStatus"
          @add-suku-cadang="handleAddSukuCadang"
          @delete-suku-cadang="handleDeleteSukuCadang"
        />

        <!-- Pagination -->
        <Pagination
          v-if="!loading && riwayatPemesanan.length > 0"
          :current-page="riwayatPagination.current_page"
          :last-page="riwayatPagination.last_page"
          :total="riwayatPagination.total"
          :per-page="riwayatPagination.per_page"
          :from="riwayatPagination.from"
          :to="riwayatPagination.to"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Shared Suku Cadang Modal -->
    <TambahSukuCadangModal
      v-if="showAddSukuCadangModal && selectedPemesananId"
      :show="showAddSukuCadangModal"
      :suku-cadang="sukuCadangList"
      :is-loading="isLoadingSukuCadang"
      :is-submitting="isAddingSukuCadang"
      @submit="submitSukuCadangItems"
      @close="closeSukuCadangModal"
    />

    <CatatanInputModal
      :show="showCompleteJobModal"
      :loading="isCompletingJob"
      title="Selesaikan Pekerjaan"
      :subtitle="completeJobTarget?.kodePemesanan ? `Kode Pemesanan: ${completeJobTarget.kodePemesanan}` : undefined"
      message="Tuliskan catatan servis untuk pelanggan. Catatan ini akan disimpan saat pekerjaan diselesaikan."
      confirm-text="Selesaikan Pekerjaan"
      required
      @cancel="closeCompleteJobModal"
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
