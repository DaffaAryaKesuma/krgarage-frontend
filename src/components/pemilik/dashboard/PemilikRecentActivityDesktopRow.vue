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
  <tr class="text-sm hover:bg-gray-50">
    <td class="py-4 font-semibold text-gray-900">
      {{ booking.kode_pemesanan }}
    </td>
    <td class="py-4 text-gray-700">
      {{ formatDateShort(booking.tanggal_pemesanan) }}
    </td>
    <td class="py-4 text-gray-900">
      {{ booking.nama_pelanggan }}
    </td>
    <td class="py-4 text-gray-700">{{ booking.nama_layanan }}</td>
    <td class="py-4 font-semibold text-gray-900">
      {{ toIDR(booking.total_harga) }}
    </td>
    <td class="py-4">
      <span :class="getStatusBadgeClass(booking.status)">
        {{ getStatusLabel(booking.status) }}
      </span>
    </td>
  </tr>
</template>
