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
  rowClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
  rowClass: "transition-colors hover:bg-gray-50/80",
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
  <tr :class="props.rowClass">
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-900 sm:px-6">
      <span class="font-semibold text-gray-800">{{
        props.booking.kode_pemesanan
      }}</span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ formatDateShort(props.booking.tanggal_pemesanan) }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-900 sm:px-6">
      <span class="block truncate" :title="props.booking.pengguna.nama">
        {{ props.booking.pengguna.nama }}
      </span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 sm:px-6">
      <span :class="getStatusBadgeClass(props.booking.status)">
        {{ getStatusLabel(props.booking.status) }}
      </span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 sm:px-6">
      <span
        :class="getPaymentStatusBadgeClass(props.booking.status_pembayaran)"
      >
        {{ getPaymentStatusLabel(props.booking.status_pembayaran) }}
      </span>
    </td>
    <td class="px-4 py-4 sm:px-6">
      <AdminDashboardBookingMekanikCell
        :booking="props.booking"
        :mekanik-options="props.mekanikOptions"
        :selected-mekanik-id="props.selectedMekanikId"
        variant="desktop"
        @update:selected-mekanik-id="emit('update:selectedMekanikId', $event)"
        @assign-and-start="emit('assignAndStart', props.booking)"
      />
    </td>
    <td class="px-4 py-4 text-sm font-medium sm:px-6">
      <AdminDashboardBookingActions
        :booking="props.booking"
        variant="desktop"
        @confirm="emit('confirm', $event)"
        @complete="emit('complete', $event)"
        @cancel="emit('cancel', $event)"
        @mark-paid="emit('markPaid', $event)"
      />
    </td>
  </tr>
</template>
