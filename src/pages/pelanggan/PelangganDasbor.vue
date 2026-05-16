<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PelangganPengingatLayananBanner from "@/components/pelanggan/dasbor/PelangganPengingatLayananBanner.vue";
import PelangganAksiCepat from "@/components/pelanggan/dasbor/PelangganAksiCepat.vue";
import PelangganStatistikKartu from "@/components/pelanggan/dasbor/PelangganStatistikKartu.vue";
import PelangganTipsWidget from "@/components/pelanggan/dasbor/PelangganTipsWidget.vue";
import PelangganPemesananMendatang from "@/components/pelanggan/dasbor/PelangganPemesananMendatang.vue";
import PelangganPemesananTerbaru from "@/components/pelanggan/dasbor/PelangganPemesananTerbaru.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { PelangganPemesanan } from "@/types/pemesanan";
import type { VespaDetail } from "@/types/vespa";
import {
  isStatusMenunggu,
  isStatusDikonfirmasi,
  isStatusDikerjakan,
  isStatusSelesai,
  isStatusBatal,
} from "@/utils/statusBadge";

const toast = useToast();

const pemesananDaftar = ref<PelangganPemesanan[]>([]);
const vespaDaftar = ref<VespaDetail[]>([]);
const vespasDueLayanan = ref<any[]>([]);
const isLoading = ref(true);
const user = ref({ nama: "Guest" });

async function fetchDasborData() {
  const headers = getAuthHeaders();
  if (!Object.keys(headers).length) {
    isLoading.value = false;
    return;
  }

  try {
    const [pemesananResponse, vespaResponse, dueLayananResponse] =
      await Promise.all([
        axios.get(`${API_URL}/pemesanan`, {
          headers,
        }),
        axios.get(`${API_URL}/vespa-saya`, {
          headers,
        }),
        axios.get(`${API_URL}/vespa-saya/perlu-servis`, {
          headers,
        }),
      ]);

    pemesananDaftar.value = pemesananResponse.data.data || pemesananResponse.data;
    vespaDaftar.value = vespaResponse.data.data || vespaResponse.data;
    vespasDueLayanan.value = dueLayananResponse.data.data || dueLayananResponse.data;
  } catch (error: any) {
    logError(error, "fetchDasborData");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
  await fetchDasborData();
});

// Computed properties
const upcomingPemesanan = computed(() =>
  pemesananDaftar.value
    .filter(
      (pemesanan) =>
        isStatusMenunggu(pemesanan.status) ||
        isStatusDikonfirmasi(pemesanan.status) ||
        isStatusDikerjakan(pemesanan.status),
    )
    .slice(0, 3),
);

const terbaruPemesanan = computed(() =>
  pemesananDaftar.value
    .filter(
      (pemesanan) =>
        isStatusSelesai(pemesanan.status) || isStatusBatal(pemesanan.status),
    )
    .slice(0, 3),
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      :title="`Selamat Datang, ${user.nama}!`"
      icon="mdi-account"
      title-class="capitalize"
      subtitle="Ini adalah ringkasan aktivitas Anda di KRGarage"
      subtitle-class="max-w-2xl text-sm text-red-100 sm:text-base"
    />

    <!-- Content Area -->
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <div v-else class="space-y-4 sm:space-y-5 lg:space-y-6">
        <!-- Banner Pengingat Layanan -->
        <PelangganPengingatLayananBanner :vespas="vespasDueLayanan" />

        <!-- Teratas Row: Statistik Kartu -->
        <PelangganStatistikKartu
          :vespa-count="vespaDaftar.length"
          :total-pemesanan="pemesananDaftar.length"
          :active-pemesanan="upcomingPemesanan.length"
        />

        <!-- Second Row: Aksi Cepat + Tips -->
        <div class="grid gap-4 lg:gap-6 xl:grid-cols-[1.5fr_1fr]">
          <PelangganAksiCepat class="h-full" />
          <PelangganTipsWidget class="h-full" />
        </div>

        <!-- Third Row & Below: Pemesanan -->
        <PelangganPemesananMendatang
          v-if="upcomingPemesanan.length > 0 || isLoading"
          :pemesanan="upcomingPemesanan"
          :is-loading="isLoading"
        />

        <!-- Terbaru Pemesanan Section -->
        <PelangganPemesananTerbaru
          :pemesanan="terbaruPemesanan"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>
