<script setup lang="ts">
// onMounted dipakai untuk mengambil data layanan saat halaman dibuka.
import { onMounted } from "vue";
// Loading saat daftar layanan masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Modal konfirmasi sebelum hapus layanan.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Tampilan kosong jika belum ada layanan.
import EmptyState from "@/components/ui/EmptyState.vue";
// Header standar halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Kartu untuk satu layanan.
import AdminLayananKartu from "@/components/admin/layanan/AdminLayananKartu.vue";
// Modal form tambah/edit layanan.
import AdminLayananFormModal from "@/components/admin/layanan/AdminLayananFormModal/AdminLayananFormModal.vue";
// Class reusable untuk tombol tambah.
import {
  ADD_ACTION_ICON_CLASS,
  ADD_ACTION_TITLE_CLASS,
  getAddActionCardClass,
} from "@/utils/selectionVariants";
// Composable halaman layanan admin.
import { useAdminLayananPage } from "./useAdminLayananPage";

// Mengambil state dan handler dari composable.
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

// Setelah komponen siap, ambil daftar layanan dari API.
onMounted(fetchLayanan);
</script>

<template>
  <!-- Container halaman kelola layanan. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman. -->
    <AppPageHeader
      title="Kelola Layanan"
      icon="mdi-wrench"
      subtitle="Atur semua layanan yang tersedia"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Area konten utama. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading tampil ketika request layanan masih berjalan. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Empty state tampil kalau backend mengembalikan daftar kosong. -->
      <EmptyState
        v-else-if="layanan.length === 0"
        icon="mdi mdi-wrench"
        title="Belum Ada Layanan"
        message="Belum ada layanan yang tersedia. Tambahkan layanan pertama untuk pelanggan!"
        aksiText="Tambah Layanan"
        @aksi="openAddForm"
      />

      <!-- Konten utama tampil jika data layanan ada. -->
      <template v-else>
        <!-- Tombol tambah layanan membuka modal form mode add. -->
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

        <!-- Grid kartu layanan dari data API. -->
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

    <!-- Modal form dipakai untuk tambah dan edit layanan. -->
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

    <!-- Modal konfirmasi hapus layanan. -->
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
