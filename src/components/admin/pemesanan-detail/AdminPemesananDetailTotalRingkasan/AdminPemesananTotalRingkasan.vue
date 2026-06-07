<script setup lang="ts">
// Format angka menjadi Rupiah.
import { toIDR } from "@/utils/money";
// Helper alert dan warna teks.
import {
  getAlertBoxClass,
  getAlertIconClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

// Props total berasal dari perhitungan di composable detail pemesanan.
interface Props {
  totalHarga: number;
  totalSukuCadang: number;
  grandTotal: number;
}

defineProps<Props>();
</script>

<template>
  <!-- Ringkasan total biaya pemesanan. -->
  <div class="space-y-3">
    <!-- Subtotal layanan. -->
    <div class="flex justify-between text-gray-900">
      <span>Subtotal Layanan</span>
      <span class="font-bold">{{ toIDR(totalHarga) }}</span>
    </div>
    <!-- Subtotal suku cadang hanya tampil jika lebih dari 0. -->
    <div v-if="totalSukuCadang > 0" class="flex justify-between text-gray-900">
      <span>Subtotal Suku Cadang</span>
      <span class="font-bold">{{ toIDR(totalSukuCadang) }}</span>
    </div>
    <!-- Grand total akhir. -->
    <div
      class="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t"
    >
      <span>Total</span>
      <span :class="getToneTextClass('success')">{{ toIDR(grandTotal) }}</span>
    </div>

    <!-- Info metode pembayaran. -->
    <div :class="[getAlertBoxClass('info'), 'mt-4 flex items-start gap-2 text-xs']">
      <i
        :class="[
          getAlertIconClass('info'),
          'mdi mdi-information-outline flex-shrink-0 text-base',
        ]"
      ></i>
      <p>
        Pembayaran dilakukan saat pelanggan mengambil Vespa setelah servis
        selesai
      </p>
    </div>
  </div>
</template>
