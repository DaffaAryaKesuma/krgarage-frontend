<script setup lang="ts">
import { computed } from "vue";
import { formatDateShort } from "@/utils/date";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { toMoneyNumber, toIDR } from "@/utils/money";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { formatNama } from "@/utils/format";
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
        <div
          v-for="pemesanan in paginatedPemesanan"
          :key="`mobile-${pemesanan.id}`"
          class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Kode Pemesanan
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ pemesanan.kode_pemesanan }}
              </p>
            </div>
            <span :class="getStatusBadgeClass(getPemesananStatus(pemesanan))">
              {{ getStatusLabel(getPemesananStatus(pemesanan)) }}
            </span>
          </div>

          <div
            class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2"
          >
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ formatNama(pemesanan.pengguna?.nama || "-") }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Tanggal
              </p>
              <p class="font-medium text-gray-900">
                {{ formatDateShort(getPemesananDate(pemesanan)) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Plat Nomor
              </p>
              <p class="font-medium text-gray-900">
                {{ getPemesananPlateNumber(pemesanan) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pembayaran
              </p>
              <span
                :class="
                  getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)
                "
              >
                {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
              </span>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Total Biaya
              </p>
              <p class="font-semibold text-gray-900">
                {{ toIDR(getPemesananTotal(pemesanan)) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="pemesanan in paginatedPemesanan"
        :key="pemesanan.id"
        class="hover:bg-gray-50 transition-colors"
      >
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ pemesanan.kode_pemesanan }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ formatDateShort(getPemesananDate(pemesanan)) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ formatNama(pemesanan.pengguna?.nama || "-") }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ getPemesananPlateNumber(pemesanan) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ toIDR(getPemesananTotal(pemesanan)) }}
        </td>
        <td class="px-6 py-4">
          <span :class="getStatusBadgeClass(getPemesananStatus(pemesanan))">
            {{ getStatusLabel(getPemesananStatus(pemesanan)) }}
          </span>
        </td>
        <td class="px-6 py-4">
          <span
            :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)"
          >
            {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
          </span>
        </td>
      </tr>

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
