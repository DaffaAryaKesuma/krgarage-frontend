<script setup lang="ts">
// Header standar halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Modal konfirmasi sebelum hapus akun karyawan.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Loading saat data karyawan belum selesai diambil.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Kartu untuk menampilkan satu akun admin/mekanik.
import KaryawanKartu from "@/components/admin/karyawan/KaryawanKartu.vue";
// Modal form untuk tambah dan edit karyawan.
import KaryawanFormModal from "@/components/admin/karyawan/KaryawanFormModal/KaryawanFormModal.vue";
// Class reusable untuk kartu aksi tambah.
import {
  ADD_ACTION_ICON_CLASS,
  ADD_ACTION_TITLE_CLASS,
  getAddActionCardClass,
} from "@/utils/selectionVariants";
// Composable yang menyimpan logic halaman karyawan.
import { useAdminKaryawanPage } from "./useAdminKaryawanPage";

// Mengambil semua state dan aksi dari composable.
const {
  currentUser,
  karyawanDaftar,
  isLoading,
  isModalOpen,
  isEditMode,
  editData,
  showDeleteConfirm,
  openAddModal,
  openEditModal,
  handleFormSubmit,
  konfirmasiHapus,
  hapusKaryawan,
} = useAdminKaryawanPage();
</script>

<template>
  <!-- Container halaman manajemen karyawan. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Judul halaman. -->
    <AppPageHeader
      title="Manajemen Karyawan"
      icon="mdi-account-group"
      subtitle="Kelola akun admin dan mekanik KR Garage"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten utama. -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Loading muncul selama data karyawan diambil dari API. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Grid berisi tombol tambah dan kartu karyawan. -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Tombol untuk membuka modal tambah karyawan. -->
        <button
          @click="openAddModal"
          :class="getAddActionCardClass('card', 'min-h-[220px] focus:ring-offset-2')"
        >
          <i
            :class="[
              'mdi mdi-plus-circle-outline mb-2 text-5xl transition-transform group-hover:scale-110',
              ADD_ACTION_ICON_CLASS,
            ]"
          ></i>
          <span :class="[ADD_ACTION_TITLE_CLASS, 'text-sm uppercase tracking-wide']"
            >Tambah Karyawan</span
          >
        </button>

        <!-- Satu kartu untuk setiap karyawan dari API. -->
        <KaryawanKartu
          v-for="karyawan in karyawanDaftar"
          :key="karyawan.id"
          :karyawan="karyawan"
          :current-user-id="currentUser?.id"
          @edit="openEditModal"
          @delete="konfirmasiHapus"
        />
      </div>
    </div>

    <!-- Modal form dipakai ulang untuk tambah maupun edit. -->
    <KaryawanFormModal
      :show="isModalOpen"
      :is-edit-mode="isEditMode"
      :initial-data="editData || undefined"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Modal konfirmasi hapus akun. -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Akun Karyawan"
      message="Apakah Anda yakin ingin menghapus akun karyawan ini? Tindakan ini tidak dapat dibatalkan dan semua hak aksesnya akan terhapus."
      variant="danger"
      confirmText="Ya, Hapus Akun"
      cancelText="Batal"
      @confirm="hapusKaryawan"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
