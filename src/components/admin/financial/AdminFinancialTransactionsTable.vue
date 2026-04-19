<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TableShell from "@/components/ui/TableShell.vue";
import Pagination from "@/components/ui/Pagination.vue";
import AdminFinancialTransactionMobileCard from "@/components/admin/financial/AdminFinancialTransactionMobileCard.vue";
import AdminFinancialTransactionDesktopRow from "@/components/admin/financial/AdminFinancialTransactionDesktopRow.vue";
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
        <AdminFinancialTransactionMobileCard
          v-for="booking in paginatedBookings"
          :key="`mobile-${booking.id}`"
          :booking="booking"
          :booking-services="getBookingServices(booking.layanan)"
          :booking-items="getBookingItems(booking.item_pemesanan)"
          :booking-total="getBookingTotal(booking)"
        />
      </template>

      <AdminFinancialTransactionDesktopRow
        v-for="booking in paginatedBookings"
        :key="booking.id"
        :booking="booking"
        :booking-services="getBookingServices(booking.layanan)"
        :booking-items="getBookingItems(booking.item_pemesanan)"
        :booking-total="getBookingTotal(booking)"
      />

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
