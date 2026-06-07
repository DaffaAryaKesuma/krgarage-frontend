<script setup lang="ts">
// Helper format tanggal pendek.
import { formatDateShort } from "@/utils/date";
// Komponen pagination, tabel responsif, dan empty state.
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper status servis.
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
// Helper status pembayaran.
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
// Helper format nama pelanggan.
import { formatNama } from "@/utils/format";
// Class label kecil.
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
// Helper class tabel.
import {
  TABLE_BODY_CLASS,
  TABLE_COMFORTABLE_HEADER_CELL_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_CARD_SINGLE_GRID_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
} from "@/utils/tableVariants";
// Header tabel dan composable pagination/helper.
import {
  TABLE_HEADERS,
  usePemilikKeuanganTable,
  type PemilikKeuanganTableProps,
} from "./usePemilikKeuanganTable";

// Event update currentPage dikirim saat pagination berubah.
interface Emits {
  (e: "update:currentPage", value: number): void;
}

// Props mengikuti interface dari composable.
const props = defineProps<PemilikKeuanganTableProps>();
const emit = defineEmits<Emits>();

// Ambil helper tabel dari composable.
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

// Lebar kolom desktop.
const TABLE_COLUMN_WIDTHS = ["16%", "17%", "13%", "13%", "15%", "13%", "13%"];
// Class cell umum.
const TABLE_CELL_CLASS = "px-6 py-4 align-middle text-sm text-gray-900";
// Class cell khusus badge agar tidak wrap.
const TABLE_BADGE_CELL_CLASS = "px-6 py-4 align-middle whitespace-nowrap";
</script>

<template>
  <!-- Kartu tabel pemasukan dari pemesanan lunas. -->
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    <!-- Header tabel. -->
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-calendar-check text-red-600"></i>
          Rincian Pemesanan
        </h2>
      </div>
    </div>

    <!-- TableShell membuat tampilan desktop table dan mobile card. -->
    <TableShell
      v-if="pemesanan.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :table-class="buildFixedTableClass('text-sm')"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      :header-cell-class="TABLE_COMFORTABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
    >
      <!-- Tampilan mobile untuk pemasukan. -->
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
              <!-- Tanggal pemasukan memakai paid_at jika tersedia. -->
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
              <!-- Total fallback dihitung dari layanan jika total_harga kosong. -->
              <p class="font-semibold text-gray-900">
                {{ toIDR(getPemesananTotal(pemesanan)) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Tampilan desktop untuk pemasukan. -->
      <tr
        v-for="pemesanan in paginatedPemesanan"
        :key="pemesanan.id"
        class="hover:bg-gray-50 transition-colors"
      >
        <td :class="TABLE_CELL_CLASS">
          {{ pemesanan.kode_pemesanan }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ formatDateShort(getPemesananDate(pemesanan)) }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ formatNama(pemesanan.pengguna?.nama || "-") }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ getPemesananPlateNumber(pemesanan) }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ toIDR(getPemesananTotal(pemesanan)) }}
        </td>
        <td :class="TABLE_BADGE_CELL_CLASS">
          <span :class="getStatusBadgeClass(getPemesananStatus(pemesanan))">
            {{ getStatusLabel(getPemesananStatus(pemesanan)) }}
          </span>
        </td>
        <td :class="TABLE_BADGE_CELL_CLASS">
          <span
            :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)"
          >
            {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
          </span>
        </td>
      </tr>

      <!-- Pagination tabel pemasukan. -->
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

    <!-- Empty state jika tidak ada pemasukan pada periode filter. -->
    <EmptyState
      v-else
      icon="mdi mdi-calendar-search"
      title="Tidak ada data ditemukan"
      :message="`Tidak ada transaksi yang selesai dari ${formatDateShort(startDate)} sampai ${formatDateShort(endDate)}.`"
      class="py-12"
    />
  </div>
</template>
