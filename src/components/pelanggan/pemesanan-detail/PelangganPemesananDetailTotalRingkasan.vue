<script setup lang="ts">
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper class untuk panel informasi.
import {
  getAlertBoxClass,
  getAlertIconClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

// Props menerima subtotal, total, dan status tombol batal.
interface Props {
  totalLayanan: number;
  totalSukuCadang: number;
  totalBiaya: number;
}

defineProps<Props>();
</script>

<template>
  <!-- Kartu ringkasan total biaya detail pemesanan. -->
  <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
    <div class="space-y-3">
      <!-- Total dari layanan yang dipilih pelanggan. -->
      <div class="flex justify-between text-gray-700">
        <span>Subtotal Layanan</span>
        <span class="font-semibold">{{ toIDR(totalLayanan) }}</span>
      </div>

      <!-- Subtotal suku cadang hanya muncul jika ada suku cadang dipakai. -->
      <div v-if="totalSukuCadang > 0" class="flex justify-between text-gray-700">
        <span>Subtotal Suku Cadang</span>
        <span class="font-semibold">{{ toIDR(totalSukuCadang) }}</span>
      </div>

      <!-- Total akhir yang harus dibayar. -->
      <div
        class="flex justify-between border-t border-gray-200 pt-3 text-2xl font-bold text-gray-900"
      >
        <span>Total</span>
        <span :class="getToneTextClass('success')">{{ toIDR(totalBiaya) }}</span>
      </div>

      <!-- Informasi cara pembayaran untuk pelanggan. -->
      <div :class="[getAlertBoxClass('info'), 'mt-4 flex items-start gap-2 text-xs']">
        <i
          :class="[getAlertIconClass('info'), 'mdi mdi-information-outline shrink-0 text-base']"
        ></i>
        <p>Pembayaran dilakukan di tempat setelah layanan selesai</p>
      </div>
    </div>
  </section>
</template>
