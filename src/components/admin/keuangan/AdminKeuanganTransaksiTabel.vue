<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TableShell from "@/components/ui/TableShell.vue";
import Pagination from "@/components/ui/Pagination.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AdminKeuanganTransaksiKartuMobile from "@/components/admin/keuangan/AdminKeuanganTransaksiKartuMobile.vue";
import AdminKeuanganTransaksiBarisDesktop from "@/components/admin/keuangan/AdminKeuanganTransaksiBarisDesktop.vue";
import { toMoneyNumber } from "@/utils/money";
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

interface Props {
  pemesanan: KeuanganPemesanan[];
}

const props = defineProps<Props>();

const ITEMS_PER_PAGE = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.pemesanan.length / ITEMS_PER_PAGE),
);

const paginatedPemesanan = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return props.pemesanan.slice(start, end);
});

const from = computed(() => {
  if (props.pemesanan.length === 0) return 0;
  return (currentPage.value - 1) * ITEMS_PER_PAGE + 1;
});

const to = computed(() => {
  if (props.pemesanan.length === 0) return 0;
  return Math.min(currentPage.value * ITEMS_PER_PAGE, props.pemesanan.length);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

watch(
  () => props.pemesanan.length,
  () => {
    currentPage.value = 1;
  },
);

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Suku Cadang",
  "Total",
];

const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
  layanan.reduce(
    (sum, s) => sum + toMoneyNumber(s.pivot.harga_saat_pesan || 0),
    0,
  );

const getPemesananLayanan = (layanan: KeuanganPemesananLayanan[]) =>
  layanan.map((s) => s.nama_layanan);

const getPemesananItems = (items?: KeuanganPemesanan["item_pemesanan"]) =>
  items?.length
    ? items.map((item) => `${item.suku_cadang.nama_suku_cadang} (x${item.jumlah})`)
    : [];

const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
  Number(pemesanan.total_harga) || calculateLayananTotal(pemesanan.layanan);

const TABLE_WRAPPER_CLASS =
  "mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "min-w-full table-fixed divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-900 sm:px-6 " +
  "[&:nth-child(1)]:w-[16%] [&:nth-child(2)]:w-[12%] [&:nth-child(3)]:w-[12%] [&:nth-child(4)]:w-[24%] [&:nth-child(5)]:w-[24%] [&:nth-child(6)]:w-[12%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_KARTU_CLASS = "space-y-4 bg-gray-50 p-4";
</script>

<template>
  <div :class="TABLE_WRAPPER_CLASS">
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
      head-class="bg-gray-50"
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
