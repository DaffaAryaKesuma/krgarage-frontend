<script setup lang="ts">
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PelangganPengingatLayananBanner from "@/components/pelanggan/dasbor/PelangganPengingatLayananBanner.vue";
import PelangganAksiCepat from "@/components/pelanggan/dasbor/PelangganAksiCepat.vue";
import PelangganStatistikKartu from "@/components/pelanggan/dasbor/PelangganStatistikKartu.vue";
import PelangganTipsWidget from "@/components/pelanggan/dasbor/PelangganTipsWidget.vue";
import PelangganPemesananMendatang from "@/components/pelanggan/dasbor/PelangganPemesananMendatang.vue";
import PelangganPemesananTerbaru from "@/components/pelanggan/dasbor/PelangganPemesananTerbaru.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { usePelangganDasborPage } from "./usePelangganDasborPage";

const {
  user,
  vespaDaftar,
  vespasDueLayanan,
  isLoading,
  upcomingPemesanan,
  terbaruPemesanan,
  pemesananDaftar,
} = usePelangganDasborPage();
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

      <div v-else class="space-y-3 sm:space-y-5 lg:space-y-6">
        <!-- Banner Pengingat Layanan -->
        <PelangganPengingatLayananBanner :vespas="vespasDueLayanan" />

        <!-- Teratas Row: Statistik Kartu -->
        <PelangganStatistikKartu
          :vespa-count="vespaDaftar.length"
          :total-pemesanan="pemesananDaftar.length"
          :active-pemesanan="upcomingPemesanan.length"
        />

        <!-- Second Row: Aksi Cepat + Tips -->
        <div class="grid gap-3 lg:gap-6 xl:grid-cols-[1.5fr_1fr]">
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
