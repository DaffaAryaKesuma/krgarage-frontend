<script setup lang="ts">
import { formatDateShort, formatDateTimeShort, formatTimeShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { formatPlatNomor } from "@/utils/format";
import type { Pemesanan } from "@/types/pemesanan";

defineProps<{
  pemesanan: Pemesanan;
}>();
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-3 flex items-center gap-2">
        <i class="mdi mdi-clipboard-text text-xl text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Pemesanan</h2>
      </div>
      <p class="text-sm text-gray-600">Kode Pemesanan</p>
      <p class="text-sm font-medium text-gray-900">
        {{ pemesanan.kode_pemesanan }}
      </p>

      <p class="mt-3 text-sm text-gray-600">Tanggal Servis</p>
      <p class="text-sm font-medium text-gray-900">
        {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
      </p>

      <p class="mt-3 text-sm text-gray-600">Jam Servis</p>
      <p class="text-sm font-medium text-gray-900">
        {{ formatTimeShort(pemesanan.jam_pemesanan) }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-3 flex items-center gap-2">
        <i class="mdi mdi-motorbike text-xl text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Informasi Vespa</h2>
      </div>
      <p class="text-sm text-gray-600">Model</p>
      <p class="text-sm font-medium text-gray-900">{{ pemesanan.vespa?.model || "-" }}</p>
      <p class="mt-3 text-sm text-gray-600">Plat Nomor</p>
      <p class="text-sm font-medium text-gray-900">
        {{ formatPlatNomor(pemesanan.vespa?.plat_nomor) }}
      </p>
      <p class="mt-3 text-sm text-gray-600">Tahun Produksi</p>
      <p class="text-sm font-medium text-gray-900">
        {{ pemesanan.vespa?.tahun_produksi || "-" }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-3 flex items-center gap-2">
        <i class="mdi mdi-account-wrench text-xl text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Mekanik</h2>
      </div>
      <p class="text-sm text-gray-600">Nama Mekanik</p>
      <p class="text-sm font-medium text-gray-900 capitalize">
        {{ pemesanan.mekanik?.nama || "Belum ditugaskan" }}
      </p>

      <p class="mt-3 text-sm text-gray-600">Status Servis</p>
      <div class="mt-1 flex flex-wrap items-center gap-2">
        <span :class="[getStatusBadgeClass(pemesanan.status), 'whitespace-nowrap']">{{ getStatusLabel(pemesanan.status || "Menunggu") }}</span>
        <span v-if="pemesanan.completed_at" class="text-sm text-gray-600">
          {{ formatDateTimeShort(pemesanan.completed_at) }}
        </span>
      </div>

      <p class="mt-3 text-sm text-gray-600">Pembayaran</p>
      <div class="mt-1 flex flex-wrap items-center gap-2">
        <span :class="[getPembayaranStatusBadgeClass(pemesanan.status_pembayaran), 'whitespace-nowrap']">{{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}</span>
        <span v-if="pemesanan.paid_at" class="text-sm text-gray-600">
          {{ formatDateTimeShort(pemesanan.paid_at) }}
        </span>
      </div>
    </div>
  </section>
</template>
