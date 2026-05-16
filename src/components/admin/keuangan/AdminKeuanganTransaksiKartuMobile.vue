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
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-[11px] font-semibold uppercase tracking-wide text-gray-900"
        >
          Kode Pemesanan
        </p>
        <p class="text-sm text-gray-700">
          {{ pemesanan.kode_pemesanan }}
        </p>
      </div>
      <div class="text-right">
        <p
          class="text-[11px] font-semibold uppercase tracking-wide text-gray-900"
        >
          Tanggal
        </p>
        <p class="text-sm text-gray-900">
          {{ formatDateShort(pemesanan.updated_at) }}
        </p>
      </div>
    </div>

    <div class="mt-3 space-y-2 text-sm">
      <div>
        <p
          class="text-[11px] font-semibold uppercase tracking-wide text-gray-900"
        >
          Pelanggan
        </p>
        <p class=" text-gray-900">
          <span class="capitalize">{{ pemesanan.pengguna.nama }}</span>
        </p>
      </div>
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">
          Layanan
        </p>
        <div class="space-y-0.5">
          <p v-for="(layanan, i) in pemesananLayanan" :key="i" class="text-gray-700 leading-snug">
            {{ layanan }}
          </p>
        </div>
      </div>
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">
          Suku Cadang
        </p>
        <div v-if="pemesananItems.length" class="space-y-0.5">
          <p v-for="(item, i) in pemesananItems" :key="i" class="text-gray-700 leading-snug">
            {{ item }}
          </p>
        </div>
        <p v-else class="text-gray-700 italic">-</p>
      </div>
      <div class="border-t border-gray-100 pt-2">
        <p
          class="text-[11px] font-semibold uppercase tracking-wide text-gray-900"
        >
          Total
        </p>
        <p class=" text-gray-700">
          {{ toIDR(pemesananTotal) }}
        </p>
      </div>
    </div>
  </div>
</template>
