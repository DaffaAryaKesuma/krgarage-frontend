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

const canShowMarkPaidAction = (booking: Booking): boolean =>
  isCompletedStatus(booking.status) &&
  isUnpaidStatus(booking.status_pembayaran);

const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};

const BTN_DETAIL =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50";
const BTN_CANCEL =
  "w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-400 bg-white py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50";
</script>

<template>
  <div class="space-y-2 mt-2">
    <!-- Konfirmasi -->
    <div v-if="canAdminConfirmBooking(props.booking.status)" class="space-y-2">
      <button
        @click="emit('confirm', props.booking)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <i class="mdi mdi-check-circle"></i> Konfirmasi
      </button>
      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('cancel', props.booking)" :class="BTN_CANCEL">
          <i class="mdi mdi-close-circle"></i> Batalkan
        </button>
        <router-link :to="`/admin/pemesanan/${props.booking.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Assign Mekanik -->
    <div v-else-if="canAdminAssignAndStart(props.booking.status)" class="space-y-2">
      <div class="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <p class="mb-2 text-xs font-medium text-blue-800">
          <i class="mdi mdi-information"></i> Pilih mekanik untuk mulai servis
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
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <i class="mdi mdi-play-circle"></i> Mulai Servis
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('cancel', props.booking)" :class="BTN_CANCEL">
          <i class="mdi mdi-close-circle"></i> Batalkan
        </button>
        <router-link :to="`/admin/pemesanan/${props.booking.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Tandai Selesai -->
    <div v-else-if="canAdminCompleteBooking(props.booking.status)" class="space-y-2">
      <div class="rounded-lg border border-purple-200 bg-purple-50 p-2">
        <p class="text-xs text-purple-800">
          <i class="mdi mdi-cog animate-spin"></i>
          Dikerjakan: <strong>{{ props.booking.mekanik?.nama || "Belum ditentukan" }}</strong>
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('complete', props.booking)"
          class="w-full flex items-center justify-center gap-1.5 rounded-lg border border-green-600 bg-white py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
        >
          <i class="mdi mdi-check-all"></i> Selesai
        </button>
        <router-link :to="`/admin/pemesanan/${props.booking.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Tandai Lunas -->
    <div v-else-if="canShowMarkPaidAction(props.booking)" class="grid grid-cols-2 gap-2">
      <button
        @click="emit('markPaid', props.booking)"
        class="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        <i class="mdi mdi-cash-check"></i> Tandai Lunas
      </button>
      <router-link :to="`/admin/pemesanan/${props.booking.id}`" :class="BTN_DETAIL">
        <i class="mdi mdi-eye"></i> Detail
      </router-link>
    </div>

    <!-- Hanya Detail -->
    <div v-else>
      <router-link
        :to="`/admin/pemesanan/${props.booking.id}`"
        class="block w-full rounded-lg border border-gray-300 bg-white py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <i class="mdi mdi-eye mr-1"></i> Lihat Detail
      </router-link>
    </div>
  </div>
</template>
