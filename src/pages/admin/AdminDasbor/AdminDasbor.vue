<script setup lang="ts">
// Komponen kecil untuk menampilkan kartu angka ringkasan di dasbor admin.
import AdminDasborKartuStatistik from "@/components/admin/dasbor/AdminDasborKartuStatistik/AdminDasborKartuStatistik.vue";
// Komponen tabel/list pemesanan terbaru yang bisa diubah status dan mekaniknya.
import AdminDasborTerbaruPemesanan from "@/components/admin/dasbor/AdminDasborTerbaruPemesanan/AdminDasborTerbaruPemesanan.vue";
// Header halaman standar yang dipakai banyak halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Komponen loading saat data API masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Composable berisi semua logika halaman dasbor admin.
import { useAdminDasborPage } from "./useAdminDasborPage";

// Mengambil state dan function dari composable agar template tetap bersih.
const {
  isLoading,
  statistik,
  lowStockCount,
  terbaruPemesanan,
  currentDate,
  mekanikOptions,
  selectedMekanikForPemesanan,
  changeStatus,
  changePembayaranStatus,
  assignMekanikAndStart,
} = useAdminDasborPage();
</script>

<template>
  <!-- Container utama halaman dasbor admin. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Judul halaman; subtitle memakai tanggal hari ini dari composable. -->
    <AppPageHeader
      title="Dasbor Admin"
      icon="mdi-view-dashboard"
      :subtitle="currentDate"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Area konten dibatasi max-width agar rapi di layar besar. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Ditampilkan saat request API belum selesai. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data dasbor..." />

      <!-- Setelah loading selesai, baru tampilkan ringkasan dan pemesanan terbaru. -->
      <template v-else>
        <!-- Kartu statistik menerima data angka dari composable. -->
        <AdminDasborKartuStatistik
          :statistik="statistik"
          :low-stock-count="lowStockCount"
        />

        <!-- Komponen pemesanan terbaru mengirim event saat admin melakukan aksi. -->
        <AdminDasborTerbaruPemesanan
          :pemesanan="terbaruPemesanan"
          :mekanik-options="mekanikOptions"
          v-model:selected-mekaniks="selectedMekanikForPemesanan"
          @status-change="changeStatus"
          @pembayaran-status-change="changePembayaranStatus"
          @assign-and-start="assignMekanikAndStart"
        />
      </template>
    </div>
  </div>
</template>
