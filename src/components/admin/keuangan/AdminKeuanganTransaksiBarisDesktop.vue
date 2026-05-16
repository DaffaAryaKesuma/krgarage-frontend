<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import type { KeuanganPemesanan } from "@/types/pemesanan";

interface Props {
  pemesanan: KeuanganPemesanan;
  pemesananLayanan: string[];
  pemesananItems: string[];
  pemesananTotal: number;
}

defineProps<Props>();
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50 align-top">
    <td class="px-4 py-4 text-sm  text-gray-700 sm:px-6 break-all">
      {{ pemesanan.kode_pemesanan }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ formatDateShort(pemesanan.updated_at) }}
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span class="capitalize">{{ pemesanan.pengguna.nama }}</span>
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <div class="space-y-0.5">
        <p v-for="(layanan, i) in pemesananLayanan" :key="i" class="leading-snug">
          {{ layanan }}
        </p>
      </div>
    </td>
    <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
      <div v-if="pemesananItems.length" class="space-y-0.5">
        <p v-for="(item, i) in pemesananItems" :key="i" class="leading-snug">
          {{ item }}
        </p>
      </div>
      <span v-else class="text-gray-700 italic">-</span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ toIDR(pemesananTotal) }}
    </td>
  </tr>
</template>
