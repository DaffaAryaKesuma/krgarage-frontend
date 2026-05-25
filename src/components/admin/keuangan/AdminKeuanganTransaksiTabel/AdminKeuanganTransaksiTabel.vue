<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import Pagination from "@/components/ui/Pagination.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AdminKeuanganTransaksiKartuMobile from "@/components/admin/keuangan/AdminKeuanganTransaksiKartuMobile.vue";
import AdminKeuanganTransaksiBarisDesktop from "@/components/admin/keuangan/AdminKeuanganTransaksiBarisDesktop.vue";
import {
  useAdminKeuanganTransaksiTabel,
  TABLE_HEADERS,
  TABLE_WRAPPER_CLASS_WITH_MARGIN,
  TABLE_CLASS,
  TABLE_HEADER_CELL_CLASS,
} from "@/components/admin/keuangan/AdminKeuanganTransaksiTabel/useAdminKeuanganTransaksiTabel";
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
} from "@/utils/tableVariants";
import type { KeuanganPemesanan } from "@/types/pemesanan";

const props = defineProps<{ pemesanan: KeuanganPemesanan[] }>();

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
  <div :class="TABLE_WRAPPER_CLASS_WITH_MARGIN">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
    </div>
    <TableShell
      v-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :table-class="TABLE_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
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

      <AdminKeuanganTransaksiBarisDesktop
        v-for="pemesanan in paginatedPemesanan"
        :key="pemesanan.id"
        :pemesanan="pemesanan"
        :pemesanan-layanan="getPemesananLayanan(pemesanan.layanan)"
        :pemesanan-items="getPemesananItems(pemesanan.item_pemesanan)"
        :pemesanan-total="getPemesananTotal(pemesanan)"
      />

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

    <EmptyState
      v-else
      icon="mdi mdi-cash-multiple"
      title="Tidak Ada Transaksi"
      message="Tidak ditemukan data transaksi untuk periode yang dipilih."
    />
  </div>
</template>
