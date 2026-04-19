<script setup lang="ts">
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminInventoryStatsCards from "@/components/admin/inventory/AdminInventoryStatsCards.vue";
import AdminInventoryFilters from "@/components/admin/inventory/AdminInventoryFilters.vue";
import AdminInventoryTable from "@/components/admin/inventory/AdminInventoryTable.vue";
import AdminInventoryFormModal from "@/components/admin/inventory/AdminInventoryFormModal.vue";
import AdminInventoryRestockModal from "@/components/admin/inventory/AdminInventoryRestockModal.vue";
import { useAdminInventoryPage } from "@/composables/useAdminInventoryPage";

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
  selectedSparepart,
  restockQuantity,
  form,
  filteredSpareparts,
  stats,
  openCreateModal,
  openEditModal,
  closeModal,
  openRestockModal,
  closeRestockModal,
  showDeleteConfirmModal,
  saveSparepart,
  restock,
  deleteSparepart,
} = useAdminInventoryPage();
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
      <AdminInventoryStatsCards :stats="stats" />

      <AdminInventoryFilters
        v-model:search-query="searchQuery"
        v-model:selected-kategori="selectedKategori"
        v-model:show-low-stock="showLowStock"
        :kategori-options="kategoriFilterOptions"
        @add-new="openCreateModal"
      />

      <LoadingSpinner v-if="loading" message="Memuat data..." />

      <AdminInventoryTable
        v-else
        :spareparts="filteredSpareparts"
        @restock="openRestockModal"
        @edit="openEditModal"
        @delete="showDeleteConfirmModal"
      />
    </div>

    <AdminInventoryFormModal
      :show="showModal"
      v-model:form="form"
      :selected-sparepart="selectedSparepart"
      :loading="loading"
      :kategori-options="kategoriOptions"
      @close="closeModal"
      @submit="saveSparepart"
    />

    <AdminInventoryRestockModal
      :show="showRestockModal"
      :selected-sparepart="selectedSparepart"
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
      @confirm="deleteSparepart"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
