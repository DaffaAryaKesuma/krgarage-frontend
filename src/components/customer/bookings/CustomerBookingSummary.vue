<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";

interface Props {
  serviceCount: number;
  totalPrice: number;
  selectedDate: string;
  selectedTime: string;
  isSubmitting?: boolean;
}

withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});
</script>

<template>
  <div
    class="bg-red-50 rounded-xl shadow-md p-6 sm:p-8 border-2 border-red-200"
  >
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center"
      >
        <i class="mdi mdi-receipt-text text-xl text-red-600"></i>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Ringkasan Pemesanan
      </h2>
    </div>

    <div class="space-y-3 mb-6">
      <div class="flex items-center justify-between p-4 bg-white rounded-lg">
        <span class="text-gray-700 font-medium">Layanan Dipilih:</span>
        <span class="font-bold text-gray-900">{{ serviceCount }} layanan</span>
      </div>
      <div class="flex items-center justify-between p-4 bg-white rounded-lg">
        <span class="text-gray-700 font-medium">Total Harga Estimasi:</span>
        <span class="text-2xl font-bold text-red-600">{{
          toIDR(totalPrice)
        }}</span>
      </div>
      <div
        v-if="selectedDate"
        class="flex items-center justify-between p-4 bg-white rounded-lg"
      >
        <span class="text-gray-700 font-medium">Jadwal:</span>
        <span class="font-bold text-gray-900">
          {{ formatDateShort(selectedDate) }}
          <span v-if="selectedTime" class="ml-2 text-orange-600">{{
            selectedTime
          }}</span>
        </span>
      </div>
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      :class="[
        'w-full py-4 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 text-lg',
        isSubmitting
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 hover:shadow-xl',
      ]"
    >
      <i
        :class="[
          isSubmitting ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-check-circle',
        ]"
      ></i>
      {{ isSubmitting ? "Memproses..." : "Pesan Sekarang" }}
    </button>
  </div>
</template>
