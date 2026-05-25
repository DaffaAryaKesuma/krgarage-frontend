<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import { formatNama } from "@/utils/format";
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";
import { getPembayaranStatusBadgeClass, getPembayaranStatusLabel } from "@/utils/pembayaranStatus";
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
import {
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
} from "@/utils/tableVariants";

interface Props {
  pemesanan: PemilikTerbaruPemesananActivity;
}

defineProps<Props>();
</script>

<template>
  <div :class="TABLE_MOBILE_CARD_CLASS">
    <div :class="TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">Kode Pemesanan</p>
        <p class="font-bold text-gray-900">{{ pemesanan.kode_pemesanan }}</p>
      </div>
      <div class="text-right">
        <span :class="getStatusBadgeClass(pemesanan.status)">
          {{ getStatusLabel(pemesanan.status) }}
        </span>
      </div>
    </div>
    
    <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">Pelanggan</p>
        <p class="text-gray-700"><span>{{ formatNama(pemesanan.nama_pelanggan) }}</span></p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Tanggal</p>
        <p class="text-gray-700">{{ formatDateShort(pemesanan.tanggal_pemesanan) }}</p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Layanan</p>
        <div class="space-y-0.5">
          <p
            v-for="(layanan, i) in pemesanan.nama_layanan.split(', ')"
            :key="i"
            class="text-gray-700 leading-snug"
          >
            {{ layanan }}
          </p>
        </div>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Pembayaran</p>
        <p :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)" class="mt-0.5">
          {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
        </p>
      </div>
      <div class="col-span-2 mt-2 border-t border-gray-100 pt-3 flex justify-between items-center">
        <p :class="META_LABEL_CLASS">Total</p>
        <p class="text-base font-bold text-gray-900">{{ toIDR(pemesanan.total_harga) }}</p>
      </div>
    </div>
  </div>
</template>
