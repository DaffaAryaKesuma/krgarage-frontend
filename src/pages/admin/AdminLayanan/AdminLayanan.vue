<script setup lang="ts">
import { onMounted } from "vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminLayananKartu from "@/components/admin/layanan/AdminLayananKartu.vue";
import AdminLayananFormModal from "@/components/admin/layanan/AdminLayananFormModal/AdminLayananFormModal.vue";
import {
  ADD_ACTION_ICON_CLASS,
  ADD_ACTION_TITLE_CLASS,
  getAddActionCardClass,
} from "@/utils/selectionVariants";
import { useAdminLayananPage } from "./useAdminLayananPage";

const {
  layanan,
  isLoading,
  showForm,
  formMode,
  previewgambar,
  showDeleteConfirm,
  layananToDelete,
  form,
  openAddForm,
  openEditForm,
  closeForm,
  handleFileSelected,
  fetchLayanan,
  handleFormSubmit,
  handleDelete,
  confirmDelete,
} = useAdminLayananPage();

onMounted(fetchLayanan);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Kelola Layanan"
      icon="mdi-wrench"
      subtitle="Atur semua layanan yang tersedia"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="layanan.length === 0"
        icon="mdi mdi-wrench"
        title="Belum Ada Layanan"
        message="Belum ada layanan yang tersedia. Tambahkan layanan pertama untuk pelanggan!"
        aksiText="Tambah Layanan"
        @aksi="openAddForm"
      />

      <!-- Content -->
      <template v-else>
        <!-- Add Layanan Button -->
        <button
          @click="openAddForm"
          :class="getAddActionCardClass('bar', 'mb-6 bg-gray-50 duration-300')"
        >
          <i
            :class="['mdi mdi-plus-circle text-3xl', ADD_ACTION_ICON_CLASS]"
          ></i>
          <span
            :class="[ADD_ACTION_TITLE_CLASS, 'text-base']"
          >
            Tambah Layanan Baru
          </span>
        </button>

        <!-- Layanan Kartu Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AdminLayananKartu
            v-for="item in layanan"
            :key="item.id"
            :layanan="item"
            @edit="openEditForm"
            @delete="handleDelete"
          />
        </div>
      </template>
    </div>

    <AdminLayananFormModal
      :show="showForm"
      :mode="formMode"
      :form="form"
      @update:form="Object.assign(form, $event)"
      :preview-image="previewgambar"
      @close="closeForm"
      @submit="handleFormSubmit"
      @file-change="handleFileSelected"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Layanan"
      :message="`Apakah Anda yakin ingin menghapus layanan &quot;${layananToDelete?.nama_layanan}&quot;?`"
      confirm-text="Hapus"
      cancel-text="Batal"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
