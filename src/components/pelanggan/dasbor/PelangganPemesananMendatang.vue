<script setup lang="ts">
// Helper format uang dan tanggal.
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
// Helper status servis dan pembayaran.
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { toMoneyNumber } from "@/utils/money";
// Komponen loading dan empty.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Helper label, warna teks, dan tombol.
import { META_LABEL_CLASS, getToneTextClass } from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";
import type { PelangganPemesanan } from "@/types/pemesanan";

// Props daftar pemesanan mendatang.
interface Props {
  pemesanan: PelangganPemesanan[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

// Hitung total layanan sebagai fallback jika total_harga belum tersedia.
const getLayananTotal = (pemesanan: PelangganPemesanan) =>
  pemesanan.layanan.reduce(
    (sum, layanan) =>
      sum +
      toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0),
    0,
  );
</script>

<template>
  <!-- Section pemesanan mendatang di dashboard pelanggan. -->
  <section class="rounded-xl bg-white p-4 shadow-md sm:p-6">
    <!-- Header section. -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
      <h2 class="text-xl font-bold text-gray-900 sm:text-2xl">
        Pemesanan Mendatang
      </h2>
    </div>

    <!-- Loading state. -->
    <LoadingSpinner v-if="isLoading" message="Memuat pemesanan..." />

    <!-- Empty state. -->
    <EmptyState
      v-else-if="pemesanan.length === 0"
      icon="mdi mdi-calendar-blank-outline"
      title="Belum ada pemesanan mendatang"
      message="Pemesanan servis Anda yang akan datang akan muncul di sini."
    />

    <!-- Grid daftar pemesanan mendatang. -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="item in pemesanan"
        :key="item.id"
        class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5 flex flex-col h-full"
      >
        <!-- Header kode, tanggal, status servis dan pembayaran. -->
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <i :class="['mdi mdi-calendar-month text-3xl', getToneTextClass('primary')]"></i>
            <div>
              <p class="text-base font-bold text-gray-900 sm:text-lg">
                {{ item.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatDateShort(item.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span :class="[getStatusBadgeClass(item.status || 'Menunggu'), 'whitespace-nowrap']">{{ getStatusLabel(item.status || "Menunggu") }}</span>
            <span :class="[getPembayaranStatusBadgeClass(item.status_pembayaran), 'whitespace-nowrap']">{{ getPembayaranStatusLabel(item.status_pembayaran) }}</span>
          </div>
        </div>
        <!-- Info Vespa dan layanan. -->
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
        <!-- Total biaya dan tombol detail. -->
        <div
          class="flex flex-col gap-3 pt-4 border-t border-gray-200 mt-auto sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p :class="META_LABEL_CLASS">Total Biaya</p>
            <p :class="['text-lg font-bold sm:text-xl', getToneTextClass('primary')]">
              {{ toIDR(item.total_harga || getLayananTotal(item)) }}
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
