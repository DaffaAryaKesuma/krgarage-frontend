<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
import {
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_CARD_STACK_CLASS,
} from "@/utils/tableVariants";
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
  <div :class="TABLE_MOBILE_CARD_CLASS">
    <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">
          Kode Pemesanan
        </p>
        <p class="text-sm text-gray-700">
          {{ pemesanan.kode_pemesanan }}
        </p>
      </div>
      <div class="text-right">
        <p :class="META_LABEL_CLASS">
          Tanggal
        </p>
        <p class="text-sm text-gray-900">
          {{ formatDateShort(pemesanan.paid_at || pemesanan.updated_at) }}
        </p>
      </div>
    </div>

    <div :class="TABLE_MOBILE_CARD_STACK_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">
          Pelanggan
        </p>
        <p class=" text-gray-900">
          <span class="capitalize">{{ pemesanan.pengguna.nama }}</span>
        </p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">
          Layanan
        </p>
        <div class="space-y-0.5">
          <p v-for="(layanan, i) in pemesananLayanan" :key="i" class="text-gray-700 leading-snug">
            {{ layanan }}
          </p>
        </div>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">
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
        <p :class="META_LABEL_CLASS">
          Total
        </p>
        <p class=" text-gray-700">
          {{ toIDR(pemesananTotal) }}
        </p>
      </div>
    </div>
  </div>
</template>
