<script setup lang="ts">
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import {
  MEKANIK_PEKERJAAN_GRID_DEFAULTS,
  useMekanikPekerjaanGrid,
  type MekanikPekerjaanGridProps,
} from "./useMekanikPekerjaanGrid";

withDefaults(
  defineProps<MekanikPekerjaanGridProps>(),
  MEKANIK_PEKERJAAN_GRID_DEFAULTS,
);

const emit = defineEmits<{
  updateStatus: [pemesananId: number];
  addSukuCadang: [pemesananId: number];
  deleteSukuCadang: [pemesananId: number, itemId: number];
}>();

const {
  formatDateShort,
  formatTimeShort,
  canMekanikAddSukuCadang,
  canMekanikUpdateStatus,
  getMekanikAksiButtonClass,
  getMekanikAksiButtonText,
  getStatusBadgeClass,
  getStatusLabel,
  isStatusSelesai,
} = useMekanikPekerjaanGrid();
</script>

<template>
  <LoadingSpinner v-if="loading" :message="loadingMessage" />

  <EmptyState
    v-else-if="pemesanan.length === 0"
    :icon="emptyIcon"
    :title="emptyTitle"
    :message="emptyMessage"
  />

  <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-2">
    <div
      v-for="item in pemesanan"
      :key="item.id"
      class="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <!-- Header -->
      <div class="bg-white px-5 pt-4 pb-4 flex items-start justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 uppercase">
            Kode Pemesanan
          </p>
          <p class="text-base font-bold text-gray-900 tracking-tight">
            {{ item.kode_pemesanan }}
          </p>
        </div>
        <span :class="getStatusBadgeClass(item.status)" class="mt-0.5">
          {{ getStatusLabel(item.status) }}
        </span>
      </div>

      <!-- Body -->
      <div class="flex-grow flex flex-col px-5 py-4 space-y-3">
        <!-- Info Grid (2 kolom) -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <!-- Pelanggan -->
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
            >
              <i class="mdi mdi-account text-gray-600 text-base"></i>
            </div>
            <div class="min-w-0">
              <p
                class="text-[10px] text-gray-400 font-medium leading-none mb-0.5"
              >
                Pelanggan
              </p>
              <p class="text-sm font-semibold text-gray-900 truncate">
                <span class="capitalize">{{ item.pengguna.nama }}</span>
              </p>
            </div>
          </div>

          <!-- Vespa -->
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
            >
              <i class="mdi mdi-motorbike text-gray-600 text-base"></i>
            </div>
            <div class="min-w-0">
              <p
                class="text-[10px] text-gray-400 font-medium leading-none mb-0.5"
              >
                Vespa
              </p>
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ item.vespa.model }}
              </p>
              <span
                v-if="item.vespa.plat_nomor"
                class="text-[10px] font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded uppercase"
              >
                {{ item.vespa.plat_nomor }}
              </span>
            </div>
          </div>

          <!-- Tanggal -->
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
            >
              <i class="mdi mdi-calendar text-gray-600 text-base"></i>
            </div>
            <div class="min-w-0">
              <p
                class="text-[10px] text-gray-400 font-medium leading-none mb-0.5"
              >
                Tanggal
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ formatDateShort(item.tanggal_pemesanan) }}
              </p>
            </div>
          </div>

          <!-- Jam -->
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
            >
              <i class="mdi mdi-clock-outline text-gray-600 text-base"></i>
            </div>
            <div class="min-w-0">
              <p
                class="text-[10px] text-gray-400 font-medium leading-none mb-0.5"
              >
                Jam
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ formatTimeShort(item.jam_pemesanan) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Layanan (full width) -->
        <div class="flex items-start gap-2.5">
          <div
            class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5"
          >
            <i class="mdi mdi-wrench text-gray-600 text-base"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] text-gray-400 font-medium leading-none mb-1">
              Layanan
            </p>
            <template v-if="item.layanan?.length">
              <p
                v-for="(layananItem, index) in item.layanan"
                :key="index"
                class="text-sm font-semibold text-gray-900 leading-snug"
              >
                {{ layananItem.nama_layanan }}
              </p>
            </template>
            <p v-else class="text-sm font-semibold text-gray-400 italic">
              Layanan tidak tersedia
            </p>
          </div>
        </div>

        <!-- Catatan Pelanggan -->
        <div
          v-if="item.catatan_pelanggan"
          class="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3"
        >
          <i
            class="mdi mdi-note-text-outline text-gray-600 text-base shrink-0 mt-0.5"
          ></i>
          <div>
            <p class="text-[10px] font-semibold text-gray-600 mb-0.5">
              Catatan Pelanggan
            </p>
            <p class="text-xs text-gray-600">{{ item.catatan_pelanggan }}</p>
          </div>
        </div>

        <!-- Suku Cadang -->
        <details
          v-if="item.item_pemesanan?.length"
          class="group bg-gray-50/60 border border-gray-100 rounded-xl"
          :open="item.item_pemesanan.length <= 0"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-[10px] font-semibold text-gray-700 marker:hidden"
          >
            <span class="flex min-w-0 items-center gap-1.5">
              <i class="mdi mdi-cog text-gray-600"></i>
              Suku Cadang Digunakan
              <span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600">
                {{ item.item_pemesanan.length }}
              </span>
            </span>
            <i
              class="mdi mdi-chevron-down text-base text-gray-500 transition-transform group-open:rotate-180"
            ></i>
          </summary>

          <div class="space-y-1.5 border-t border-gray-100 px-3 pb-3 pt-2">
            <div
              v-for="subItem in item.item_pemesanan"
              :key="subItem.id"
              class="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-blue-100/60"
            >
              <span class="text-xs font-medium text-gray-700">{{
                subItem.nama_suku_cadang_saat_ini ||
                subItem.suku_cadang?.nama_suku_cadang ||
                "Suku Cadang Tidak Ditemukan"
              }}</span>
              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-bold text-gray-600 px-2 py-0.5 rounded-full"
                  >{{ subItem.jumlah }}x</span
                >
                <button
                  v-if="canMekanikAddSukuCadang(item.status)"
                  @click="emit('deleteSukuCadang', item.id, subItem.id)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Hapus Suku Cadang"
                >
                  <i class="mdi mdi-close-circle text-base"></i>
                </button>
              </div>
            </div>
          </div>
        </details>

        <!-- Catatan Mekanik -->
        <div
          v-if="item.catatan_mekanik"
          class="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl p-3"
        >
          <i
            class="mdi mdi-wrench-check text-green-500 text-base shrink-0 mt-0.5"
          ></i>
          <div>
            <p class="text-[10px] font-semibold text-green-700 mb-0.5">
              Catatan Mekanik
            </p>
            <p class="text-xs text-green-900 whitespace-pre-line">
              {{ item.catatan_mekanik }}
            </p>
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="pt-1 mt-auto">
          <!-- Tombol Pekerjaan Aktif -->
          <div
            v-if="
              canMekanikUpdateStatus(item.status) ||
              canMekanikAddSukuCadang(item.status)
            "
            class="grid grid-cols-2 gap-2"
          >
            <button
              v-if="canMekanikUpdateStatus(item.status)"
              @click="emit('updateStatus', item.id)"
              :class="[
                'flex items-center justify-center gap-2 py-2.5 text-white font-semibold rounded-xl transition-all duration-150 text-sm active:scale-[0.97]',
                getMekanikAksiButtonClass(item.status),
              ]"
            >
              {{ getMekanikAksiButtonText(item.status) }}
            </button>

            <button
              v-if="canMekanikAddSukuCadang(item.status)"
              @click="emit('addSukuCadang', item.id)"
              class="flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-150 text-sm active:scale-[0.97]"
            >
              Tambah Suku Cadang
            </button>
          </div>

          <!-- Status Selesai -->
          <div
            v-if="isStatusSelesai(item.status)"
            class="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3"
          >
            <i class="mdi mdi-check text-green-500 text-xl"></i>
            <p class="text-sm text-green-700 font-semibold">
              Pekerjaan Selesai
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
