<script setup lang="ts">
import { formatDateShort } from "@/utils/date";

interface Vespa {
  id: number;
  model: string;
  tahun_produksi: number;
  plat_nomor: string;
  tanggal_servis_terakhir?: string;
  jeda_hari_servis?: number;
  tanggal_servis_selanjutnya?: string;
  perlu_servis?: boolean;
  hari_hingga_servis?: number;
}

interface Props {
  vespa: Vespa;
}

defineProps<Props>();
const emit = defineEmits<{
  edit: [vespa: Vespa];
  delete: [vespa: Vespa];
}>();
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col"
  >
    <!-- Card Header -->
    <div class="mb-4 pb-4 border-b border-gray-100 flex items-start gap-3">
      <div
        class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
      >
        <i class="mdi mdi-motorbike text-2xl text-red-600"></i>
      </div>
      <div>
        <h3 class="font-bold text-gray-900 text-lg">
          {{ vespa.model }}
        </h3>
        <p class="text-xs text-gray-500">ID: {{ vespa.id }}</p>
      </div>
    </div>

    <!-- Service Status -->
    <div
      v-if="vespa.perlu_servis"
      class="flex items-center gap-2 p-3 bg-orange-100 border border-orange-300 rounded-lg mb-3"
    >
      <i class="mdi mdi-alert-circle text-xl text-orange-600"></i>
      <div>
        <p class="text-xs font-semibold text-orange-800">Perlu Servis</p>
        <p class="text-xs text-orange-700">
          Sudah {{ Math.abs(vespa.hari_hingga_servis || 0) }} hari sejak jadwal
        </p>
      </div>
    </div>
    <div
      v-else-if="
        vespa.hari_hingga_servis &&
        vespa.hari_hingga_servis <= 7 &&
        !vespa.perlu_servis
      "
      class="flex items-center gap-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg mb-3"
    >
      <i class="mdi mdi-clock-alert text-xl text-yellow-600"></i>
      <div>
        <p class="text-xs font-semibold text-yellow-800">Servis Segera</p>
        <p class="text-xs text-yellow-700">
          {{ vespa.hari_hingga_servis }} hari lagi
        </p>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="space-y-3 mb-6 flex-1">
      <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
        <i class="mdi mdi-calendar-range text-xl text-amber-600"></i>
        <div>
          <p class="text-xs text-gray-500">Tahun</p>
          <p class="font-semibold text-gray-900">
            {{ vespa.tahun_produksi }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
        <i class="mdi mdi-license-plate text-xl text-purple-600"></i>
        <div>
          <p class="text-xs text-gray-500">Plat Nomor</p>
          <p class="font-bold text-gray-900 text-sm uppercase tracking-wider">
            {{ vespa.plat_nomor }}
          </p>
        </div>
      </div>
      <div
        v-if="vespa.tanggal_servis_terakhir"
        class="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
      >
        <i class="mdi mdi-wrench-clock text-xl text-green-600"></i>
        <div>
          <p class="text-xs text-gray-500">Servis Terakhir</p>
          <p class="text-xs font-semibold text-gray-900">
            {{ formatDateShort(vespa.tanggal_servis_terakhir) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 pt-4 border-t border-gray-100">
      <button
        @click="emit('edit', vespa)"
        class="flex-1 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
      >
        <i class="mdi mdi-pencil"></i>
        Edit
      </button>
      <button
        @click="emit('delete', vespa)"
        class="flex-1 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
      >
        <i class="mdi mdi-delete"></i>
        Hapus
      </button>
    </div>
  </div>
</template>
