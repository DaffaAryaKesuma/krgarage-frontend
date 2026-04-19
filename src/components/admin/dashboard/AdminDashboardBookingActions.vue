<script setup lang="ts">
import { computed } from "vue";
import {
  canAdminCancelBooking,
  canAdminCompleteBooking,
  canAdminConfirmBooking,
  isCompletedStatus,
} from "@/utils/statusBadge";
import { isUnpaidStatus } from "@/utils/paymentStatus";
import type { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  variant?: "mobile" | "desktop";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "desktop",
});

const emit = defineEmits<{
  confirm: [booking: Booking];
  complete: [booking: Booking];
  cancel: [booking: Booking];
  markPaid: [booking: Booking];
}>();

const isMobileVariant = computed(() => props.variant === "mobile");
const canShowCancelAction = computed(() =>
  canAdminCancelBooking(props.booking.status),
);
const canShowMarkPaidAction = computed(
  () =>
    isCompletedStatus(props.booking.status) &&
    isUnpaidStatus(props.booking.status_pembayaran),
);
const shouldPairDetailOnMobile = computed(
  () => canShowCancelAction.value || canShowMarkPaidAction.value,
);

const wrapperClass = computed(() =>
  isMobileVariant.value
    ? "mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3"
    : "flex flex-wrap items-center gap-1.5",
);

const actionButtonClass = computed(() =>
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
      v-if="canAdminConfirmBooking(props.booking.status)"
      @click="emit('confirm', props.booking)"
      :class="[actionButtonClass, 'bg-blue-50 text-blue-700 hover:bg-blue-100']"
      title="Konfirmasi"
    >
      Konfirmasi
    </button>

    <button
      v-if="canAdminCompleteBooking(props.booking.status)"
      @click="emit('complete', props.booking)"
      :class="[
        actionButtonClass,
        'bg-green-50 text-green-700 hover:bg-green-100',
      ]"
      title="Tandai Selesai"
    >
      Tandai Selesai
    </button>

    <button
      v-if="canShowCancelAction"
      @click="emit('cancel', props.booking)"
      :class="[actionButtonClass, 'bg-red-50 text-red-600 hover:bg-red-100']"
      title="Batalkan"
    >
      Batalkan
    </button>

    <button
      v-if="canShowMarkPaidAction"
      @click="emit('markPaid', props.booking)"
      :class="[
        actionButtonClass,
        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
      ]"
      title="Tandai Lunas"
    >
      Tandai Lunas
    </button>

    <router-link
      :to="`/admin/pemesanan/${props.booking.id}`"
      :class="detailClass"
    >
      Detail &rarr;
    </router-link>
  </div>
</template>
