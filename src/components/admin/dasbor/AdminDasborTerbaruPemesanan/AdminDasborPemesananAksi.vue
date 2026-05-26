<script setup lang="ts">
import { computed } from "vue";
import {
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusSelesai,
} from "@/utils/statusBadge";
import { isUnpaidStatus } from "@/utils/pembayaranStatus";
import { getButtonClass } from "@/utils/buttonVariants";
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
    ? "h-9"
    : "h-8",
);

const detailClass = computed(() =>
  isMobileVariant.value
    ? shouldPairDetailOnMobile.value
      ? getButtonClass("infoOutline", "xs", "h-9 no-underline")
      : getButtonClass("infoOutline", "xs", "col-span-2 h-9 no-underline")
    : getButtonClass("infoOutline", "xs", "h-8 shrink-0 no-underline"),
);
</script>

<template>
  <div :class="wrapperClass">
    <button
      v-if="canAdminConfirmPemesanan(props.pemesanan.status)"
      @click="emit('confirm', props.pemesanan)"
      :class="getButtonClass('infoOutline', 'xs', aksiButtonClass)"
      title="Konfirmasi"
    >
      Konfirmasi
    </button>

    <button
      v-if="canAdminCompletePemesanan(props.pemesanan.status)"
      @click="emit('complete', props.pemesanan)"
      :class="getButtonClass('successOutline', 'xs', aksiButtonClass)"
      title="Tandai Selesai"
    >
      Tandai Selesai
    </button>

    <button
      v-if="canShowCancelAksi"
      @click="emit('cancel', props.pemesanan)"
      :class="getButtonClass('dangerOutline', 'xs', aksiButtonClass)"
      title="Batalkan"
    >
      Batalkan
    </button>

    <button
      v-if="canShowMarkPaidAksi"
      @click="emit('markPaid', props.pemesanan)"
      :class="getButtonClass('successOutline', 'xs', aksiButtonClass)"
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
