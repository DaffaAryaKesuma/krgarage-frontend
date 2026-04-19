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
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Kode Pemesanan
        </p>
        <p class="text-sm font-semibold text-gray-900">
          {{ booking.kode_pemesanan }}
        </p>
      </div>
      <span :class="getStatusBadgeClass(booking.status)">
        {{ getStatusLabel(booking.status) }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Tanggal
        </p>
        <p class="font-medium text-gray-900">
          {{ formatDateShort(booking.tanggal_pemesanan) }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Pelanggan
        </p>
        <p class="font-medium text-gray-900">
          {{ booking.nama_pelanggan }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Layanan
        </p>
        <p class="font-medium text-gray-900">
          {{ booking.nama_layanan }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Total
        </p>
        <p class="font-semibold text-gray-900">
          {{ toIDR(booking.total_harga) }}
        </p>
      </div>
    </div>
  </div>
</template>
