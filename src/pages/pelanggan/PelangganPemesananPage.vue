<script setup lang="ts">
import PelangganPilihLayanan from "@/components/pelanggan/pemesanan/PelangganPilihLayanan.vue";
import PelangganPilihVespa from "@/components/pelanggan/pemesanan/PelangganPilihVespa.vue";
import PelangganPilihJadwal from "@/components/pelanggan/pemesanan/PelangganPilihJadwal.vue";
import PelangganRingkasanPemesanan from "@/components/pelanggan/pemesanan/PelangganRingkasanPemesanan.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { onMounted } from "vue";
import { usePelangganPemesananPage } from "@/composables/usePelangganPemesananPage";

const {
  TIME_SLOTS,
  myVespas,
  allLayanan,
  isLoading,
  isSubmitting,
  bookedSlots,
  form,
  errors,
  touched,
  selectedLayanan,
  selectedVespa,
  totalHarga,
  handleLayananChange,
  handleVespaChange,
  handleDateChange,
  handleTimeSelect,
  submit,
  loadInitialData,
} = usePelangganPemesananPage();

onMounted(() => {
  void loadInitialData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Pemesanan Servis Vespa"
      icon="mdi-calendar-check"
      subtitle="Pesan layanan dengan mudah"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading -->
      <LoadingSpinner v-if="isLoading" message="Memuat data layanan..." />

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-6">
        <!-- STEP 1: Layanan -->
        <PelangganPilihLayanan
          :layanan="allLayanan"
          v-model="form.id_layanan"
          :error="errors.id_layanan"
          :touched="touched.id_layanan"
          @update:model-value="handleLayananChange"
        />

        <!-- STEP 2: Vespa -->
        <PelangganPilihVespa
          :vespas="myVespas"
          v-model="form.id_vespa"
          :error="errors.id_vespa"
          :touched="touched.id_vespa"
          @update:model-value="handleVespaChange"
        />

        <!-- STEP 3: Jadwal -->
        <PelangganPilihJadwal
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

        <!-- Ringkasan & Submit -->
        <PelangganRingkasanPemesanan
          :selected-layanan="selectedLayanan"
          :selected-vespa="selectedVespa"
          :total-price="totalHarga"
          :selected-date="form.tanggal_pemesanan"
          :selected-time="form.jam_pemesanan"
          :is-submitting="isSubmitting"
        />
      </form>
    </div>
  </div>
</template>
