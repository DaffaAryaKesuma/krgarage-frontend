<script setup lang="ts">
// Modal konfirmasi untuk memastikan user benar-benar ingin menghapus Vespa.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Modal form tambah/edit data Vespa.
import PelangganVespaFormModal from "@/components/pelanggan/vespas/PelangganVespaFormModal/PelangganVespaFormModal.vue";
// Komponen daftar kartu Vespa milik pelanggan.
import PelangganVespaDaftar from "@/components/pelanggan/vespas/PelangganVespaDaftar.vue";
// Header halaman berisi judul, ikon, dan subtitle.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Mengambil semua logika halaman Vespa dari composable.
import { usePelangganVespasPage } from "./usePelangganVespasPage";

// Mengambil state dan fungsi yang dibutuhkan halaman Vespa.
const {
  // Daftar Vespa milik pelanggan.
  vespas,
  // Status loading daftar Vespa.
  isLoading,
  // Pesan error ketika form atau API gagal.
  error,
  // Menentukan apakah modal form sedang tampil.
  isFormVisible,
  // Menentukan mode form: tambah atau edit.
  formMode,
  // Menentukan apakah modal konfirmasi hapus tampil.
  showDeleteConfirm,
  // Data Vespa yang sedang akan dihapus.
  vespaToDelete,
  // Data awal yang dikirim ke form saat tambah/edit.
  formInitialData,
  // Membuka form tambah Vespa.
  openAddForm,
  // Membuka form edit Vespa.
  openEditForm,
  // Menyimpan data dari form tambah/edit.
  handleFormSubmit,
  // Membuka konfirmasi hapus Vespa.
  handleDelete,
  // Menjalankan proses hapus Vespa setelah dikonfirmasi.
  confirmDelete,
} = usePelangganVespasPage();
</script>

<template>
  <!-- Wrapper utama halaman Vespa Saya. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman Vespa Saya. -->
    <AppPageHeader
      title="Vespa Saya"
      icon="mdi-motorbike"
      subtitle="Kelola vespa anda untuk pemesanan servis"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten utama. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Modal form untuk tambah atau edit data Vespa. -->
      <PelangganVespaFormModal
        :show="isFormVisible"
        :mode="formMode"
        :initial-data="formInitialData"
        :error="error"
        @submit="handleFormSubmit"
        @close="isFormVisible = false"
      />

      <!-- Daftar Vespa; event edit/delete/add-new dikirim ke fungsi di composable. -->
      <PelangganVespaDaftar
        :vespas="vespas"
        :is-loading="isLoading"
        @edit="openEditForm"
        @delete="handleDelete"
        @add-new="openAddForm"
      />

      <!-- Modal konfirmasi sebelum Vespa dihapus. -->
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
