<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import {
  canMekanikAddSparepart,
  canMekanikUpdateStatus,
  getMekanikActionButtonClass,
  getMekanikActionButtonText,
  getStatusBadgeClass,
  getStatusLabel,
  isCompletedStatus,
} from "@/utils/statusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import type { MekanikBooking } from "@/types/booking";

interface Props {
  bookings: MekanikBooking[];
  loading: boolean;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

withDefaults(defineProps<Props>(), {
  emptyIcon: "mdi mdi-clipboard-list",
  emptyTitle: "Tidak ada pekerjaan",
  emptyMessage: "Tidak ada pekerjaan saat ini.",
  loadingMessage: "Memuat data...",
});

const emit = defineEmits<{
  updateStatus: [bookingId: number];
  addSparepart: [bookingId: number];
  deleteSparepart: [bookingId: number, itemId: number];
}>();


</script>

<template>
  <LoadingSpinner v-if="loading" :message="loadingMessage" />

  <EmptyState
    v-else-if="bookings.length === 0"
    :icon="emptyIcon"
    :title="emptyTitle"
    :message="emptyMessage"
  />

  <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <div
      v-for="booking in bookings"
      :key="booking.id"
      class="bg-white rounded-2xl shadow-[0_2px_16px_rgb(0,0,0,0.07)] border border-gray-100 overflow-hidden hover:shadow-[0_4px_24px_rgb(0,0,0,0.11)] transition-shadow duration-200"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 px-5 pt-4 pb-4 flex items-start justify-between">
        <div>
          <p class="text-[10px] font-medium text-red-200 uppercase tracking-widest mb-0.5">
            Kode Pemesanan
          </p>
          <p class="text-base font-bold text-white tracking-tight">
            {{ booking.kode_pemesanan }}
          </p>
        </div>
        <span :class="getStatusBadgeClass(booking.status)" class="mt-0.5">
          {{ getStatusLabel(booking.status) }}
        </span>
      </div>

      <!-- Body -->
      <div class="px-5 py-4 space-y-3">

        <!-- Info Grid (2 kolom) -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <!-- Pelanggan -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <i class="mdi mdi-account text-red-500 text-base"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Pelanggan</p>
              <p class="text-sm font-semibold text-gray-900 truncate"><span class="capitalize">{{ booking.pengguna.nama }}</span></p>
            </div>
          </div>

          <!-- Vespa -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <i class="mdi mdi-motorbike text-red-500 text-base"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Vespa</p>
              <p class="text-sm font-semibold text-gray-900 truncate">{{ booking.vespa.model }}</p>
              <span v-if="booking.vespa.plat_nomor" class="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                {{ booking.vespa.plat_nomor }}
              </span>
            </div>
          </div>

          <!-- Tanggal -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <i class="mdi mdi-calendar text-red-500 text-base"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Tanggal</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatDateShort(booking.tanggal_pemesanan) }}</p>
            </div>
          </div>

          <!-- Jam -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <i class="mdi mdi-clock-outline text-red-500 text-base"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Jam</p>
              <p class="text-sm font-semibold text-gray-900">{{ booking.jam_pemesanan }}</p>
            </div>
          </div>
        </div>

        <!-- Layanan (full width) -->
        <div class="flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
            <i class="mdi mdi-wrench text-red-500 text-base"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] text-gray-400 font-medium leading-none mb-1">Layanan</p>
            <template v-if="booking.layanan?.length">
              <p
                v-for="(service, index) in booking.layanan"
                :key="index"
                class="text-sm font-semibold text-gray-900 leading-snug"
              >
                {{ service.nama_layanan }}
              </p>
            </template>
            <p v-else class="text-sm font-semibold text-gray-400 italic">Layanan tidak tersedia</p>
          </div>
        </div>

        <!-- Catatan Pelanggan -->
        <div
          v-if="booking.catatan_pelanggan"
          class="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3"
        >
          <i class="mdi mdi-note-text-outline text-amber-500 text-base shrink-0 mt-0.5"></i>
          <div>
            <p class="text-[10px] font-semibold text-amber-700 mb-0.5">Catatan Pelanggan</p>
            <p class="text-xs text-amber-900">{{ booking.catatan_pelanggan }}</p>
          </div>
        </div>

        <!-- Suku Cadang -->
        <div v-if="booking.item_pemesanan?.length" class="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
          <p class="text-[10px] font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
            <i class="mdi mdi-cog text-blue-500"></i>
            Suku Cadang Digunakan
          </p>
          <div class="space-y-1.5">
            <div
              v-for="item in booking.item_pemesanan"
              :key="item.id"
              class="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-blue-100/60"
            >
              <span class="text-xs font-medium text-gray-700">{{ item.suku_cadang.nama_suku_cadang }}</span>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{{ item.jumlah }}x</span>
                <button
                  v-if="canMekanikAddSparepart(booking.status)"
                  @click="emit('deleteSparepart', booking.id, item.id)"
                  class="text-red-400 hover:text-red-600 transition-colors"
                  title="Hapus sparepart"
                >
                  <i class="mdi mdi-close-circle text-base"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Catatan Mekanik -->
        <div
          v-if="booking.catatan_mekanik"
          class="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl p-3"
        >
          <i class="mdi mdi-wrench-check text-green-500 text-base shrink-0 mt-0.5"></i>
          <div>
            <p class="text-[10px] font-semibold text-green-700 mb-0.5">Catatan Mekanik</p>
            <p class="text-xs text-green-900 whitespace-pre-line">{{ booking.catatan_mekanik }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-1">
          <!-- Active job buttons -->
          <div
            v-if="canMekanikUpdateStatus(booking.status) || canMekanikAddSparepart(booking.status)"
            class="grid grid-cols-2 gap-2"
          >
            <button
              v-if="canMekanikUpdateStatus(booking.status)"
              @click="emit('updateStatus', booking.id)"
              :class="[
                'flex items-center justify-center gap-2 py-2.5 text-white font-semibold rounded-xl transition-all duration-150 text-sm active:scale-[0.97]',
                getMekanikActionButtonClass(booking.status),
              ]"
            >
              {{ getMekanikActionButtonText(booking.status) }}
            </button>

            <button
              v-if="canMekanikAddSparepart(booking.status)"
              @click="emit('addSparepart', booking.id)"
              class="flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-150 text-sm active:scale-[0.97]"
            >
              Tambah Suku Cadang
            </button>
          </div>

          <!-- Completed state -->
          <div
            v-if="isCompletedStatus(booking.status)"
            class="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3"
          >
            <i class="mdi mdi-check text-green-500 text-xl"></i>
            <p class="text-sm text-green-800 font-semibold">Pekerjaan Selesai</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
