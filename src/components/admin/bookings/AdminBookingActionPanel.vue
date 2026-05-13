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
  "w-full py-2 bg-white border border-red-500 text-red-600 text-sm font-medium rounded-lg transition hover:bg-red-50 flex items-center justify-center gap-2";

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
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('cancel', props.booking)"
          :class="CANCEL_BUTTON_CLASS + ' !py-2.5'"
        >
          <i class="mdi mdi-close-circle"></i>
          Batalkan Pemesanan
        </button>
        <router-link
          :to="`/admin/pemesanan/${props.booking.id}`"
          class="inline-flex w-full items-center justify-center rounded-lg bg-white border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <i class="mdi mdi-eye mr-2"></i>
          Lihat Detail Pemesanan
        </router-link>
      </div>
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
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <i class="mdi mdi-play-circle"></i>
          Mulai Servis
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('cancel', props.booking)"
          :class="CANCEL_BUTTON_CLASS + ' !py-2.5'"
        >
          <i class="mdi mdi-close-circle"></i>
          Batalkan Pemesanan
        </button>
        <router-link
          :to="`/admin/pemesanan/${props.booking.id}`"
          class="inline-flex w-full items-center justify-center rounded-lg bg-white border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <i class="mdi mdi-eye mr-2"></i>
          Lihat Detail Pemesanan
        </router-link>
      </div>
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
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('complete', props.booking)"
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-green-700 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50"
        >
          <i class="mdi mdi-check-all"></i>
          Tandai Selesai
        </button>
        <router-link
          :to="`/admin/pemesanan/${props.booking.id}`"
          class="inline-flex w-full items-center justify-center rounded-lg bg-white border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <i class="mdi mdi-eye mr-2"></i>
          Lihat Detail Pemesanan
        </router-link>
      </div>
    </div>

    <div
      v-else-if="canShowMarkPaidAction(props.booking)"
      class="grid grid-cols-2 gap-2"
    >
      <button
        @click="emit('markPaid', props.booking)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-green-700 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50"
      >
        <i class="mdi mdi-cash-check"></i>
        Tandai Lunas
      </button>
      <router-link
        :to="`/admin/pemesanan/${props.booking.id}`"
        class="inline-flex w-full items-center justify-center rounded-lg bg-white border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <i class="mdi mdi-eye mr-2"></i>
        Lihat Detail Pemesanan
      </router-link>
    </div>

    <!-- Hanya Lihat Detail Lengkap (Full Baris) -->
    <div v-else>
      <router-link
        :to="`/admin/pemesanan/${props.booking.id}`"
        class="block w-full rounded-lg bg-white border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 mt-2"
      >
        <i class="mdi mdi-eye mr-2"></i>
        Lihat Detail Pemesanan
      </router-link>
    </div>
  </div>
</template>
