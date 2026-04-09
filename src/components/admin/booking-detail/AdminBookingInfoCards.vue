<script setup lang="ts">
import { formatDateShort, formatTimeShort } from "@/utils/date";

interface User {
  nama: string;
  email: string;
  no_telepon?: string;
}

interface Vespa {
  model: string;
  tahun_produksi: number;
  plat_nomor: string;
}

interface Props {
  user: User;
  vespa: Vespa;
  tanggalPemesanan: string;
  jamPemesanan: string;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Pelanggan Card -->
    <div
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-account text-xl text-blue-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Pelanggan</h3>
      </div>
      <div class="space-y-2">
        <p class="text-lg font-bold text-gray-900">{{ user.nama }}</p>
        <p class="text-sm text-gray-600">{{ user.email }}</p>
        <div v-if="user.no_telepon" class="flex items-center gap-2 mt-2">
          <i class="mdi mdi-phone text-green-600"></i>
          <a
            :href="`tel:${user.no_telepon}`"
            class="text-sm font-medium text-green-600 hover:text-green-700 transition"
          >
            {{ user.no_telepon }}
          </a>
        </div>
      </div>
    </div>

    <!-- Vespa Card -->
    <div
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-motorbike text-xl text-red-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Vespa</h3>
      </div>
      <div class="space-y-2">
        <p class="text-lg font-bold text-gray-900">{{ vespa.model }}</p>
        <div class="flex items-center gap-3 text-sm text-gray-600 mt-2">
          <span>{{ vespa.tahun_produksi }}</span>
          <span>•</span>
          <span class="font-medium">{{ vespa.plat_nomor }}</span>
        </div>
      </div>
    </div>

    <!-- Tanggal Card -->
    <div
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
        >
          <i class="mdi mdi-calendar text-xl text-green-600"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Tanggal & Waktu</h3>
      </div>
      <div class="space-y-2">
        <p class="text-lg font-bold text-gray-900">
          {{ formatDateShort(tanggalPemesanan) }}
        </p>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i class="mdi mdi-clock-outline"></i>
          <span>{{ formatTimeShort(jamPemesanan) }}</span>
        </div>
      </div>
    </div>

    <!-- Render panel/komponen kontrol yang disejajarkan di kolom keempat -->
    <slot></slot>
  </div>
</template>
