<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { toMoneyNumber } from "@/utils/money";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
import type { PelangganPemesanan } from "@/types/pemesanan";

interface Props {
  pemesanan: PelangganPemesanan[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const getLayananPrice = (pemesanan: PelangganPemesanan) =>
  pemesanan.layanan.reduce(
    (sum, layanan) =>
      sum +
      toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0),
    0,
  );
</script>

<template>
  <section class="rounded-xl bg-white p-4 shadow-md sm:p-6">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
      <h2 class="text-xl font-bold text-gray-900 sm:text-2xl">
      <i class="mdi mdi-clipboard-text text-2xl"></i>
        Riwayat Terakhir
      </h2>
      <router-link
        to="/app/riwayat"
        class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>
    <LoadingSpinner v-if="isLoading" message="Memuat riwayat..." />
    <EmptyState
      v-else-if="pemesanan.length === 0"
      icon="mdi mdi-clipboard-outline"
      title="Belum ada riwayat pemesanan"
      message="Buat pemesanan pertama Anda untuk mulai menggunakan layanan kami"
      aksi-text="Buat Pemesanan Pertama"
      aksi-icon="mdi mdi-arrow-right"
      aksi-link="/app/pemesanan"
    />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="item in pemesanan"
        :key="item.id"
        class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5 flex flex-col h-full"
      >
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <i
              :class="
                item.status === 'Selesai'
                  ? `mdi mdi-check-circle ${getToneTextClass('success')} text-3xl`
                  : `mdi mdi-close-circle ${getToneTextClass('danger')} text-3xl`
              "
            ></i>
            <div>
              <p class="text-base font-bold text-gray-900 sm:text-lg">
                {{ item.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600">
                {{ formatDateShort(item.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span :class="[getPembayaranStatusBadgeClass(item.status_pembayaran), 'whitespace-nowrap']">{{ getPembayaranStatusLabel(item.status_pembayaran) }}</span>
          </div>
        </div>
        <div
          class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2"
        >
          <div class="flex items-start gap-2">
            <i class="mdi mdi-motorbike text-xl text-gray-600"></i>
            <div>
              <p :class="META_LABEL_CLASS">Vespa</p>
              <p class="font-semibold text-gray-900">
                {{ item.vespa?.model || "N/A" }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <i class="mdi mdi-wrench text-xl text-gray-600"></i>
            <div>
              <p :class="META_LABEL_CLASS">Layanan</p>
              <div class="space-y-0.5">
                <p
                  v-for="(layanan, i) in item.layanan"
                  :key="i"
                  class="font-semibold text-gray-900 text-sm leading-snug"
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
        </div>
        <div
          v-if="item.catatan_mekanik"
          :class="[getAlertBoxClass('success'), 'mb-4 w-full px-3 py-2 shadow-none']"
        >
          <p :class="[META_LABEL_CLASS, getAlertIconClass('success')]">
            Catatan Mekanik:
          </p>
          <p class="text-xs">{{ item.catatan_mekanik }}</p>
        </div>
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto"
        >
          <div>
            <p :class="META_LABEL_CLASS">Total Biaya</p>
            <p class="text-lg font-bold text-gray-900 sm:text-xl">
              {{ toIDR(item.total_harga || getLayananPrice(item)) }}
            </p>
          </div>
          <router-link
            :to="`/app/riwayat/${item.id}`"
            :class="getButtonClass('secondary', 'xs', 'gap-1.5 shadow-sm no-underline hover:text-red-600')"
          >
            <i class="mdi mdi-eye-outline text-sm"></i>
            <span>Detail</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
