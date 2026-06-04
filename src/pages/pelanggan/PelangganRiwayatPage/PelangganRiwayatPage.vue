<script setup lang="ts">
// Modal konfirmasi pembatalan pemesanan.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Komponen filter bulan dan tahun riwayat.
import PelangganRiwayatFilters from "@/components/pelanggan/riwayat/PelangganRiwayatFilters.vue";
// Komponen daftar kartu riwayat pemesanan.
import PelangganRiwayatDaftar from "@/components/pelanggan/riwayat/PelangganRiwayatDaftar.vue";
// Header halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Mengambil logika halaman riwayat pelanggan.
import { usePelangganRiwayatPage } from "./usePelangganRiwayatPage";

// Mengambil state dan fungsi dari composable riwayat.
const {
  // Daftar riwayat pemesanan.
  list,
  // Status loading daftar riwayat.
  isLoading,
  // ID pemesanan yang sedang dibatalkan.
  cancelling,
  // Status tampil modal konfirmasi.
  showConfirmDialog,
  // Filter bulan yang dipilih.
  selectedMonth,
  // Filter tahun yang dipilih.
  selectedYear,
  // Data pagination dari API.
  pagination,
  // Fungsi mengambil data riwayat.
  fetchPemesanan,
  // Fungsi membuka konfirmasi pembatalan.
  cancelPemesanan,
  // Fungsi menjalankan pembatalan setelah dikonfirmasi.
  handleConfirmCancel,
  // Fungsi menutup dialog batal.
  handleCancelDialog,
  // Fungsi saat filter bulan/tahun berubah.
  handleFilterChange,
} = usePelangganRiwayatPage();
</script>

<template>
  <!-- Wrapper utama halaman riwayat servis. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman riwayat. -->
    <AppPageHeader
      title="Riwayat Servis"
      icon="mdi-history"
      subtitle="Cek riwayat servis, jadwal, dan pembayaran"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten riwayat. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <section class="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Filter bulan dan tahun riwayat. -->
        <PelangganRiwayatFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @change="handleFilterChange"
        />

        <!-- Daftar riwayat pemesanan pelanggan. -->
        <PelangganRiwayatDaftar
          :pemesanan="list"
          :is-loading="isLoading"
          :pagination="pagination"
          :cancelling-id="cancelling"
          @cancel="cancelPemesanan"
          @page-change="fetchPemesanan"
        />
      </section>
    </div>

    <!-- Dialog konfirmasi untuk membatalkan pemesanan. -->
    <ConfirmationModal
      :show="showConfirmDialog"
      title="Batalkan Pemesanan"
      message="Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Batalkan"
      cancel-text="Tidak"
      variant="danger"
      @confirm="handleConfirmCancel"
      @cancel="handleCancelDialog"
    />
  </div>
</template>
