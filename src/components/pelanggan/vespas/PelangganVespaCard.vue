<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import type { VespaDetail } from "@/types/vespa";

interface Props {
  vespa: VespaDetail;
}

defineProps<Props>();
const emit = defineEmits<{
  edit: [vespa: VespaDetail];
  delete: [vespa: VespaDetail];
}>();
</script>

<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group"
  >
    <!-- Accent Line -->
    <div
      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"
    ></div>

    <!-- Card Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600"
        >
          <i class="mdi mdi-motorbike text-3xl"></i>
        </div>
        <div>
          <h3 class="font-bold text-gray-900 text-xl tracking-tight">
            {{ vespa.model }}
          </h3>
          <p
            class="text-sm text-gray-500 font-bold uppercase tracking-widest mt-0.5"
          >
            {{ vespa.plat_nomor }}
          </p>
        </div>
      </div>
    </div>

    <!-- Service Status -->
    <div
      v-if="vespa.perlu_servis"
      class="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl mb-5"
    >
      <div
        class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
      >
        <i class="mdi mdi-alert-circle text-lg text-red-600"></i>
      </div>
      <div>
        <p class="text-xs font-bold text-red-800 uppercase tracking-wide">
          Perlu Servis
        </p>
        <p class="text-xs text-red-600 font-medium mt-0.5">
          Sudah lewat jadwal servis
        </p>
      </div>
    </div>
    <div
      v-else-if="
        vespa.hari_hingga_servis &&
        vespa.hari_hingga_servis <= 7 &&
        !vespa.perlu_servis
      "
      class="flex items-center gap-3 p-3.5 bg-orange-50 border border-orange-100 rounded-xl mb-5"
    >
      <div
        class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"
      >
        <i class="mdi mdi-clock-alert text-lg text-orange-600"></i>
      </div>
      <div>
        <p class="text-xs font-bold text-orange-800 uppercase tracking-wide">
          Servis Segera
        </p>
        <p class="text-xs text-orange-600 font-medium mt-0.5">
          {{ vespa.hari_hingga_servis }} hari lagi
        </p>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-2 gap-3 mb-6 flex-1">
      <!-- Tahun (Full Width) -->
      <div
        class="col-span-2 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
      >
        <div
          class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"
        >
          <i class="mdi mdi-calendar-range text-lg text-blue-600"></i>
        </div>
        <div class="overflow-hidden">
          <p
            class="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-0.5"
          >
            Tahun Produksi
          </p>
          <p class="font-bold text-gray-900 text-sm truncate">
            {{ vespa.tahun_produksi }}
          </p>
        </div>
      </div>

      <!-- Servis Terakhir -->
      <div
        class="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
      >
        <div
          class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <i class="mdi mdi-wrench-clock text-lg text-green-600"></i>
        </div>
        <div>
          <p
            class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-0.5"
          >
            Terakhir Servis
          </p>
          <p
            class="font-bold text-gray-900 text-sm truncate"
            :title="
              vespa.tanggal_servis_terakhir
                ? formatDateShort(vespa.tanggal_servis_terakhir)
                : '-'
            "
          >
            {{
              vespa.tanggal_servis_terakhir
                ? formatDateShort(vespa.tanggal_servis_terakhir)
                : "-"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 mt-auto pt-4 border-t border-gray-100">
      <button
        @click="emit('edit', vespa)"
        class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
      >
        <i class="mdi mdi-pencil"></i>
        Edit
      </button>
      <button
        @click="emit('delete', vespa)"
        class="py-2.5 px-4 bg-white border border-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center text-sm shadow-sm"
        title="Hapus Vespa"
      >
        <i class="mdi mdi-delete text-lg"></i>
      </button>
    </div>
  </div>
</template>
