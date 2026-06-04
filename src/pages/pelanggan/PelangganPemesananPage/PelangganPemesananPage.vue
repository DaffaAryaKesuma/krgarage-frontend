<script setup lang="ts">
// Komponen langkah 1 untuk memilih layanan servis.
import PelangganPilihLayanan from "@/components/pelanggan/pemesanan/PelangganPilihLayanan.vue";
// Komponen langkah 2 untuk memilih Vespa.
import PelangganPilihVespa from "@/components/pelanggan/pemesanan/PelangganPilihVespa.vue";
// Komponen langkah 3 untuk memilih tanggal, jam, dan catatan.
import PelangganPilihJadwal from "@/components/pelanggan/pemesanan/PelangganPilihJadwal.vue";
// Komponen ringkasan pemesanan sebelum dikirim.
import PelangganRingkasanPemesanan from "@/components/pelanggan/pemesanan/PelangganRingkasanPemesanan.vue";
// Komponen pengatur progress/step form pemesanan.
import PelangganStepProgress from "@/components/pelanggan/pemesanan/PelangganStepProgress.vue";
// Header halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Komponen loading.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// onMounted dipakai untuk memuat data awal saat halaman dibuka.
import { onMounted } from "vue";
// Mengambil logika halaman pemesanan pelanggan.
import { usePelangganPemesananPage } from "./usePelangganPemesananPage";

// Mengambil data dan fungsi yang dibutuhkan form pemesanan.
const {
  // Daftar jam servis yang tersedia.
  TIME_SLOTS,
  // Daftar Vespa milik pelanggan.
  myVespas,
  // Daftar layanan servis.
  allLayanan,
  // Status loading data awal.
  isLoading,
  // Status saat form sedang dikirim.
  isSubmitting,
  // Jam yang sudah dipesan pada tanggal terpilih.
  bookedSlots,
  // Data form pemesanan.
  form,
  // Error validasi setiap field form.
  errors,
  // Penanda field sudah disentuh atau belum.
  touched,
  // Layanan yang sedang dipilih.
  selectedLayanan,
  // Vespa yang sedang dipilih.
  selectedVespa,
  // Total harga dari layanan terpilih.
  totalHarga,
  // Handler saat layanan berubah.
  handleLayananChange,
  // Handler saat Vespa berubah.
  handleVespaChange,
  // Handler saat tanggal berubah.
  handleDateChange,
  // Handler saat jam dipilih.
  handleTimeSelect,
  // Fungsi validasi field wajib.
  validateRequiredFields,
  // Fungsi submit pemesanan.
  submit,
  // Fungsi memuat data awal layanan dan Vespa.
  loadInitialData,
} = usePelangganPemesananPage();

// Saat halaman dibuka, muat data layanan dan Vespa dari API.
onMounted(() => {
  void loadInitialData();
});
</script>

<template>
  <!-- Wrapper utama halaman pemesanan servis. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header halaman pemesanan. -->
    <AppPageHeader
      title="Pemesanan Servis"
      icon="mdi-calendar-check"
      subtitle="Pesan layanan dengan mudah"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten utama. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Tampilkan loading saat data layanan/Vespa masih dimuat. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data layanan..." />

      <!-- Form pemesanan; submit dicegah reload halaman dan diarahkan ke fungsi submit. -->
      <form v-else @submit.prevent="submit" class="space-y-6">
        <PelangganStepProgress
          :form="form"
          :errors="errors"
          :booked-slots="bookedSlots"
          :validate-required-fields="validateRequiredFields"
        >
          <template #default="{ currentStep }">
            <!-- Step 1: memilih satu atau beberapa layanan servis. -->
            <PelangganPilihLayanan
              v-if="currentStep === 1"
              :layanan="allLayanan"
              v-model="form.id_layanan"
              :error="errors.id_layanan"
              :touched="touched.id_layanan"
              @update:model-value="handleLayananChange"
            />

            <!-- Step 2: memilih Vespa yang akan diservis. -->
            <PelangganPilihVespa
              v-if="currentStep === 2"
              :vespas="myVespas"
              v-model="form.id_vespa"
              :error="errors.id_vespa"
              :touched="touched.id_vespa"
              @update:model-value="handleVespaChange"
            />

            <!-- Step 3: memilih tanggal, jam, dan mengisi catatan pelanggan. -->
            <PelangganPilihJadwal
              v-if="currentStep === 3"
              :time-slots="TIME_SLOTS"
              :booked-slots="bookedSlots"
              v-model:date-value="form.tanggal_pemesanan"
              v-model:time-value="form.jam_pemesanan"
              v-model:catatan="form.catatan_pelanggan"
              :date-error="errors.tanggal_pemesanan"
              :time-error="errors.jam_pemesanan"
              :date-touched="touched.tanggal_pemesanan"
              :time-touched="touched.jam_pemesanan"
              @date-change="handleDateChange"
              @time-select="handleTimeSelect"
            />
          </template>

          <template #summary>
            <!-- Ringkasan pemesanan yang tampil di sisi/area summary step. -->
            <PelangganRingkasanPemesanan
              :selected-layanan="selectedLayanan"
              :selected-vespa="selectedVespa"
              :total-price="totalHarga"
              :selected-date="form.tanggal_pemesanan"
              :selected-time="form.jam_pemesanan"
              :is-submitting="isSubmitting"
            />
          </template>
        </PelangganStepProgress>
      </form>
    </div>
  </div>
</template>
