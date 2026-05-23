<script setup lang="ts">
import AdminDasborKartuStatistik from "@/components/admin/dasbor/AdminDasborKartuStatistik/AdminDasborKartuStatistik.vue";
import AdminDasborTerbaruPemesanan from "@/components/admin/dasbor/AdminDasborTerbaruPemesanan/AdminDasborTerbaruPemesanan.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useAdminDasborPage } from "./useAdminDasborPage";

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
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Dasbor Admin"
      icon="mdi-view-dashboard"
      :subtitle="currentDate"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner v-if="isLoading" message="Memuat data dasbor..." />

      <template v-else>
        <!-- Ringkasan Kartu -->
        <AdminDasborKartuStatistik
          :statistik="statistik"
          :low-stock-count="lowStockCount"
        />

        <!-- Terbaru Pemesanan -->
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
