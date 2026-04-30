<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
import type { FinancialBooking } from "@/types/booking";

interface Props {
  booking: FinancialBooking;
  bookingDate: string;
  plateNumber: string;
  bookingStatus: string;
  bookingTotal: number | string;
}

defineProps<Props>();
</script>

<template>
  <tr class="hover:bg-gray-50 transition-colors">
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ booking.kode_pemesanan }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ formatDateShort(bookingDate) }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ booking.pengguna?.nama || "-" }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ plateNumber }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ toIDR(bookingTotal) }}
    </td>
    <td class="px-6 py-4">
      <span :class="getStatusBadgeClass(bookingStatus)">
        {{ getStatusLabel(bookingStatus) }}
      </span>
    </td>
    <td class="px-6 py-4">
      <span :class="getPaymentStatusBadgeClass(booking.status_pembayaran)">
        {{ getPaymentStatusLabel(booking.status_pembayaran) }}
      </span>
    </td>
  </tr>
</template>
