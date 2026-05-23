<script setup lang="ts">
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AdminKeuanganFilters from "@/components/admin/keuangan/AdminKeuanganFilters.vue";
import AdminKeuanganRingkasanKartu from "@/components/admin/keuangan/AdminKeuanganRingkasanKartu.vue";
import AdminKeuanganGrafik from "@/components/admin/keuangan/AdminKeuanganGrafik/AdminKeuanganGrafik.vue";
import AdminKeuanganTeratasLayanan from "@/components/admin/keuangan/AdminKeuanganTeratasLayanan.vue";
import AdminKeuanganTransaksiTabel from "@/components/admin/keuangan/AdminKeuanganTransaksiTabel/AdminKeuanganTransaksiTabel.vue";
import { useAdminKeuanganLaporanPage } from "./useAdminKeuanganLaporanPage";

const {
  selectedYear,
  selectedMonth,
  isLoading,
  ringkasan,
  monthlyData,
  topLayanan,
  pemesanan,
  fetchLaporan,
} = useAdminKeuanganLaporanPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Laporan Keuangan"
      icon="mdi-chart-line"
      subtitle="Analisis pendapatan dan transaksi bengkel"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <AdminKeuanganFilters
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        @change="fetchLaporan"
      />

      <LoadingSpinner v-if="isLoading" message="Memuat laporan keuangan..." />

      <template v-else>
        <AdminKeuanganRingkasanKartu :ringkasan="ringkasan" />
        <AdminKeuanganGrafik
          :monthly-data="monthlyData"
          :selected-year="selectedYear"
        />
        <AdminKeuanganTeratasLayanan :top-layanan="topLayanan" />
        <AdminKeuanganTransaksiTabel :pemesanan="pemesanan" />
      </template>
    </div>
  </div>
</template>
