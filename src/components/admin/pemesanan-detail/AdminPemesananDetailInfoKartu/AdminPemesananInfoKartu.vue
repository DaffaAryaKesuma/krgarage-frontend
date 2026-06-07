<script setup lang="ts">
// Helper format tanggal/jam dan plat nomor.
import { formatDateShort, formatTimeShort } from "@/utils/date";
import { formatPlatNomor } from "@/utils/format";
import type { PemesananVespa } from "@/types/pemesanan";
import type { UserProfile } from "@/types/user";

// Props berisi info utama detail pemesanan.
interface Props {
  user: UserProfile;
  vespa: PemesananVespa;
  tanggalPemesanan: string;
  jamPemesanan: string;
}

defineProps<Props>();
</script>

<template>
  <!-- Grid info utama: pelanggan, Vespa, jadwal, dan slot kontrol. -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Kartu pelanggan. -->
    <div
      class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
    >
      <div class="mb-3 flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-account text-xl text-gray-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Pelanggan</h3>
      </div>
      <div class="min-w-0 space-y-2">
        <p class="text-lg font-bold text-gray-900"><span class="capitalize">{{ user.nama }}</span></p>
        <p class="break-words text-xs leading-snug text-gray-600 sm:text-sm">
          {{ user.email }}
        </p>
        <div v-if="user.no_telepon" class="mt-2 flex min-w-0 items-start gap-2">
          <i class="mdi mdi-phone mt-0.5 shrink-0 text-gray-600"></i>
          <a
            :href="`tel:${user.no_telepon}`"
            class="text-xs leading-snug font-medium text-gray-600 transition hover:text-gray-700 sm:text-sm"
          >
            {{ user.no_telepon }}
          </a>
        </div>
      </div>
    </div>

    <!-- Kartu Vespa. -->
    <div
      class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
    >
      <div class="mb-3 flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-motorbike text-xl text-gray-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Vespa</h3>
      </div>
      <div class="space-y-2">
        <p class="text-lg font-bold text-gray-900">{{ vespa.model || "-" }}</p>
        <p class="text-xs text-gray-500">Tahun Produksi</p>
        <p class="text-sm font-medium text-gray-900">
          {{ vespa.tahun_produksi || "-" }}
        </p>
        <p class="text-xs text-gray-500">Plat Nomor</p>
        <p class="break-words text-sm font-medium text-gray-900">
          {{ formatPlatNomor(vespa.plat_nomor) }}
        </p>
      </div>
    </div>

    <!-- Kartu tanggal dan jam servis. -->
    <div
      class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
    >
      <div class="mb-3 flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-calendar text-xl text-gray-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Tanggal & Waktu</h3>
      </div>
      <div class="space-y-2">
        <p class="text-xs text-gray-500">Tanggal Servis</p>
        <p class="text-lg font-bold text-gray-900">
          {{ formatDateShort(tanggalPemesanan) }}
        </p>
        <p class="text-xs text-gray-500">Jam Servis</p>
        <div class="flex items-center gap-2 font-medium text-sm text-gray-900">
          <i class="mdi mdi-clock-outline"></i>
          <span>{{ formatTimeShort(jamPemesanan) }}</span>
        </div>
      </div>
    </div>

    <!-- Slot untuk panel kontrol agar sejajar sebagai kolom keempat. -->
    <slot></slot>
  </div>
</template>
