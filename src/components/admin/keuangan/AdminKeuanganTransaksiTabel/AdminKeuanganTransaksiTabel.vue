<script setup lang="ts">
// Tabel responsive, pagination, dan empty state.
import TableShell from "@/components/ui/TableShell.vue";
import Pagination from "@/components/ui/Pagination.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Tampilan mobile dan desktop transaksi.
import AdminKeuanganTransaksiKartuMobile from "@/components/admin/keuangan/AdminKeuanganTransaksiKartuMobile.vue";
import AdminKeuanganTransaksiBarisDesktop from "@/components/admin/keuangan/AdminKeuanganTransaksiBarisDesktop.vue";
// Logic dan konstanta tabel transaksi.
import {
  useAdminKeuanganTransaksiTabel,
  TABLE_HEADERS,
  TABLE_WRAPPER_CLASS_WITH_MARGIN,
  TABLE_COLUMN_WIDTHS,
  TABLE_CLASS,
  TABLE_HEADER_CELL_CLASS,
} from "@/components/admin/keuangan/AdminKeuanganTransaksiTabel/useAdminKeuanganTransaksiTabel";
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
} from "@/utils/tableVariants";
import type { KeuanganPemesanan } from "@/types/pemesanan";

// Props transaksi dari laporan keuangan.
const props = defineProps<{ pemesanan: KeuanganPemesanan[] }>();

// Ambil pagination dan helper tampilan dari composable.
const {
  currentPage,
  totalPages,
  paginatedPemesanan,
  from,
  to,
  handlePageChange,
  getPemesananLayanan,
  getPemesananItems,
  getPemesananTotal,
  ITEMS_PER_PAGE,
} = useAdminKeuanganTransaksiTabel(() => props.pemesanan);
</script>

<template>
  <!-- Wrapper tabel detail transaksi. -->
  <div :class="TABLE_WRAPPER_CLASS_WITH_MARGIN">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
    </div>
    <!-- Tabel transaksi responsive jika ada data. -->
    <TableShell
      v-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
      :table-class="TABLE_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <!-- Slot kartu mobile. -->
      <template #mobile>
        <AdminKeuanganTransaksiKartuMobile
          v-for="pemesanan in paginatedPemesanan"
          :key="`mobile-${pemesanan.id}`"
          :pemesanan="pemesanan"
          :pemesanan-layanan="getPemesananLayanan(pemesanan.layanan)"
          :pemesanan-items="getPemesananItems(pemesanan.item_pemesanan)"
          :pemesanan-total="getPemesananTotal(pemesanan)"
        />
      </template>

      <!-- Baris desktop. -->
      <AdminKeuanganTransaksiBarisDesktop
        v-for="pemesanan in paginatedPemesanan"
        :key="pemesanan.id"
        :pemesanan="pemesanan"
        :pemesanan-layanan="getPemesananLayanan(pemesanan.layanan)"
        :pemesanan-items="getPemesananItems(pemesanan.item_pemesanan)"
        :pemesanan-total="getPemesananTotal(pemesanan)"
      />

      <!-- Footer pagination. -->
      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="pemesanan.length"
            :per-page="ITEMS_PER_PAGE"
            :from="from"
            :to="to"
            @page-change="handlePageChange"
          />
        </div>
      </template>
    </TableShell>

    <!-- Empty state jika tidak ada transaksi. -->
    <EmptyState
      v-else
      icon="mdi mdi-cash-multiple"
      title="Tidak Ada Transaksi"
      message="Tidak ditemukan data transaksi untuk periode yang dipilih."
    />
  </div>
</template>
