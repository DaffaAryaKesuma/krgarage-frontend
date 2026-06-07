<script setup lang="ts">
// Helper format tanggal, tanggal+jam, dan jam.
import { formatDateShort, formatDateTimeShort, formatTimeShort } from "@/utils/date";
// Helper status servis pelanggan.
import {
  canPelangganCancelPemesanan,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/statusBadge";
// Helper status pembayaran.
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
// Helper class label, alert box, dan ikon.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getIconToneClass,
} from "@/utils/badgeVariants";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";
// Helper format plat nomor agar kapital dan rapi.
import { formatPlatNomor } from "@/utils/format";
// Tipe data pemesanan milik pelanggan.
import type { PelangganPemesanan } from "@/types/pemesanan";

// Props menerima satu pemesanan dan status proses pembatalan.
interface Props {
  pemesanan: PelangganPemesanan;
  isCancelling?: boolean;
}

// Default pembatalan false.
const props = withDefaults(defineProps<Props>(), {
  isCancelling: false,
});

// Event cancel dikirim ke parent dengan id pemesanan.
const emit = defineEmits<{
  cancel: [pemesananId: number];
}>();

// Handler tombol batal.
const handleCancel = () => {
  emit("cancel", props.pemesanan.id);
};
</script>

<template>
  <!-- Kartu satu riwayat pemesanan. -->
  <div
    class="flex h-full flex-col bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all"
  >
    <!-- Header berisi kode pemesanan. -->
    <div
      class="flex items-start justify-between gap-2 sm:gap-3 mb-3 pb-2 border-b border-gray-100"
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
    </div>

    <!-- Ringkasan status servis dan pembayaran. -->
    <div
      class="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
    >
      <div>
        <p :class="[META_LABEL_CLASS, 'mb-1.5']">Status Servis</p>
        <span :class="[getStatusBadgeClass(pemesanan.status), 'text-xs']">{{
          getStatusLabel(pemesanan.status || "Menunggu")
        }}</span>
        <!-- completed_at tampil jika servis sudah selesai. -->
        <p v-if="pemesanan.completed_at" class="mt-1.5 text-xs text-gray-600">
          {{ formatDateTimeShort(pemesanan.completed_at) }}
        </p>
      </div>

      <div class="text-right">
        <p :class="[META_LABEL_CLASS, 'mb-1.5']">Pembayaran</p>
        <span
          :class="[
            getPembayaranStatusBadgeClass(pemesanan.status_pembayaran),
            'text-xs',
          ]"
          >{{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}</span
        >
        <!-- paid_at tampil jika pembayaran sudah lunas. -->
        <p v-if="pemesanan.paid_at" class="mt-1.5 text-xs text-gray-600">
          {{ formatDateTimeShort(pemesanan.paid_at) }}
        </p>
      </div>
    </div>

    <!-- Grid informasi utama pemesanan. -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
      <!-- Informasi Vespa yang diservis. -->
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
            {{ formatPlatNomor(pemesanan.vespa?.plat_nomor) }}
          </p>
        </div>
      </div>

      <!-- Layanan yang dipilih saat pemesanan. -->
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

      <!-- Tanggal servis. -->
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

      <!-- Jam servis. -->
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

    <!-- Area aksi dibuat mt-auto agar tombol detail sejajar antar kartu. -->
    <div class="mt-auto pt-3 sm:pt-4 border-t border-gray-200">
      <div
        :class="
          canPelangganCancelPemesanan(pemesanan.status)
            ? 'grid grid-cols-2 gap-2 sm:gap-3'
            : 'block'
        "
      >
        <!-- Tombol batal hanya muncul untuk status yang masih boleh dibatalkan pelanggan. -->
        <template v-if="canPelangganCancelPemesanan(pemesanan.status)">
          <button
            @click="handleCancel"
            :disabled="isCancelling"
            :class="getButtonClass('dangerOutline', 'sm', 'w-full disabled:opacity-50 disabled:cursor-not-allowed')"
          >
            <i v-if="isCancelling" class="mdi mdi-loading mdi-spin text-base"></i>
            <i v-else class="mdi mdi-close-circle text-base"></i>
            <span>{{ isCancelling ? "Membatalkan..." : "Batalkan" }}</span>
          </button>
        </template>

        <!-- Link menuju halaman detail riwayat. -->
        <router-link
          :to="`/app/riwayat/${pemesanan.id}`"
          :class="getButtonClass('neutralOutline', 'sm', 'w-full')"
        >
          <i class="mdi mdi-text-box-search-outline text-base"></i>
          <span>Lihat Detail</span>
        </router-link>
      </div>

      <!-- Keterangan aturan pembatalan. -->
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
