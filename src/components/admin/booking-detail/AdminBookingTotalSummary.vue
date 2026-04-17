<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface Props {
  totalHarga: number;
  totalSpareparts: number;
  grandTotal: number;
}

defineProps<Props>();
</script>

<template>
  <div class="border-t border-gray-200 pt-6">
    <div class="space-y-3">
      <div class="flex justify-between text-gray-700">
        <span>Subtotal Layanan:</span>
        <span class="font-semibold">{{ toIDR(totalHarga) }}</span>
      </div>
      <div
        v-if="totalSpareparts > 0"
        class="flex justify-between text-gray-700"
      >
        <span>Subtotal Suku Cadang:</span>
        <span class="font-semibold">{{ toIDR(totalSpareparts) }}</span>
      </div>
      <div
        class="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t"
      >
        <span>Total:</span>
        <span class="text-green-600">{{ toIDR(grandTotal) }}</span>
      </div>

      <div class="mt-4 flex items-start gap-2 text-xs text-gray-500">
        <i class="mdi mdi-information-outline text-base flex-shrink-0"></i>
        <p>
          Pembayaran dilakukan saat pelanggan mengambil Vespa setelah servis
          selesai
        </p>
      </div>
    </div>
  </div>
</template>
