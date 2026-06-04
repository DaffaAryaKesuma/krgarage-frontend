<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import { formatNama } from "@/utils/format";
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";

interface Props {
  pemesanan: PemilikTerbaruPemesananActivity;
}

defineProps<Props>();
</script>

<template>
  <tr
    class="text-sm hover:bg-gray-50/80 transition-colors align-middle border-b border-gray-100 last:border-0"
  >
    <!-- Kode Pemesanan -->
    <td class="px-4 py-3 sm:px-5 align-middle">
      <span class="text-gray-900">{{
        pemesanan.kode_pemesanan
      }}</span>
    </td>

    <!-- Tanggal -->
    <td class="px-4 py-3 sm:px-5 align-middle text-gray-900">
      {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
    </td>

    <!-- Pelanggan -->
    <td class="px-4 py-3 sm:px-5 align-middle text-gray-900">
      {{ formatNama(pemesanan.nama_pelanggan) }}
    </td>

    <!-- Layanan -->
    <td
      class="px-4 py-3 sm:px-5 align-middle text-gray-700 max-w-xs sm:max-w-sm"
    >
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(layanan, i) in pemesanan.nama_layanan.split(', ')"
          :key="i"
          class="inline-flex items-center gap-1 align-middle text-gray-900"
        >
          {{ layanan }}
        </span>
      </div>
    </td>

    <!-- Total -->
    <td
      class="px-4 py-3 sm:px-5 align-middle text-gray-900"
    >
      {{ toIDR(pemesanan.total_harga) }}
    </td>

    <!-- Status Servis -->
    <td class="px-4 py-3 sm:px-5 align-middle whitespace-nowrap">
      <span :class="[getStatusBadgeClass(pemesanan.status), 'shadow-sm']">
        {{ getStatusLabel(pemesanan.status) }}
      </span>
    </td>

    <!-- Status Pembayaran -->
    <td class="px-4 py-3 sm:px-5 align-middle whitespace-nowrap">
      <span
        :class="[
          getPembayaranStatusBadgeClass(pemesanan.status_pembayaran),
          'shadow-sm',
        ]"
      >
        {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
      </span>
    </td>
  </tr>
</template>
