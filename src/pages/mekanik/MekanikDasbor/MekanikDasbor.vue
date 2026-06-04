<script setup lang="ts">
// Mengambil ref untuk state tab aktif dan onMounted untuk aksi saat halaman dibuka.
import { ref, onMounted } from "vue";
// Modal untuk menambahkan suku cadang ke pemesanan.
import TambahSukuCadangModal from "@/components/ui/TambahSukuCadangModal/TambahSukuCadangModal.vue";
// Modal input catatan saat mekanik menyelesaikan pekerjaan.
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
// Modal konfirmasi untuk aksi penting.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Komponen pagination untuk riwayat.
import Pagination from "@/components/ui/Pagination.vue";
// Komponen tab aktif/riwayat dashboard mekanik.
import MekanikDasborTabs from "@/components/mekanik/dasbor/MekanikDasborTabs.vue";
// Filter bulan dan tahun untuk riwayat mekanik.
import MekanikRiwayatFilters from "@/components/mekanik/dasbor/MekanikRiwayatFilters.vue";
// Grid kartu pekerjaan mekanik.
import MekanikPekerjaanGrid from "@/components/mekanik/dasbor/MekanikPekerjaanGrid/MekanikPekerjaanGrid.vue";
// Mengambil logika pengambilan data pemesanan mekanik.
import { useMekanikPemesanan } from "./useMekanikPemesanan";
// Mengambil logika aksi mekanik seperti selesai, tambah suku cadang, dan hapus item.
import { useMekanikDasborAksi } from "./useMekanikDasborAksi";
// Mengambil helper ping untuk update status online mekanik.
import { usePing } from "./usePing";

// Tab aktif dashboard: pekerjaan aktif atau riwayat.
const activeTab = ref<"active" | "riwayat">("active");
// Mengambil state dan fungsi data pemesanan mekanik.
const {
  // Daftar pekerjaan aktif.
  activePemesanan,
  // Daftar pekerjaan riwayat.
  riwayatPemesanan,
  // Daftar yang sudah difilter sesuai tab/filter.
  filteredPemesanan,
  // Status loading data.
  loading,
  // Filter tahun riwayat.
  selectedYear,
  // Filter bulan riwayat.
  selectedMonth,
  // Data pagination riwayat.
  riwayatPagination,
  // Fungsi ambil pekerjaan aktif.
  fetchActiveJobs,
  // Fungsi ambil riwayat.
  fetchRiwayat,
  // Fungsi ambil data sesuai tab aktif.
  fetchData,
  // Fungsi saat filter riwayat berubah.
  onFilterChange,
  // Fungsi saat halaman pagination berubah.
  handlePageChange,
} = useMekanikPemesanan(activeTab);

// Mengambil state dan fungsi aksi mekanik.
const {
  // Status tampil modal tambah suku cadang.
  showAddSukuCadangModal,
  // ID pemesanan yang sedang dipilih untuk tambah suku cadang.
  selectedPemesananId,
  // Daftar suku cadang yang bisa dipilih.
  sukuCadangList,
  // Status loading daftar suku cadang.
  isLoadingSukuCadang,
  // Status submit tambah suku cadang.
  isAddingSukuCadang,
  // Status tampil modal selesaikan pekerjaan.
  showCompleteJobModal,
  // Status submit selesai pekerjaan.
  isCompletingJob,
  // Data target pekerjaan yang akan diselesaikan.
  completeJobTarget,
  // Status tampil modal konfirmasi.
  showConfirmModal,
  // Data isi modal konfirmasi.
  confirmModalData,
  // Handler update status pekerjaan.
  handleUpdateStatus,
  // Menutup modal selesai pekerjaan.
  closeCompleteJobModal,
  // Submit catatan dan menyelesaikan pekerjaan.
  submitCompleteJob,
  // Membuka modal tambah suku cadang.
  handleAddSukuCadang,
  // Submit item suku cadang yang dipilih.
  submitSukuCadangItems,
  // Handler hapus suku cadang dari pemesanan.
  handleDeleteSukuCadang,
  // Konfirmasi aksi modal.
  handleConfirm,
  // Batalkan aksi modal.
  handleCancel,
  // Menutup modal suku cadang.
  closeSukuCadangModal,
} = useMekanikDasborAksi({
  activePemesanan,
  fetchData,
});

// Mengirim ping berkala agar status last_seen mekanik tetap terbarui.
usePing();

// Saat halaman dibuka, ambil pekerjaan aktif.
onMounted(() => {
  void fetchActiveJobs();
});
</script>

<template>
  <!-- Wrapper utama dashboard mekanik. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Tab untuk berpindah antara pekerjaan aktif dan riwayat. -->
    <MekanikDasborTabs
      v-model:active-tab="activeTab"
      @riwayat-click="fetchRiwayat(1)"
    />

    <!-- Area konten utama dashboard mekanik. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Tab pekerjaan aktif. -->
      <div v-if="activeTab === 'active'">
        <!-- Grid pekerjaan aktif mekanik. -->
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

      <!-- Tab riwayat pekerjaan. -->
      <div v-else-if="activeTab === 'riwayat'">
        <!-- Filter riwayat berdasarkan bulan dan tahun. -->
        <MekanikRiwayatFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @filter-change="onFilterChange"
        />

        <!-- Grid riwayat pekerjaan mekanik. -->
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

        <!-- Pagination hanya tampil jika data riwayat tersedia. -->
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

    <!-- Modal tambah suku cadang yang dipakai oleh pekerjaan aktif. -->
    <TambahSukuCadangModal
      v-if="showAddSukuCadangModal && selectedPemesananId"
      :show="showAddSukuCadangModal"
      :suku-cadang="sukuCadangList"
      :is-loading="isLoadingSukuCadang"
      :is-submitting="isAddingSukuCadang"
      @submit="submitSukuCadangItems"
      @close="closeSukuCadangModal"
    />

    <!-- Modal catatan mekanik saat menyelesaikan pekerjaan. -->
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

    <!-- Modal konfirmasi umum untuk aksi mekanik. -->
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
