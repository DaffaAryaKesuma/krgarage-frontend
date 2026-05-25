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
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getIconToneClass,
} from "@/utils/badgeVariants";
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
    class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between gap-2 sm:gap-3 mb-4 sm:mb-5 pb-4 border-b border-gray-100"
    >
      <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div
          :class="[
            getIconToneClass('neutral'),
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12',
          ]"
        >
          <i class="mdi mdi-calendar text-xl sm:text-2xl"></i>
        </div>
        <div class="min-w-0">
          <p :class="META_LABEL_CLASS">
            Kode Pemesanan
          </p>
          <p class="font-bold text-gray-900 text-sm sm:text-base break-all">
            {{ pemesanan.kode_pemesanan }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-0.5 sm:gap-1 shrink-0">
        <span :class="[getStatusBadgeClass(pemesanan.status), 'text-xs']">{{
          getStatusLabel(pemesanan.status || "Menunggu")
        }}</span>
        <span
          :class="[
            getPembayaranStatusBadgeClass(pemesanan.status_pembayaran),
            'text-xs',
          ]"
          >{{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}</span
        >
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
      <!-- Vespa Info -->
      <div
        :class="[getAlertBoxClass('neutral'), 'flex gap-2 p-2.5 shadow-none sm:p-3']"
      >
        <div
          class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 shrink-0"
        >
          <i class="mdi mdi-motorbike text-lg sm:text-xl"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p :class="META_LABEL_CLASS">
            Vespa
          </p>
          <p class="font-semibold text-gray-900 text-xs sm:text-sm truncate">
            {{ pemesanan.vespa?.model || "N/A" }}
          </p>
          <p class="text-[11px] sm:text-xs text-gray-500 font-medium truncate">
            {{ pemesanan.vespa?.plat_nomor || "N/A" }}
          </p>
        </div>
      </div>

      <!-- Layanan -->
      <div
        :class="[getAlertBoxClass('neutral'), 'flex gap-2 p-2.5 shadow-none sm:p-3']"
      >
        <div
          class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 shrink-0"
        >
          <i class="mdi mdi-wrench text-lg sm:text-xl"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p :class="META_LABEL_CLASS">
            Layanan
          </p>
          <div class="space-y-0.5">
            <p
              v-for="(layanan, i) in pemesanan.layanan"
              :key="i"
              class="text-xs sm:text-sm font-semibold text-gray-900 truncate"
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
      <div
        :class="[getAlertBoxClass('neutral'), 'flex gap-2 p-2.5 shadow-none sm:p-3']"
      >
        <div
          class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 shrink-0"
        >
          <i class="mdi mdi-calendar-clock text-lg sm:text-xl"></i>
        </div>
        <div class="min-w-0">
          <p :class="META_LABEL_CLASS">
            Tanggal
          </p>
          <p class="font-semibold text-gray-900 text-xs sm:text-sm">
            {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
          </p>
        </div>
      </div>

      <!-- Jam Pemesanan -->
      <div
        :class="[getAlertBoxClass('neutral'), 'flex gap-2 p-2.5 shadow-none sm:p-3']"
      >
        <div
          class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 shrink-0"
        >
          <i class="mdi mdi-clock-outline text-lg sm:text-xl"></i>
        </div>
        <div class="min-w-0">
          <p :class="META_LABEL_CLASS">
            Jam
          </p>
          <p class="font-semibold text-gray-900 text-xs sm:text-sm">
            {{ formatTimeShort(pemesanan.jam_pemesanan) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Aksi -->
    <div class="pt-3 sm:pt-4 border-t border-gray-200">
      <div
        :class="
          canPelangganCancelPemesanan(pemesanan.status)
            ? 'grid grid-cols-2 gap-2 sm:gap-3'
            : 'block'
        "
      >
        <template v-if="canPelangganCancelPemesanan(pemesanan.status)">
          <button
            @click="handleCancel"
            :disabled="isCancelling"
            class="w-full px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <i
              v-if="isCancelling"
              class="mdi mdi-loading mdi-spin text-base"
            ></i>
            <i v-else class="mdi mdi-close-circle text-base"></i>
            <span>{{ isCancelling ? "Membatalkan..." : "Batalkan" }}</span>
          </button>
        </template>

        <router-link
          :to="`/app/riwayat/${pemesanan.id}`"
          class="w-full px-3 sm:px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
        >
          <i class="mdi mdi-text-box-search-outline text-base"></i>
          <span>Lihat Detail</span>
        </router-link>
      </div>

      <p
        v-if="canPelangganCancelPemesanan(pemesanan.status)"
        class="text-[11px] sm:text-xs text-gray-500 text-center mt-2.5 sm:mt-3 leading-relaxed"
      >
        <i class="mdi mdi-information text-xs"></i>
        Pemesanan dapat dibatalkan selama statusnya masih "Menunggu" atau
        "Dikonfirmasi"
      </p>
    </div>
  </div>
</template>
