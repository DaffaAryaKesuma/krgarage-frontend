<script setup lang="ts">
// Komponen loading yang tampil saat data dashboard masih diambil dari API.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Komponen banner untuk menampilkan Vespa yang sudah waktunya servis.
import PelangganPengingatLayananBanner from "@/components/pelanggan/dasbor/PelangganPengingatLayananBanner.vue";
// Komponen grid ringkas berisi statistik, aksi cepat, dan tips.
import PelangganDasborCards from "@/components/pelanggan/dasbor/PelangganDasborCards.vue";
// Komponen daftar pemesanan yang masih aktif atau akan datang.
import PelangganPemesananMendatang from "@/components/pelanggan/dasbor/PelangganPemesananMendatang.vue";
// Komponen daftar riwayat pemesanan terbaru.
import PelangganPemesananTerbaru from "@/components/pelanggan/dasbor/PelangganPemesananTerbaru.vue";
// Komponen header halaman yang berisi judul, ikon, dan subtitle.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Mengambil logika dashboard pelanggan dari file usePelangganDasborPage.ts.
import { usePelangganDasborPage } from "./usePelangganDasborPage";

// Mengambil data dan state yang disediakan oleh composable dashboard pelanggan.
const {
  // Data user yang sedang login.
  user,
  // Daftar Vespa milik pelanggan.
  vespaDaftar,
  // Daftar Vespa yang perlu servis berkala.
  vespasDueLayanan,
  // Status loading halaman.
  isLoading,
  // Daftar pemesanan yang masih aktif atau akan datang.
  upcomingPemesanan,
  // Daftar riwayat pemesanan terbaru.
  terbaruPemesanan,
} = usePelangganDasborPage();
</script>

<template>
  <!-- Wrapper utama halaman dashboard pelanggan. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman yang menyapa pelanggan sesuai nama user. -->
    <AppPageHeader
      :title="`Selamat Datang, ${user.nama}!`"
      icon="mdi-account"
      title-class="capitalize"
      subtitle="Ini adalah ringkasan aktivitas Anda di KRGarage"
      subtitle-class="max-w-2xl text-sm text-red-100 sm:text-base"
    />

    <!-- Area konten utama dashboard. -->
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <!-- Jika data masih dimuat, tampilkan loading. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Jika data sudah selesai dimuat, tampilkan isi dashboard. -->
      <div v-else class="space-y-3 sm:space-y-5 lg:space-y-6">
        <!-- Banner peringatan jika ada Vespa yang sudah waktunya servis. -->
        <PelangganPengingatLayananBanner :vespas="vespasDueLayanan" />

        <!-- Grid ringkas: statistik, aksi cepat, dan tips perawatan. -->
        <PelangganDasborCards
          :vespa-count="vespaDaftar.length"
          :active-pemesanan="upcomingPemesanan.length"
        />

        <!-- Daftar pemesanan aktif/mendatang. Hanya tampil jika ada data. -->
        <PelangganPemesananMendatang
          v-if="upcomingPemesanan.length > 0 || isLoading"
          :pemesanan="upcomingPemesanan"
          :is-loading="isLoading"
        />

        <!-- Daftar riwayat pemesanan terbaru. -->
        <PelangganPemesananTerbaru
          :pemesanan="terbaruPemesanan"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>
