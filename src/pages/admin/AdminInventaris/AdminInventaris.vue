<script setup lang="ts">
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminInventarisStatistikKartu from "@/components/admin/inventaris/AdminInventarisStatistikKartu.vue";
import AdminInventarisFilters from "@/components/admin/inventaris/AdminInventarisFilters.vue";
import AdminInventarisTabel from "@/components/admin/inventaris/AdminInventarisTabel.vue";
import AdminInventarisFormModal from "@/components/admin/inventaris/AdminInventarisFormModal.vue";
import AdminInventarisStokUlangModal from "@/components/admin/inventaris/AdminInventarisStokUlangModal.vue";
import { useAdminInventarisPage } from "./useAdminInventarisPage";

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
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Inventori Suku Cadang"
      icon="mdi-package-variant"
      subtitle="Kelola stok suku cadang bengkel"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <AdminInventarisStatistikKartu :statistik="statistik" />

      <AdminInventarisFilters
        v-model:search-query="searchQuery"
        v-model:selected-kategori="selectedKategori"
        v-model:show-low-stock="showLowStock"
        :kategori-options="kategoriFilterOptions"
        @add-new="openCreateModal"
      />

      <LoadingSpinner v-if="loading" message="Memuat data..." />

      <AdminInventarisTabel
        v-else
        :sukucadang="filteredSukuCadang"
        @restock="openRestockModal"
        @edit="openEditModal"
        @delete="showDeleteConfirmModal"
      />
    </div>

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

    <AdminInventarisStokUlangModal
      :show="showRestockModal"
      :selected-suku-cadang="selectedSukuCadang"
      v-model:restock-quantity="restockQuantity"
      :loading="loading"
      @close="closeRestockModal"
      @submit="restock"
    />

    <!-- Delete Confirmation Modal -->
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
