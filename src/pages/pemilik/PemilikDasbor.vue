<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PemilikStatistikGrid from "@/components/pemilik/dasbor/PemilikStatistikGrid.vue";
import PemilikMetrikKeuanganChart from "@/components/pemilik/dasbor/PemilikMetrikKeuanganChart.vue";
import PemilikQuickInsights from "@/components/pemilik/dasbor/PemilikQuickInsights.vue";
import PemilikTerbaruActivity from "@/components/pemilik/dasbor/PemilikTerbaruActivity.vue";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";

// Data
const statistik = ref({
  pendapatanHariIni: 0,
  pendapatanBulanIni: 0,
  unitHariIni: 0,
  nilaiStok: 0,
  loading: true,
});

const ringkasan = ref(null);
const metrik = ref(null);

const terbaruPemesanan = ref<any[]>([]);

const fetchDasborData = async () => {
  try {
    const headers = getAuthHeaders();

    const [statistikRes, pemesananRes, ringkasanRes, metrikRes] =
      await Promise.all([
        axios.get(`${API_URL}/pemilik/statistik`, { headers }),
        axios.get(`${API_URL}/pemilik/pemesanan-terbaru`, { headers }),
        axios.get(`${API_URL}/pemilik/ringkasan`, { headers }),
        axios.get(`${API_URL}/pemilik/metrik-keuangan`, { headers }),
      ]);

    statistik.value = {
      pendapatanHariIni:
        statistikRes.data.data?.pendapatan_hari_ini ??
        statistikRes.data.pendapatan_hari_ini ??
        0,
      pendapatanBulanIni:
        statistikRes.data.data?.pendapatan_bulan_ini ??
        statistikRes.data.pendapatan_bulan_ini ??
        0,
      unitHariIni:
        statistikRes.data.data?.unit_hari_ini ??
        statistikRes.data.unit_hari_ini ??
        0,
      nilaiStok:
        statistikRes.data.data?.nilai_stok ?? statistikRes.data.nilai_stok ?? 0,
      loading: false,
    };

    ringkasan.value = ringkasanRes.data.data ?? ringkasanRes.data;
    metrik.value = metrikRes.data.data ?? metrikRes.data;

    const pemesanan = pemesananRes.data.data ?? pemesananRes.data;
    terbaruPemesanan.value = Array.isArray(pemesanan)
      ? pemesanan.slice(0, 5)
      : [];
  } catch (error: any) {
    logError(error, "fetchDasborData");
    statistik.value.loading = false;
  }
};

onMounted(fetchDasborData);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Dasbor Pemilik"
      icon="mdi-view-dashboard"
      subtitle="Monitoring real-time performa bengkel Anda"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner
        v-if="statistik.loading"
        message="Memuat data dasbor..."
      />

      <template v-else>
        <!-- Quick Insights / Operational -->
        <PemilikQuickInsights :ringkasan="ringkasan" :statistik="statistik" />

        <!-- Big Numbers Grid -->
        <PemilikStatistikGrid :statistik="statistik" :ringkasan="ringkasan" />

        <!-- Terbaru Activity -->
        <PemilikTerbaruActivity
          :pemesanan="terbaruPemesanan"
          :loading="statistik.loading"
        />
      </template>
    </div>
  </div>
</template>
