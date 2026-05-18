<script setup lang="ts">
import { computed } from "vue";
import { formatDateShort } from "@/utils/date";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import PemilikKeuanganMobileKartu from "@/components/pemilik/keuangan/PemilikKeuanganMobileKartu.vue";
import PemilikKeuanganDesktopRow from "@/components/pemilik/keuangan/PemilikKeuanganDesktopRow.vue";
import { toMoneyNumber } from "@/utils/money";
import type {
  KeuanganPemesanan,
  KeuanganPemesananLayanan,
} from "@/types/pemesanan";

interface Props {
  pemesanan: KeuanganPemesanan[];
  loading: boolean;
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

interface Emits {
  (e: "update:currentPage", value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const totalPages = computed(() => {
  return Math.ceil(props.pemesanan.length / props.itemsPerPage);
});

const from = computed(() => {
  if (props.pemesanan.length === 0) return 0;
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const to = computed(() => {
  if (props.pemesanan.length === 0) return 0;
  return Math.min(
    props.currentPage * props.itemsPerPage,
    props.pemesanan.length,
  );
});

const paginatedPemesanan = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.pemesanan.slice(start, end);
});

const handlePageChange = (page: number) => {
  emit("update:currentPage", page);
};

const getPemesananDate = (pemesanan: KeuanganPemesanan) =>
  pemesanan.updated_at || pemesanan.tanggal_pemesanan || "";

const getPemesananPlateNumber = (pemesanan: KeuanganPemesanan) =>
  pemesanan.vespa?.plat_nomor || "-";

const getPemesananStatus = (pemesanan: KeuanganPemesanan) =>
  pemesanan.status || "Selesai";

const calculateLayananTotal = (layanan: KeuanganPemesananLayanan[]) =>
  layanan.reduce(
    (total, itemLayanan) =>
      total + toMoneyNumber(itemLayanan.pivot.harga_saat_pesan || 0),
    0,
  );

const getPemesananTotal = (pemesanan: KeuanganPemesanan) =>
  pemesanan.total_harga || calculateLayananTotal(pemesanan.layanan);

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Plat Nomor",
  "Total Biaya",
  "Status",
  "Pembayaran",
];
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-calendar-check text-red-600"></i>
          Rincian Pemesanan
        </h2>
      </div>

    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="h-16 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <TableShell
      v-else-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      mobile-kartu-class="space-y-4 p-4"
      wrapper-class="rounded-lg border border-gray-200"
      table-class="w-full"
      head-class="bg-gray-50"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      header-cell-class="px-6 py-4"
      body-class="divide-y divide-gray-200 bg-white"
    >
      <template #mobile>
        <PemilikKeuanganMobileKartu
          v-for="pemesanan in paginatedPemesanan"
          :key="`mobile-${pemesanan.id}`"
          :pemesanan="pemesanan"
          :pemesanan-date="getPemesananDate(pemesanan)"
          :plate-number="getPemesananPlateNumber(pemesanan)"
          :pemesanan-status="getPemesananStatus(pemesanan)"
          :pemesanan-total="getPemesananTotal(pemesanan)"
        />
      </template>

      <PemilikKeuanganDesktopRow
        v-for="pemesanan in paginatedPemesanan"
        :key="pemesanan.id"
        :pemesanan="pemesanan"
        :pemesanan-date="getPemesananDate(pemesanan)"
        :plate-number="getPemesananPlateNumber(pemesanan)"
        :pemesanan-status="getPemesananStatus(pemesanan)"
        :pemesanan-total="getPemesananTotal(pemesanan)"
      />

      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="pemesanan.length"
            :per-page="itemsPerPage"
            :from="from"
            :to="to"
            @page-change="handlePageChange"
          />
        </div>
      </template>
    </TableShell>

    <EmptyState
      v-else
      icon="mdi mdi-calendar-search"
      title="Tidak ada data ditemukan"
      :message="`Tidak ada transaksi yang selesai dari ${formatDateShort(startDate)} sampai ${formatDateShort(endDate)}.`"
      class="py-12"
    />
  </div>
</template>
