<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import PemilikTerbaruActivityMobileKartu from "@/components/pemilik/dasbor/PemilikTerbaruActivityMobileKartu.vue";
import PemilikTerbaruActivityDesktopRow from "@/components/pemilik/dasbor/PemilikTerbaruActivityDesktopRow.vue";
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_HEADER_CELL_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/utils/tableVariants";
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";

interface Props {
  pemesanan: PemilikTerbaruPemesananActivity[];
  loading: boolean;
}

defineProps<Props>();

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Total",
  "Status",
  "Pembayaran",
];
</script>

<template>
  <div class="rounded-2xl bg-white p-6 shadow-lg mb-8">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="mdi mdi-calendar-clock text-2xl"></i>
        <h2 class="text-xl font-bold text-gray-900">
          Aktivitas Terbaru
        </h2>
      </div>
      <router-link
        to="/pemilik/laporan-keuangan"
        class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right"></i>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <!-- Pemesanan Table -->
    <TableShell
      v-else-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="border-b border-gray-200"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <template #mobile>
        <PemilikTerbaruActivityMobileKartu
          v-for="item in pemesanan"
          :key="`mobile-${item.id}`"
          :pemesanan="item"
        />
      </template>

      <PemilikTerbaruActivityDesktopRow
        v-for="item in pemesanan"
        :key="item.id"
        :pemesanan="item"
      />
    </TableShell>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="mdi mdi-calendar-blank"
      title="Belum ada pemesanan terbaru"
      message="Aktivitas pemesanan terbaru akan muncul di sini."
    />
  </div>
</template>
