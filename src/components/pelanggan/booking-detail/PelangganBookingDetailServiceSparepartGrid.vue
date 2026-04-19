<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { Booking } from "@/types/booking";

defineProps<{
  booking: Booking;
}>();
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="mdi mdi-wrench text-xl text-purple-600"></i>
        <h2 class="font-semibold text-gray-900">Rincian Layanan</h2>
      </div>

      <div class="space-y-2">
        <div
          v-for="layanan in booking.layanan"
          :key="layanan.id"
          class="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2"
        >
          <span class="text-sm font-medium text-gray-800">
            {{ layanan.nama_layanan }}
          </span>
          <span class="text-sm font-semibold text-gray-900">
            {{ toIDR(layanan.harga) }}
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="mdi mdi-cog text-xl text-orange-600"></i>
        <h2 class="font-semibold text-gray-900">Rincian Suku Cadang</h2>
      </div>

      <div v-if="booking.item_pemesanan?.length" class="space-y-2">
        <div
          v-for="item in booking.item_pemesanan"
          :key="item.id"
          class="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2"
        >
          <span class="text-sm text-gray-800">
            {{ item.suku_cadang.nama_suku_cadang }}
            <span class="text-xs text-gray-500">(x{{ item.jumlah }})</span>
          </span>
          <span class="text-sm font-semibold text-gray-900">
            {{ toIDR(item.harga_saat_ini * item.jumlah) }}
          </span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">
        Belum ada sparepart yang digunakan untuk pemesanan ini.
      </p>
    </div>
  </section>
</template>
