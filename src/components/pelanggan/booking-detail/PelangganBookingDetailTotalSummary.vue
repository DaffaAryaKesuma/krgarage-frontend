<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface Props {
  totalLayanan: number;
  totalSukuCadang: number;
  totalBiaya: number;
  canCancel: boolean;
  isCancelling: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
}>();
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
    <div class="space-y-3">
      <div class="flex justify-between text-gray-700">
        <span>Subtotal Layanan:</span>
        <span class="font-semibold">{{ toIDR(totalLayanan) }}</span>
      </div>

      <div v-if="totalSukuCadang > 0" class="flex justify-between text-gray-700">
        <span>Subtotal Suku Cadang:</span>
        <span class="font-semibold">{{ toIDR(totalSukuCadang) }}</span>
      </div>

      <div
        class="flex justify-between border-t border-gray-200 pt-3 text-2xl font-bold text-gray-900"
      >
        <span>Total:</span>
        <span class="text-green-600">{{ toIDR(totalBiaya) }}</span>
      </div>

      <div class="mt-4 flex items-start gap-2 text-xs text-gray-500">
        <i class="mdi mdi-information-outline shrink-0 text-base"></i>
        <p>Pembayaran dilakukan di tempat setelah service selesai</p>
      </div>
    </div>

    <div
      v-if="canCancel"
      class="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4"
    >
      <button
        @click="emit('cancel')"
        :disabled="isCancelling"
        class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <i v-if="isCancelling" class="mdi mdi-loading mdi-spin"></i>
        <i v-else class="mdi mdi-close-circle"></i>
        Batalkan Pemesanan
      </button>
    </div>
  </section>
</template>
