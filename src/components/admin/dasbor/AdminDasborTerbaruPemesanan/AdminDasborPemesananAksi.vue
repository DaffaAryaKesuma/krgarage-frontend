<script setup lang="ts">
import { computed } from "vue";
import {
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusSelesai,
} from "@/utils/statusBadge";
import { isUnpaidStatus } from "@/utils/pembayaranStatus";
import type { Pemesanan } from "@/types/pemesanan";

interface Props {
  pemesanan: Pemesanan;
  variant?: "mobile" | "desktop";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "desktop",
});

const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
}>();

const isMobileVariant = computed(() => props.variant === "mobile");
const canShowCancelAksi = computed(() =>
  canAdminCancelPemesanan(props.pemesanan.status),
);
const canShowMarkPaidAksi = computed(
  () =>
    isStatusSelesai(props.pemesanan.status) &&
    isUnpaidStatus(props.pemesanan.status_pembayaran),
);
const shouldPairDetailOnMobile = computed(
  () =>
    canShowCancelAksi.value ||
    canShowMarkPaidAksi.value ||
    canAdminCompletePemesanan(props.pemesanan.status) ||
    canAdminConfirmPemesanan(props.pemesanan.status),
);

const wrapperClass = computed(() =>
  isMobileVariant.value
    ? "mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3"
    : "flex flex-col items-start gap-2",
);

const aksiButtonClass = computed(() =>
  isMobileVariant.value
    ? "inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold transition"
    : "inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition",
);

const detailClass = computed(() =>
  isMobileVariant.value
    ? shouldPairDetailOnMobile.value
      ? "inline-flex h-9 items-center justify-center rounded-lg border-2 border-indigo-50 bg-white px-3 text-xs font-semibold text-indigo-600 no-underline transition hover:bg-indigo-50 hover:text-indigo-800"
      : "col-span-2 inline-flex h-9 items-center justify-center rounded-lg border-2 border-indigo-50 bg-white px-3 text-xs font-semibold text-indigo-600 no-underline transition hover:bg-indigo-50 hover:text-indigo-800"
    : "inline-flex h-8 shrink-0 items-center rounded-lg border-2 border-indigo-50 bg-white px-3 text-xs font-semibold text-indigo-600 no-underline transition hover:bg-indigo-50 hover:text-indigo-800",
);
</script>

<template>
  <div :class="wrapperClass">
    <button
      v-if="canAdminConfirmPemesanan(props.pemesanan.status)"
      @click="emit('confirm', props.pemesanan)"
      :class="[aksiButtonClass, 'bg-blue-50 text-blue-700 hover:bg-blue-100']"
      title="Konfirmasi"
    >
      Konfirmasi
    </button>

    <button
      v-if="canAdminCompletePemesanan(props.pemesanan.status)"
      @click="emit('complete', props.pemesanan)"
      :class="[
        aksiButtonClass,
        'bg-green-50 text-green-700 hover:bg-green-100',
      ]"
      title="Tandai Selesai"
    >
      Tandai Selesai
    </button>

    <button
      v-if="canShowCancelAksi"
      @click="emit('cancel', props.pemesanan)"
      :class="[aksiButtonClass, 'bg-red-50 text-red-600 hover:bg-red-100']"
      title="Batalkan"
    >
      Batalkan
    </button>

    <button
      v-if="canShowMarkPaidAksi"
      @click="emit('markPaid', props.pemesanan)"
      :class="[
        aksiButtonClass,
        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
      ]"
      title="Tandai Lunas"
    >
      Tandai Lunas
    </button>

    <router-link
      :to="`/admin/pemesanan/${props.pemesanan.id}`"
      :class="detailClass"
    >
      Detail &rarr;
    </router-link>
  </div>
</template>
