<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";
import TableShell from "@/components/ui/TableShell.vue";
import Pagination from "@/components/ui/Pagination.vue";
import type {
  FinancialBooking,
  FinancialBookingService,
} from "@/types/booking";

interface Props {
  bookings: FinancialBooking[];
}

const props = defineProps<Props>();

const ITEMS_PER_PAGE = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.bookings.length / ITEMS_PER_PAGE),
);

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return props.bookings.slice(start, end);
});

const from = computed(() => {
  if (props.bookings.length === 0) return 0;
  return (currentPage.value - 1) * ITEMS_PER_PAGE + 1;
});

const to = computed(() => {
  if (props.bookings.length === 0) return 0;
  return Math.min(currentPage.value * ITEMS_PER_PAGE, props.bookings.length);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

watch(
  () => props.bookings.length,
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

const calculateServiceTotal = (layanan: FinancialBookingService[]) =>
  layanan.reduce((sum, s) => sum + (s.pivot.harga_saat_pesan || 0), 0);

const getBookingServices = (layanan: FinancialBookingService[]) =>
  layanan.map((s) => s.nama_layanan).join(", ");

const getBookingItems = (items?: FinancialBooking["item_pemesanan"]) =>
  !items?.length
    ? "-"
    : items
        .map((item) => `${item.suku_cadang.nama_suku_cadang} (x${item.jumlah})`)
        .join(", ");

const getBookingTotal = (booking: FinancialBooking) =>
  booking.total_harga || calculateServiceTotal(booking.layanan);

const TABLE_WRAPPER_CLASS =
  "mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "min-w-full divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_CARDS_CLASS = "space-y-4 bg-gray-50 p-4";

const TABLE_ROW_CLASS = "transition-colors hover:bg-gray-50/80";
</script>

<template>
  <div :class="TABLE_WRAPPER_CLASS">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
    </div>
    <TableShell
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="lg"
      :mobile-cards-class="TABLE_MOBILE_CARDS_CLASS"
      :table-class="TABLE_CLASS"
      head-class="bg-gray-50"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
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
            <div class="text-right">
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Tanggal
              </p>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDateShort(booking.updated_at) }}
              </p>
            </div>
          </div>

          <div class="mt-3 space-y-2 text-sm">
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ booking.pengguna.nama }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Layanan
              </p>
              <p class="text-gray-900">
                {{ getBookingServices(booking.layanan) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Suku Cadang
              </p>
              <p
                :class="
                  booking.item_pemesanan?.length
                    ? 'text-gray-900'
                    : 'text-gray-400 italic'
                "
              >
                {{ getBookingItems(booking.item_pemesanan) }}
              </p>
            </div>
            <div class="pt-2 border-t border-gray-100">
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Total
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
        :class="TABLE_ROW_CLASS"
      >
        <td class="px-4 py-4 text-sm font-semibold text-gray-900 sm:px-6">
          {{ booking.kode_pemesanan }}
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
          {{ formatDateShort(booking.updated_at) }}
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
          {{ booking.pengguna.nama }}
        </td>
        <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
          <span
            class="block max-w-[240px] truncate"
            :title="getBookingServices(booking.layanan)"
          >
            {{ getBookingServices(booking.layanan) }}
          </span>
        </td>
        <td class="px-4 py-4 text-sm text-gray-700 sm:px-6">
          <span
            :class="[
              'block max-w-[260px] truncate',
              booking.item_pemesanan?.length ? '' : 'text-gray-400 italic',
            ]"
            :title="getBookingItems(booking.item_pemesanan)"
          >
            {{ getBookingItems(booking.item_pemesanan) }}
          </span>
        </td>
        <td
          class="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900 sm:px-6"
        >
          {{ toIDR(getBookingTotal(booking)) }}
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
  </div>
</template>
