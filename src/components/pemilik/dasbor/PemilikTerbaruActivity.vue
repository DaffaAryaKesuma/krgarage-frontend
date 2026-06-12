<script setup lang="ts">
// TableShell membuat tabel desktop dan kartu mobile dari data yang sama.
import TableShell from "@/components/ui/TableShell.vue";
// EmptyState tampil jika belum ada aktivitas.
import EmptyState from "@/components/ui/EmptyState.vue";
// Kartu mobile dan baris desktop dipisah agar responsif.
import PemilikTerbaruActivityMobileKartu from "@/components/pemilik/dasbor/PemilikTerbaruActivityMobileKartu.vue";
import PemilikTerbaruActivityDesktopRow from "@/components/pemilik/dasbor/PemilikTerbaruActivityDesktopRow.vue";
// Helper class tabel.
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_HEADER_CELL_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
} from "@/utils/tableVariants";
// Tipe aktivitas terbaru dari pemesanan.
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";

// Props menerima daftar aktivitas terbaru.
interface Props {
  pemesanan: PemilikTerbaruPemesananActivity[];
}

defineProps<Props>();

// Header kolom tabel desktop.
const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Total",
  "Status",
  "Pembayaran",
];

// Lebar kolom dibuat tetap agar tabel lebih rapi.
const TABLE_COLUMN_WIDTHS = ["14%", "16%", "13%", "20%", "12%", "11%", "13%"];
</script>

<template>
  <!-- Kartu aktivitas terbaru di dashboard pemilik. -->
  <div class="rounded-2xl bg-white p-5 shadow-lg mb-8 sm:p-6">
    <!-- Header section dan link ke laporan lengkap. -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="mdi mdi-calendar-clock text-xl"></i>
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

    <!-- Tabel aktivitas tampil jika data tersedia. -->
    <TableShell
      v-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :table-class="buildFixedTableClass('text-sm')"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="border-b border-gray-200"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
    >
      <!-- Tampilan mobile memakai kartu. -->
      <template #mobile>
        <PemilikTerbaruActivityMobileKartu
          v-for="item in pemesanan"
          :key="`mobile-${item.id}`"
          :pemesanan="item"
        />
      </template>

      <!-- Tampilan desktop memakai baris tabel. -->
      <PemilikTerbaruActivityDesktopRow
        v-for="item in pemesanan"
        :key="item.id"
        :pemesanan="item"
      />
    </TableShell>

    <!-- Empty state jika belum ada aktivitas pemesanan. -->
    <EmptyState
      v-else
      icon="mdi mdi-calendar-blank"
      title="Belum ada pemesanan terbaru"
      message="Aktivitas pemesanan terbaru akan muncul di sini."
    />
  </div>
</template>
