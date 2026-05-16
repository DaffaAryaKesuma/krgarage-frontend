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
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Kode Pemesanan
        </p>
        <p class="text-sm font-semibold text-gray-900">
          {{ pemesanan.kode_pemesanan }}
        </p>
      </div>
      <span :class="getStatusBadgeClass(pemesananStatus)">
        {{ getStatusLabel(pemesananStatus) }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Pembayaran
        </p>
        <span :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)">
          {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
        </span>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Tanggal
        </p>
        <p class="font-medium text-gray-900">
          {{ formatDateShort(pemesananDate) }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Pelanggan
        </p>
        <p class="font-medium text-gray-900">
          {{ formatNama(pemesanan.pengguna?.nama || "-") }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Plat Nomor
        </p>
        <p class="font-medium text-gray-900">
          {{ plateNumber }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Total Biaya
        </p>
        <p class="font-semibold text-gray-900">
          {{ toIDR(pemesananTotal) }}
        </p>
      </div>
    </div>
  </div>
</template>
