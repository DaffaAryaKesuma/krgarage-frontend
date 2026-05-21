<script setup lang="ts">
import { formatDateShort, formatTimeShort } from "@/utils/date";
import {
  canPelangganCancelPemesanan,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import type { PelangganPemesanan } from "@/types/pemesanan";

interface Props {
  pemesanan: PelangganPemesanan;
  isCancelling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCancelling: false,
});

const emit = defineEmits<{
  cancel: [pemesananId: number];
}>();

const handleCancel = () => {
  emit("cancel", props.pemesanan.id);
};
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 shrink-0"
        >
          <i class="mdi mdi-calendar text-2xl text-red-600"></i>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 font-semibold">Kode Pemesanan</p>
          <p class="font-bold text-gray-900 text-base sm:text-base">
            {{ pemesanan.kode_pemesanan }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1.5 shrink-0">
        <span :class="[getStatusBadgeClass(pemesanan.status)]">{{ getStatusLabel(pemesanan.status || "Menunggu") }}</span>
        <span :class="[getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)]">{{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}</span>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <!-- Vespa Info -->
      <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 shrink-0">
          <i class="mdi mdi-motorbike text-xl"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Vespa</p>
          <p class="font-semibold text-gray-900 text-sm truncate">
            {{ pemesanan.vespa?.model || "N/A" }}
          </p>
          <p class="text-xs text-gray-500 font-medium truncate">
            {{ pemesanan.vespa?.plat_nomor || "N/A" }}
          </p>
        </div>
      </div>

      <!-- Layanan -->
      <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 shrink-0">
          <i class="mdi mdi-wrench text-xl"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Layanan</p>
          <div class="space-y-0.5">
            <p
              v-for="(layanan, i) in pemesanan.layanan"
              :key="i"
              class="text-sm font-semibold text-gray-900 truncate"
            >
              {{
                layanan.pivot?.nama_layanan_saat_ini ||
                layanan.nama_layanan ||
                "Layanan Dihapus"
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tanggal Pemesanan -->
      <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 shrink-0">
          <i class="mdi mdi-calendar-clock text-xl"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Tanggal</p>
          <p class="font-semibold text-gray-900 text-sm">
            {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
          </p>
        </div>
      </div>

      <!-- Jam Pemesanan -->
      <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 shrink-0">
          <i class="mdi mdi-clock-outline text-xl"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Jam</p>
          <p class="font-semibold text-gray-900 text-sm">
            {{ formatTimeShort(pemesanan.jam_pemesanan) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Aksi -->
    <div class="pt-4 border-t border-gray-200">
      <div
        :class="
          canPelangganCancelPemesanan(pemesanan.status)
            ? 'grid grid-cols-2 gap-3'
            : 'block'
        "
      >
        <template v-if="canPelangganCancelPemesanan(pemesanan.status)">
          <button
            @click="handleCancel"
            :disabled="isCancelling"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="isCancelling" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-close-circle"></i>
            <span>{{ isCancelling ? "Membatalkan..." : "Batalkan" }}</span>
          </button>
        </template>

        <router-link
          :to="`/app/riwayat/${pemesanan.id}`"
          class="w-full px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <i class="mdi mdi-text-box-search-outline"></i>
          <span>Lihat Detail</span>
        </router-link>
      </div>

      <p
        v-if="canPelangganCancelPemesanan(pemesanan.status)"
        class="text-xs text-gray-500 text-center mt-3"
      >
        <i class="mdi mdi-information"></i>
        Pemesanan dapat dibatalkan selama statusnya masih "Menunggu" atau
        "Dikonfirmasi"
      </p>
    </div>
  </div>
</template>
