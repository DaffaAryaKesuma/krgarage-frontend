<script setup lang="ts">
import type { Booking } from "@/types/booking";

defineProps<{
  booking: Booking;
}>();
</script>

<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-outline text-indigo-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Pelanggan</h2>
      </div>
      <p class="whitespace-pre-line text-sm text-gray-700">
        {{ booking.catatan_pelanggan || "Tidak ada catatan pelanggan." }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-green-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Mekanik</h2>
      </div>
      <p class="whitespace-pre-line text-sm text-gray-700">
        {{ booking.catatan_mekanik || "Belum ada catatan dari mekanik." }}
      </p>
    </div>
  </section>
</template>
