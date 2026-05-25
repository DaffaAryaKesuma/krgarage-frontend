<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getIconToneClass,
} from "@/utils/badgeVariants";
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

    <!-- Kartu Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div
          :class="[
            getIconToneClass('primary'),
            'flex h-14 w-14 items-center justify-center rounded-2xl',
          ]"
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

    <!-- Layanan Status -->
    <div
      v-if="vespa.perlu_servis"
      :class="[getAlertBoxClass('error'), 'mb-5 flex items-center gap-3 p-3.5 shadow-none']"
    >
      <div
        :class="[
          getIconToneClass('danger'),
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
        ]"
      >
        <i class="mdi mdi-alert-circle text-lg"></i>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide">
          Perlu Servis
        </p>
        <p class="mt-0.5 text-xs font-medium">
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
      :class="[getAlertBoxClass('warning'), 'mb-5 flex items-center gap-3 p-3.5 shadow-none']"
    >
      <div
        :class="[
          getIconToneClass('warning'),
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
        ]"
      >
        <i class="mdi mdi-clock-alert text-lg"></i>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide">
          Servis Segera
        </p>
        <p class="mt-0.5 text-xs font-medium">
          {{ vespa.hari_hingga_servis }} hari lagi
        </p>
      </div>
    </div>

    <!-- Info Kartu -->
    <div class="grid grid-cols-2 gap-3 mb-6 flex-1">
      <!-- Tahun (Full Width) -->
      <div
        class="col-span-2 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
      >
        <div
          class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"
        >
          <i
            :class="[getAlertIconClass('info'), 'mdi mdi-calendar-range text-lg']"
          ></i>
        </div>
        <div class="overflow-hidden">
          <p :class="[META_LABEL_CLASS, 'mb-0.5']">
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
          <i
            :class="[getAlertIconClass('success'), 'mdi mdi-wrench-clock text-lg']"
          ></i>
        </div>
        <div>
          <p :class="[META_LABEL_CLASS, 'mb-0.5']">
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

    <!-- Aksi Buttons -->
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
