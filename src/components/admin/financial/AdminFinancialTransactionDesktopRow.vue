<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import type { FinancialBooking } from "@/types/booking";

interface Props {
  booking: FinancialBooking;
  bookingServices: string;
  bookingItems: string;
  bookingTotal: number;
}

defineProps<Props>();
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50">
    <td class="px-4 py-4 text-sm font-semibold text-gray-900 sm:px-6">
      {{ booking.kode_pemesanan }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ formatDateShort(booking.updated_at) }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ booking.pengguna.nama }}
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span class="block max-w-[240px] truncate" :title="bookingServices">
        {{ bookingServices }}
      </span>
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span
        :class="[
          'block max-w-[260px] truncate',
          booking.item_pemesanan?.length ? '' : 'text-gray-400 italic',
        ]"
        :title="bookingItems"
      >
        {{ bookingItems }}
      </span>
    </td>
    <td
      class="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900 sm:px-6"
    >
      {{ toIDR(bookingTotal) }}
    </td>
  </tr>
</template>
