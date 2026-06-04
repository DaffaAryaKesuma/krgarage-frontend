<script setup lang="ts">
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import PelangganVespaFormModal from "@/components/pelanggan/vespas/PelangganVespaFormModal/PelangganVespaFormModal.vue";
import PelangganVespaDaftar from "@/components/pelanggan/vespas/PelangganVespaDaftar.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { usePelangganVespasPage } from "./usePelangganVespasPage";

const {
  vespas,
  isLoading,
  error,
  isFormVisible,
  formMode,
  showDeleteConfirm,
  vespaToDelete,
  formInitialData,
  openAddForm,
  openEditForm,
  handleFormSubmit,
  handleDelete,
  confirmDelete,
} = usePelangganVespasPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Vespa Saya"
      icon="mdi-motorbike"
      subtitle="Kelola vespa anda untuk pemesanan servis"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Form Modal -->
      <PelangganVespaFormModal
        :show="isFormVisible"
        :mode="formMode"
        :initial-data="formInitialData"
        :error="error"
        @submit="handleFormSubmit"
        @close="isFormVisible = false"
      />

      <!-- Vespa Daftar -->
      <PelangganVespaDaftar
        :vespas="vespas"
        :is-loading="isLoading"
        @edit="openEditForm"
        @delete="handleDelete"
        @add-new="openAddForm"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        :show="showDeleteConfirm"
        title="Hapus Vespa?"
        :message="`Apakah Anda yakin ingin menghapus Vespa '${vespaToDelete?.model} (${vespaToDelete?.plat_nomor})'? Aksi ini tidak dapat dibatalkan.`"
        confirm-text="Ya, Hapus"
        cancel-text="Batal"
        variant="danger"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>
