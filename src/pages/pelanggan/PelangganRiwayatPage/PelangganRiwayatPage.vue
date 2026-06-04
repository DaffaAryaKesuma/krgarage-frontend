<script setup lang="ts">
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import PelangganRiwayatFilters from "@/components/pelanggan/riwayat/PelangganRiwayatFilters.vue";
import PelangganRiwayatDaftar from "@/components/pelanggan/riwayat/PelangganRiwayatDaftar.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { usePelangganRiwayatPage } from "./usePelangganRiwayatPage";

const {
  list,
  isLoading,
  cancelling,
  showConfirmDialog,
  selectedMonth,
  selectedYear,
  pagination,
  fetchPemesanan,
  cancelPemesanan,
  handleConfirmCancel,
  handleCancelDialog,
  handleFilterChange,
} = usePelangganRiwayatPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Riwayat Servis"
      icon="mdi-history"
      subtitle="Cek riwayat servis, jadwal, dan pembayaran"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <section class="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Filter Section -->
        <PelangganRiwayatFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @change="handleFilterChange"
        />

        <!-- Riwayat Daftar -->
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

    <!-- Confirm Dialog -->
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
