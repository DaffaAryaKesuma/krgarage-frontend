<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import type { PemilikRecentBookingActivity } from "@/types/booking";

interface Props {
  booking: PemilikRecentBookingActivity;
}

defineProps<Props>();
</script>

<template>
  <tr class="text-sm hover:bg-gray-50 align-top">
    <td class="py-4 pr-4 text-gray-700">
      {{ booking.kode_pemesanan }}
    </td>
    <td class="py-4 pr-4 text-gray-700 whitespace-nowrap">
      {{ formatDateShort(booking.tanggal_pemesanan) }}
    </td>
    <td class="py-4 pr-4 text-gray-700">
      <span class="capitalize">{{ booking.nama_pelanggan }}</span>
    </td>
    <td class="py-4 pr-4 text-gray-700">
      <div class="space-y-0.5">
        <p
          v-for="(layanan, i) in booking.nama_layanan.split(', ')"
          :key="i"
          class="leading-snug"
        >
          {{ layanan }}
        </p>
      </div>
    </td>
    <td class="py-4 pr-4 text-gray-700 whitespace-nowrap">
      {{ toIDR(booking.total_harga) }}
    </td>
    <td class="py-4">
      <span :class="getStatusBadgeClass(booking.status)">
        {{ getStatusLabel(booking.status) }}
      </span>
    </td>
  </tr>
</template>
