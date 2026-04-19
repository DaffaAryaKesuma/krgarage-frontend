<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
import type { Booking, MekanikOption } from "@/types/booking";
import AdminDashboardBookingActions from "@/components/admin/dashboard/AdminDashboardBookingActions.vue";
import AdminDashboardBookingMekanikCell from "@/components/admin/dashboard/AdminDashboardBookingMechanicCell.vue";

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
  complete: [booking: Booking];
  cancel: [booking: Booking];
  markPaid: [booking: Booking];
  assignAndStart: [booking: Booking];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Kode Pemesanan
        </p>
        <p class="text-sm font-semibold text-gray-900">
          {{ props.booking.kode_pemesanan }}
        </p>
      </div>
      <span :class="getStatusBadgeClass(props.booking.status)">
        {{ getStatusLabel(props.booking.status) }}
      </span>
    </div>

    <div class="mt-2 flex items-center justify-between gap-2">
      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        Pembayaran
      </p>
      <span
        :class="getPaymentStatusBadgeClass(props.booking.status_pembayaran)"
      >
        {{ getPaymentStatusLabel(props.booking.status_pembayaran) }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Tanggal
        </p>
        <p class="font-medium text-gray-900">
          {{ formatDateShort(props.booking.tanggal_pemesanan) }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Pelanggan
        </p>
        <p class="font-medium text-gray-900">
          {{ props.booking.pengguna.nama }}
        </p>
      </div>
    </div>

    <div class="mt-3">
      <AdminDashboardBookingMekanikCell
        :booking="props.booking"
        :mekanik-options="props.mekanikOptions"
        :selected-mekanik-id="props.selectedMekanikId"
        variant="mobile"
        @update:selected-mekanik-id="emit('update:selectedMekanikId', $event)"
        @assign-and-start="emit('assignAndStart', props.booking)"
      />
    </div>

    <AdminDashboardBookingActions
      :booking="props.booking"
      variant="mobile"
      @confirm="emit('confirm', $event)"
      @complete="emit('complete', $event)"
      @cancel="emit('cancel', $event)"
      @mark-paid="emit('markPaid', $event)"
    />
  </div>
</template>
