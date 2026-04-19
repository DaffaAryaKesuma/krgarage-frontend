<script setup lang="ts">
import { onMounted } from "vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminServiceCard from "@/components/admin/services/AdminServiceCard.vue";
import AdminServiceFormModal from "@/components/admin/services/AdminServiceFormModal.vue";
import { useAdminServicesPage } from "@/composables/useAdminServicesPage";

const {
  services,
  isLoading,
  showForm,
  formMode,
  previewgambar,
  showDeleteConfirm,
  serviceToDelete,
  form,
  openAddForm,
  openEditForm,
  closeForm,
  handleFileSelected,
  fetchServices,
  handleFormSubmit,
  handleDelete,
  confirmDelete,
} = useAdminServicesPage();

onMounted(fetchServices);
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
        v-else-if="services.length === 0"
        icon="mdi mdi-wrench"
        title="Belum Ada Layanan"
        message="Belum ada layanan yang tersedia. Tambahkan layanan pertama untuk pelanggan!"
        actionText="Tambah Layanan"
        @action="openAddForm"
      />

      <!-- Content -->
      <template v-else>
        <!-- Add Service Button -->
        <button
          @click="openAddForm"
          class="w-full group flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-red-50 hover:border-red-400 transition duration-300 cursor-pointer mb-6"
        >
          <i
            class="mdi mdi-plus-circle text-3xl text-gray-400 group-hover:text-red-600"
          ></i>
          <span
            class="text-base font-semibold text-gray-500 group-hover:text-red-600 transition-colors"
          >
            Tambah Layanan Baru
          </span>
        </button>

        <!-- Service Cards Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AdminServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @edit="openEditForm"
            @delete="handleDelete"
          />
        </div>
      </template>
    </div>

    <AdminServiceFormModal
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
      :message="`Apakah Anda yakin ingin menghapus layanan &quot;${serviceToDelete?.nama_layanan}&quot;?`"
      confirm-text="Hapus"
      cancel-text="Batal"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
