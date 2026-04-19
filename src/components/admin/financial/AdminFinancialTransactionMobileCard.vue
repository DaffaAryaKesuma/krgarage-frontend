<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import type { FinancialBooking } from "@/types/booking";

interface Props {
  booking: FinancialBooking;
  bookingServices: string;
  bookingItems: string;
  bookingTotal: number;
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
      <div class="text-right">
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Tanggal
        </p>
        <p class="text-sm font-medium text-gray-900">
          {{ formatDateShort(booking.updated_at) }}
        </p>
      </div>
    </div>

    <div class="mt-3 space-y-2 text-sm">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Pelanggan
        </p>
        <p class="font-medium text-gray-900">
          {{ booking.pengguna.nama }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Layanan
        </p>
        <p class="text-gray-900">
          {{ bookingServices }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Suku Cadang
        </p>
        <p
          :class="
            booking.item_pemesanan?.length
              ? 'text-gray-900'
              : 'text-gray-400 italic'
          "
        >
          {{ bookingItems }}
        </p>
      </div>
      <div class="border-t border-gray-100 pt-2">
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Total
        </p>
        <p class="font-semibold text-gray-900">
          {{ toIDR(bookingTotal) }}
        </p>
      </div>
    </div>
  </div>
</template>
