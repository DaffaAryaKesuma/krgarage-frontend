<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import type {
  FinancialBooking,
  FinancialBookingService,
} from "@/types/booking";

interface Props {
  bookings: FinancialBooking[];
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
  return Math.ceil(props.bookings.length / props.itemsPerPage);
});

const from = computed(() => {
  if (props.bookings.length === 0) return 0;
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const to = computed(() => {
  if (props.bookings.length === 0) return 0;
  return Math.min(
    props.currentPage * props.itemsPerPage,
    props.bookings.length,
  );
});

const paginatedBookings = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.bookings.slice(start, end);
});

const handlePageChange = (page: number) => {
  emit("update:currentPage", page);
};

const getBookingDate = (booking: FinancialBooking) =>
  booking.updated_at || booking.tanggal_pemesanan;

const getBookingPlateNumber = (booking: FinancialBooking) =>
  booking.vespa?.plat_nomor || "-";

const getBookingStatus = (booking: FinancialBooking) =>
  booking.status || "Completed";

const calculateServiceTotal = (layanan: FinancialBookingService[]) =>
  layanan.reduce((sum, s) => sum + (s.pivot.harga_saat_pesan || 0), 0);

const getBookingTotal = (booking: FinancialBooking) =>
  booking.total_harga || calculateServiceTotal(booking.layanan);

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Plat Nomor",
  "Total Biaya",
  "Status",
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
        <p class="text-sm text-gray-600 mt-1">
          Daftar lengkap pemesanan dalam rentang waktu terpilih
        </p>
      </div>
      <div v-if="bookings.length > 0" class="text-sm text-gray-600">
        Menampilkan
        <span class="font-semibold text-gray-900">{{ from }}</span>
        -
        <span class="font-semibold text-gray-900">{{ to }}</span>
        dari
        <span class="font-semibold text-gray-900">{{ bookings.length }}</span>
        pemesanan
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
      v-else-if="bookings.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="lg"
      mobile-cards-class="space-y-4 p-4"
      wrapper-class="rounded-lg border border-gray-200"
      table-class="w-full"
      head-class="bg-gray-50"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      header-cell-class="px-6 py-4"
      body-class="divide-y divide-gray-200 bg-white"
    >
      <template #mobile>
        <div
          v-for="booking in paginatedBookings"
          :key="`mobile-${booking.id}`"
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
                {{ booking.kode_pemesanan }}
              </p>
            </div>
            <span :class="getStatusBadgeClass(getBookingStatus(booking))">
              {{ getStatusLabel(getBookingStatus(booking)) }}
            </span>
          </div>

          <div
            class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2"
          >
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Tanggal
              </p>
              <p class="font-medium text-gray-900">
                {{ formatDateShort(getBookingDate(booking)) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ booking.pengguna?.nama || "-" }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Plat Nomor
              </p>
              <p class="font-medium text-gray-900">
                {{ getBookingPlateNumber(booking) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Total Biaya
              </p>
              <p class="font-semibold text-gray-900">
                {{ toIDR(getBookingTotal(booking)) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="booking in paginatedBookings"
        :key="booking.id"
        class="hover:bg-gray-50 transition-colors"
      >
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ booking.kode_pemesanan }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ formatDateShort(getBookingDate(booking)) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ booking.pengguna?.nama }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ getBookingPlateNumber(booking) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ toIDR(getBookingTotal(booking)) }}
        </td>
        <td class="px-6 py-4">
          <span :class="getStatusBadgeClass(getBookingStatus(booking))">
            {{ getStatusLabel(getBookingStatus(booking)) }}
          </span>
        </td>
      </tr>

      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="bookings.length"
            :from="from"
            :to="to"
            @page-change="handlePageChange"
          />
        </div>
      </template>
    </TableShell>

    <div
      v-else
      class="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
    >
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
      >
        <i class="mdi mdi-calendar-search text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900">
        Tidak ada data ditemukan
      </h3>
      <p class="mt-2 text-gray-500 max-w-sm mx-auto">
        Tidak ada transaksi yang selesai dalam rentang tanggal
        <span class="font-semibold">{{ formatDateShort(startDate) }}</span>
        sampai
        <span class="font-semibold">{{ formatDateShort(endDate) }}</span
        >.
      </p>
    </div>
  </div>
</template>
