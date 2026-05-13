<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import type { FinancialBooking } from "@/types/booking";

interface Props {
  booking: FinancialBooking;
  bookingServices: string[];
  bookingItems: string[];
  bookingTotal: number;
}

defineProps<Props>();
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50 align-top">
    <td class="px-4 py-4 text-sm  text-gray-700 sm:px-6 break-all">
      {{ booking.kode_pemesanan }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ formatDateShort(booking.updated_at) }}
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span class="capitalize">{{ booking.pengguna.nama }}</span>
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <div class="space-y-0.5">
        <p v-for="(service, i) in bookingServices" :key="i" class="leading-snug">
          {{ service }}
        </p>
      </div>
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <div v-if="bookingItems.length" class="space-y-0.5">
        <p v-for="(item, i) in bookingItems" :key="i" class="leading-snug">
          {{ item }}
        </p>
      </div>
      <span v-else class="text-gray-700 italic">-</span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ toIDR(bookingTotal) }}
    </td>
  </tr>
</template>
