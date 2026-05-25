<script setup lang="ts">
import { toIDR } from "@/utils/money";
import {
  getAlertBoxClass,
  getAlertIconClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";

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
        <span>Subtotal Layanan</span>
        <span class="font-semibold">{{ toIDR(totalLayanan) }}</span>
      </div>

      <div v-if="totalSukuCadang > 0" class="flex justify-between text-gray-700">
        <span>Subtotal Suku Cadang</span>
        <span class="font-semibold">{{ toIDR(totalSukuCadang) }}</span>
      </div>

      <div
        class="flex justify-between border-t border-gray-200 pt-3 text-2xl font-bold text-gray-900"
      >
        <span>Total</span>
        <span :class="getToneTextClass('success')">{{ toIDR(totalBiaya) }}</span>
      </div>

      <div :class="[getAlertBoxClass('info'), 'mt-4 flex items-start gap-2 text-xs']">
        <i
          :class="[getAlertIconClass('info'), 'mdi mdi-information-outline shrink-0 text-base']"
        ></i>
        <p>Pembayaran dilakukan di tempat setelah layanan selesai</p>
      </div>
    </div>

    <div
      v-if="canCancel"
      class="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4"
    >
      <button
        @click="emit('cancel')"
        :disabled="isCancelling"
        :class="getButtonClass('dangerOutline', 'md', 'disabled:cursor-not-allowed disabled:opacity-60')"
      >
        <i v-if="isCancelling" class="mdi mdi-loading mdi-spin"></i>
        <i v-else class="mdi mdi-close-circle"></i>
        Batalkan Pemesanan
      </button>
    </div>
  </section>
</template>
