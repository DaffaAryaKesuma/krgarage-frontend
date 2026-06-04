<script setup lang="ts">
// Modal konfirmasi dipakai sebelum admin menghapus suku cadang.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Loading saat data inventaris sedang diambil dari API.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Header standar halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Kartu statistik inventaris: total, stok aman, dan stok menipis.
import AdminInventarisStatistikKartu from "@/components/admin/inventaris/AdminInventarisStatistikKartu.vue";
// Komponen filter pencarian, kategori, dan stok menipis.
import AdminInventarisFilters from "@/components/admin/inventaris/AdminInventarisFilters.vue";
// Tabel daftar suku cadang.
import AdminInventarisTabel from "@/components/admin/inventaris/AdminInventarisTabel.vue";
// Modal form untuk tambah dan edit suku cadang.
import AdminInventarisFormModal from "@/components/admin/inventaris/AdminInventarisFormModal/AdminInventarisFormModal.vue";
// Modal khusus untuk menambah stok suku cadang.
import AdminInventarisStokUlangModal from "@/components/admin/inventaris/AdminInventarisStokUlangModal/AdminInventarisStokUlangModal.vue";
// Composable yang menyimpan seluruh logika halaman inventaris admin.
import { useAdminInventarisPage } from "./useAdminInventarisPage";

// State dan function diambil dari composable agar file template fokus ke tampilan.
const {
  kategoriOptions,
  kategoriFilterOptions,
  loading,
  searchQuery,
  selectedKategori,
  showLowStock,
  showModal,
  showRestockModal,
  showDeleteConfirm,
  selectedSukuCadang,
  restockQuantity,
  restockUnitPrice,
  restockUpdateMasterPrice,
  restockNote,
  categoryName,
  categoryLoading,
  form,
  filteredSukuCadang,
  statistik,
  openCreateModal,
  openEditModal,
  closeModal,
  openRestockModal,
  closeRestockModal,
  showDeleteConfirmModal,
  saveCategory,
  saveSukuCadang,
  restock,
  deleteSukuCadang,
} = useAdminInventarisPage();
</script>

<template>
  <!-- Container utama halaman inventaris. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman inventaris admin. -->
    <AppPageHeader
      title="Inventori Suku Cadang"
      icon="mdi-package-variant"
      subtitle="Kelola stok suku cadang bengkel"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Konten utama: statistik, filter, lalu tabel. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Ringkasan angka inventaris. -->
      <AdminInventarisStatistikKartu :statistik="statistik" />

      <!-- Filter memakai v-model agar nilai input langsung tersimpan di composable. -->
      <AdminInventarisFilters
        v-model:search-query="searchQuery"
        v-model:selected-kategori="selectedKategori"
        v-model:show-low-stock="showLowStock"
        :kategori-options="kategoriFilterOptions"
        @add-new="openCreateModal"
      />

      <!-- Muncul ketika API inventaris masih loading. -->
      <LoadingSpinner v-if="loading" message="Memuat data..." />

      <!-- Tabel menerima data yang sudah difilter dari computed filteredSukuCadang. -->
      <AdminInventarisTabel
        v-else
        :sukucadang="filteredSukuCadang"
        @restock="openRestockModal"
        @edit="openEditModal"
        @delete="showDeleteConfirmModal"
      />
    </div>

    <!-- Modal tambah/edit suku cadang. -->
    <AdminInventarisFormModal
      :show="showModal"
      v-model:form="form"
      :selected-suku-cadang="selectedSukuCadang"
      :loading="loading"
      :kategori-options="kategoriOptions"
      v-model:category-name="categoryName"
      :category-loading="categoryLoading"
      @close="closeModal"
      @submit="saveSukuCadang"
      @create-category="saveCategory"
    />

    <!-- Modal restock untuk menambah jumlah stok. -->
    <AdminInventarisStokUlangModal
      :show="showRestockModal"
      :selected-suku-cadang="selectedSukuCadang"
      v-model:restock-quantity="restockQuantity"
      v-model:restock-unit-price="restockUnitPrice"
      v-model:restock-update-master-price="restockUpdateMasterPrice"
      v-model:restock-note="restockNote"
      :loading="loading"
      @close="closeRestockModal"
      @submit="restock"
    />

    <!-- Modal konfirmasi hapus agar admin tidak tidak sengaja menghapus data. -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Suku Cadang"
      message="Apakah Anda yakin ingin menghapus suku cadang ini? Data tidak dapat dikembalikan."
      confirm-text="Hapus"
      cancel-text="Batal"
      variant="danger"
      @confirm="deleteSukuCadang"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
