<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  canAdminAssignAndStart,
  canAdminCompleteBooking,
  canAdminConfirmBooking,
  isCompletedStatus,
} from "@/utils/statusBadge";
import { isUnpaidStatus } from "@/utils/paymentStatus";
import type { Booking, MekanikOption } from "@/types/booking";

interface Props {
  booking: Booking;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
});

const emit = defineEmits<{
  confirm: [booking: Booking];
  cancel: [booking: Booking];
  complete: [booking: Booking];
  markPaid: [booking: Booking];
  assignAndStart: [booking: Booking];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

const CANCEL_BUTTON_CLASS =
  "w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition";

const canShowMarkPaidAction = (booking: Booking): boolean =>
  isCompletedStatus(booking.status) &&
  isUnpaidStatus(booking.status_pembayaran);

const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};
</script>

<template>
  <div class="space-y-2">
    <div v-if="canAdminConfirmBooking(props.booking.status)" class="space-y-2">
      <button
        @click="emit('confirm', props.booking)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        <i class="mdi mdi-check-circle"></i>
        Konfirmasi Pemesanan
      </button>
      <button
        @click="emit('cancel', props.booking)"
        :class="CANCEL_BUTTON_CLASS"
      >
        Batalkan
      </button>
    </div>

    <div
      v-else-if="canAdminAssignAndStart(props.booking.status)"
      class="space-y-2"
    >
      <div class="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <p class="mb-2 text-xs font-medium text-blue-800">
          <i class="mdi mdi-information"></i>
          Pilih mekanik untuk mulai servis
        </p>
        <CustomSelect
          :model-value="props.selectedMekanikId"
          @update:model-value="handleMekanikChange"
          :options="props.mekanikOptions"
          placeholder="Pilih Mekanik"
          class="mb-2"
        />
        <button
          @click="emit('assignAndStart', props.booking)"
          :disabled="!props.selectedMekanikId"
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <i class="mdi mdi-play-circle"></i>
          Assign & Mulai Servis
        </button>
      </div>
      <button
        @click="emit('cancel', props.booking)"
        :class="CANCEL_BUTTON_CLASS"
      >
        Batalkan
      </button>
    </div>

    <div
      v-else-if="canAdminCompleteBooking(props.booking.status)"
      class="space-y-2"
    >
      <div class="mb-2 rounded-lg border border-purple-200 bg-purple-50 p-2">
        <p class="text-xs text-purple-800">
          <i class="mdi mdi-cog animate-spin"></i>
          Sedang dikerjakan oleh:
          <strong>{{
            props.booking.mekanik?.nama || "Belum ditentukan"
          }}</strong>
        </p>
      </div>
      <button
        @click="emit('complete', props.booking)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
      >
        <i class="mdi mdi-check-all"></i>
        Tandai Selesai
      </button>
    </div>

    <div
      :class="
        canShowMarkPaidAction(props.booking) ? 'grid grid-cols-2 gap-2' : ''
      "
    >
      <button
        v-if="canShowMarkPaidAction(props.booking)"
        @click="emit('markPaid', props.booking)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        <i class="mdi mdi-cash-check"></i>
        Tandai Lunas
      </button>

      <router-link
        :to="`/admin/pemesanan/${props.booking.id}`"
        :class="
          canShowMarkPaidAction(props.booking)
            ? 'inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700'
            : 'block w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700'
        "
      >
        <i class="mdi mdi-eye"></i>
        Lihat Detail Lengkap
      </router-link>
    </div>
  </div>
</template>
