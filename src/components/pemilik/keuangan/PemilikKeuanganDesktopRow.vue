<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { formatNama } from "@/utils/format";
import type { KeuanganPemesanan } from "@/types/pemesanan";

interface Props {
  pemesanan: KeuanganPemesanan;
  pemesananDate: string;
  plateNumber: string;
  pemesananStatus: string;
  pemesananTotal: number | string;
}

defineProps<Props>();
</script>

<template>
  <tr class="hover:bg-gray-50 transition-colors">
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ pemesanan.kode_pemesanan }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ formatDateShort(pemesananDate) }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ formatNama(pemesanan.pengguna?.nama || "-") }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ plateNumber }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ toIDR(pemesananTotal) }}
    </td>
    <td class="px-6 py-4">
      <span :class="getStatusBadgeClass(pemesananStatus)">
        {{ getStatusLabel(pemesananStatus) }}
      </span>
    </td>
    <td class="px-6 py-4">
      <span :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)">
        {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
      </span>
    </td>
  </tr>
</template>
