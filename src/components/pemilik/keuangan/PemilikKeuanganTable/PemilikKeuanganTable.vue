<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { toIDR } from "@/utils/money";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { formatNama } from "@/utils/format";
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
import {
  TABLE_BODY_CLASS,
  TABLE_COMFORTABLE_HEADER_CELL_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_CARD_SINGLE_GRID_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/utils/tableVariants";
import {
  TABLE_HEADERS,
  usePemilikKeuanganTable,
  type PemilikKeuanganTableProps,
} from "./usePemilikKeuanganTable";

interface Emits {
  (e: "update:currentPage", value: number): void;
}

const props = defineProps<PemilikKeuanganTableProps>();
const emit = defineEmits<Emits>();

const {
  totalPages,
  from,
  to,
  paginatedPemesanan,
  handlePageChange,
  getPemesananDate,
  getPemesananPlateNumber,
  getPemesananStatus,
  getPemesananTotal,
} = usePemilikKeuanganTable(props, emit);
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
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      :header-cell-class="TABLE_COMFORTABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <template #mobile>
        <div
          v-for="pemesanan in paginatedPemesanan"
          :key="`mobile-${pemesanan.id}`"
          :class="TABLE_MOBILE_CARD_CLASS"
        >
          <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
            <div>
              <p :class="META_LABEL_CLASS">
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

          <div :class="TABLE_MOBILE_CARD_SINGLE_GRID_CLASS">
            <div>
              <p :class="META_LABEL_CLASS">
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ formatNama(pemesanan.pengguna?.nama || "-") }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Tanggal
              </p>
              <p class="font-medium text-gray-900">
                {{ formatDateShort(getPemesananDate(pemesanan)) }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Plat Nomor
              </p>
              <p class="font-medium text-gray-900">
                {{ getPemesananPlateNumber(pemesanan) }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
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
              <p :class="META_LABEL_CLASS">
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
