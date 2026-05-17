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
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">Kode Pemesanan</p>
        <p class="font-bold text-gray-900">{{ pemesanan.kode_pemesanan }}</p>
      </div>
      <div class="text-right">
        <span :class="getStatusBadgeClass(pemesanan.status)">
          {{ getStatusLabel(pemesanan.status) }}
        </span>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">Pelanggan</p>
        <p class="text-gray-700"><span>{{ formatNama(pemesanan.nama_pelanggan) }}</span></p>
      </div>
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">Tanggal</p>
        <p class="text-gray-700">{{ formatDateShort(pemesanan.tanggal_pemesanan) }}</p>
      </div>
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">Layanan</p>
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
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-900">Pembayaran</p>
        <p :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)" class="mt-0.5">
          {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
        </p>
      </div>
      <div class="col-span-2 mt-2 border-t border-gray-100 pt-3 flex justify-between items-center">
        <p class="text-xs font-semibold text-gray-900 uppercase">Total</p>
        <p class="text-base font-bold text-gray-900">{{ toIDR(pemesanan.total_harga) }}</p>
      </div>
    </div>
  </div>
</template>
