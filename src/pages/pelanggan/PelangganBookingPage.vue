<script setup lang="ts">
import PelangganServiceSelector from "@/components/pelanggan/bookings/PelangganServiceSelector.vue";
import PelangganVespaSelector from "@/components/pelanggan/bookings/PelangganVespaSelector.vue";
import PelangganSchedulePicker from "@/components/pelanggan/bookings/PelangganSchedulePicker.vue";
import PelangganBookingSummary from "@/components/pelanggan/bookings/PelangganBookingSummary.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { onMounted } from "vue";
import { usePelangganBookingPage } from "@/composables/usePelangganBookingPage";

const {
  TIME_SLOTS,
  myVespas,
  allServices,
  isLoading,
  isSubmitting,
  bookedSlots,
  form,
  errors,
  touched,
  totalHarga,
  handleServiceChange,
  handleVespaChange,
  handleDateChange,
  handleTimeSelect,
  submit,
  loadInitialData,
} = usePelangganBookingPage();

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
      <div v-if="isLoading" class="text-center py-12">
        <i class="mdi mdi-loading animate-spin text-5xl text-red-600"></i>
        <p class="text-gray-600 mt-4">Memuat data layanan...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-6">
        <!-- STEP 1: Services -->
        <PelangganServiceSelector
          :services="allServices"
          v-model="form.service_ids"
          :error="errors.service_ids"
          :touched="touched.service_ids"
          @update:model-value="handleServiceChange"
        />

        <!-- STEP 2: Vespa -->
        <PelangganVespaSelector
          :vespas="myVespas"
          v-model="form.id_vespa"
          :error="errors.id_vespa"
          :touched="touched.id_vespa"
          @update:model-value="handleVespaChange"
        />

        <!-- STEP 3: Schedule -->
        <PelangganSchedulePicker
          :time-slots="TIME_SLOTS"
          :booked-slots="bookedSlots"
          v-model:date-value="form.tanggal_pemesanan"
          v-model:time-value="form.jam_pemesanan"
          v-model:notes="form.catatan_pelanggan"
          :date-error="errors.tanggal_pemesanan"
          :time-error="errors.jam_pemesanan"
          :date-touched="touched.tanggal_pemesanan"
          :time-touched="touched.jam_pemesanan"
          @date-change="handleDateChange"
          @time-select="handleTimeSelect"
        />

        <!-- Summary & Submit -->
        <PelangganBookingSummary
          :service-count="form.service_ids.length"
          :total-price="totalHarga"
          :selected-date="form.tanggal_pemesanan"
          :selected-time="form.jam_pemesanan"
          :is-submitting="isSubmitting"
        />
      </form>
    </div>
  </div>
</template>
