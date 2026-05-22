<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { logError, handleApiError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AdminKeuanganFilters from "@/components/admin/keuangan/AdminKeuanganFilters.vue";
import AdminKeuanganRingkasanKartu from "@/components/admin/keuangan/AdminKeuanganRingkasanKartu.vue";
import AdminKeuanganGrafik from "@/components/admin/keuangan/AdminKeuanganGrafik.vue";
import AdminKeuanganTeratasLayanan from "@/components/admin/keuangan/AdminKeuanganTeratasLayanan.vue";
import AdminKeuanganTransaksiTabel from "@/components/admin/keuangan/AdminKeuanganTransaksiTabel.vue";
import type { KeuanganPemesanan } from "@/types/pemesanan";

const toast = useToast();

// Interfaces
interface Ringkasan {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

interface MonthlyData {
  bulan: number;
  pendapatan: string;
}

// State
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref<number | string>(new Date().getMonth() + 1);
const isLoading = ref(true);

const ringkasan = ref<Ringkasan>({
  total_pendapatan: 0,
  total_pemesanan: 0,
  rata_rata_nilai_pesan: 0,
});

const monthlyData = ref<MonthlyData[]>([]);
const topLayanan = ref<any[]>([]);
const pemesanan = ref<KeuanganPemesanan[]>([]);

const fetchLaporan = async () => {
  isLoading.value = true;
  try {
    const params = {
      year: selectedYear.value,
      ...(selectedMonth.value && { month: selectedMonth.value }),
    };

    const { data } = await axios.get(`${API_URL}/admin/laporan/keuangan`, {
      params,
      headers: getAuthHeaders(),
    });

    ringkasan.value = data.ringkasan;
    monthlyData.value = data.data_bulanan;
    topLayanan.value = data.layanan_terpopuler;
    pemesanan.value = data.pemesanan;
  } catch (error: any) {
    logError(error, "fetchLaporan");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => fetchLaporan());
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
