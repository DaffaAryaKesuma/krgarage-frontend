<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import { formatNama } from "@/utils/format";
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";
import { getPembayaranStatusBadgeClass, getPembayaranStatusLabel } from "@/utils/pembayaranStatus";

interface Props {
  pemesanan: PemilikTerbaruPemesananActivity;
}

defineProps<Props>();
</script>

<template>
  <tr class="text-sm hover:bg-gray-50 align-top">
    <td class="py-4 pr-4 text-gray-700">
      {{ pemesanan.kode_pemesanan }}
    </td>
    <td class="py-4 pr-4 text-gray-700 whitespace-nowrap">
      {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
    </td>
    <td class="py-4 pr-4 text-gray-700">
      <span>{{ formatNama(pemesanan.nama_pelanggan) }}</span>
    </td>
    <td class="py-4 pr-4 text-gray-700">
      <div class="space-y-0.5">
        <p
          v-for="(layanan, i) in pemesanan.nama_layanan.split(', ')"
          :key="i"
          class="leading-snug"
        >
          {{ layanan }}
        </p>
      </div>
    </td>
    <td class="py-4 pr-4 text-gray-700 whitespace-nowrap">
      {{ toIDR(pemesanan.total_harga) }}
    </td>
    <td class="py-4">
      <span :class="getStatusBadgeClass(pemesanan.status)">
        {{ getStatusLabel(pemesanan.status) }}
      </span>
    </td>
    <td class="py-4">
      <span :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)">
        {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
      </span>
    </td>
  </tr>
</template>
