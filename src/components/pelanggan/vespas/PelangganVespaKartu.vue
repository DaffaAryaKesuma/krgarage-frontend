<script setup lang="ts">
// Helper untuk menampilkan tanggal pendek dan plat nomor rapi.
import { formatDateShort } from "@/utils/date";
import { formatPlatNomor } from "@/utils/format";
// Helper class untuk badge, alert, ikon, dan label kecil.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getIconToneClass,
} from "@/utils/badgeVariants";
// Helper class untuk tombol aksi.
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
// Tipe data Vespa yang diterima komponen.
import type { VespaDetail } from "@/types/vespa";

// Props menerima satu data Vespa.
interface Props {
  vespa: VespaDetail;
}

// Props didaftarkan supaya bisa dipakai langsung di template.
defineProps<Props>();
// Event dikirim ke parent saat tombol edit atau hapus diklik.
const emit = defineEmits<{
  edit: [vespa: VespaDetail];
  delete: [vespa: VespaDetail];
}>();
</script>

<template>
  <!-- Kartu utama satu Vespa. -->
  <div
    class="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5"
  >
    <!-- Header kartu berisi ikon, model, dan plat nomor. -->
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <div
          :class="[
            getIconToneClass('primary'),
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
          ]"
        >
          <i class="mdi mdi-motorbike text-2xl"></i>
        </div>
        <div class="min-w-0">
          <h3 class="truncate text-lg font-bold text-gray-900">
            {{ vespa.model }}
          </h3>
          <p
            class="mt-0.5 text-sm font-bold uppercase text-gray-500"
          >
            {{ formatPlatNomor(vespa.plat_nomor) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Alert merah muncul jika Vespa sudah melewati jadwal servis. -->
    <div
      v-if="vespa.perlu_servis"
      :class="[getAlertBoxClass('error'), 'mb-4 flex items-center gap-3 p-3 shadow-none']"
    >
      <div
        :class="[
          getIconToneClass('danger'),
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
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
    <!-- Alert kuning muncul jika jadwal servis tinggal 7 hari atau kurang. -->
    <div
      v-else-if="
        vespa.hari_hingga_servis &&
        vespa.hari_hingga_servis <= 7 &&
        !vespa.perlu_servis
      "
      :class="[getAlertBoxClass('warning'), 'mb-4 flex items-center gap-3 p-3 shadow-none']"
    >
      <div
        :class="[
          getIconToneClass('warning'),
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
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

    <!-- Bagian informasi tambahan Vespa. -->
    <div class="mb-5 grid flex-1 grid-cols-1 gap-3">
      <!-- Tahun produksi Vespa. -->
      <div
        class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
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

      <!-- Tanggal servis terakhir, tampil '-' jika belum ada. -->
      <div
        class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
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

    <!-- Tombol edit dan hapus Vespa. -->
    <div class="mt-auto flex gap-3 border-t border-gray-100 pt-4">
      <button
        @click="emit('edit', vespa)"
        :class="getButtonClass('secondary', 'md', 'flex-1 rounded-xl shadow-sm')"
      >
        <i class="mdi mdi-pencil"></i>
        Edit
      </button>
      <button
        @click="emit('delete', vespa)"
        :class="getIconButtonClass('danger', 'lg', 'rounded-xl border border-red-100 bg-white shadow-sm')"
        title="Hapus Vespa"
      >
        <i class="mdi mdi-delete text-lg"></i>
      </button>
    </div>
  </div>
</template>
