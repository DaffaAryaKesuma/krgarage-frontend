<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadge, getStatusLabel } from "@/utils/statusBadge";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  pengguna?: { nama: string };
  vespa?: { plat_nomor: string };
  total_harga: number;
  status: string;
}

interface Props {
  bookings: Booking[];
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

const paginatedBookings = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.bookings.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page);
  }
};

const getPageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

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
        <span class="font-semibold text-gray-900">{{
          (currentPage - 1) * itemsPerPage + 1
        }}</span>
        -
        <span class="font-semibold text-gray-900">{{
          Math.min(currentPage * itemsPerPage, bookings.length)
        }}</span>
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

    <div
      v-else-if="bookings.length > 0"
      class="overflow-x-auto rounded-lg border border-gray-200"
    >
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr
            class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            <th v-for="header in TABLE_HEADERS" :key="header" class="px-6 py-4">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="booking in paginatedBookings"
            :key="booking.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ booking.kode_pemesanan }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ formatDateShort(booking.tanggal_pemesanan) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ booking.pengguna?.nama }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ booking.vespa?.plat_nomor }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ toIDR(booking.total_harga) }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  getStatusBadge(booking.status),
                ]"
              >
                {{ getStatusLabel(booking.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg"
      >
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
        <div
          class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Halaman
              <span class="font-medium">{{ currentPage }}</span> dari
              <span class="font-medium">{{ totalPages }}</span>
            </p>
          </div>
          <div>
            <nav
              class="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Sebelumnya</span>
                <i class="mdi mdi-chevron-left text-xl"></i>
              </button>

              <button
                v-if="getPageNumbers[0] > 1"
                @click="goToPage(1)"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
              >
                1
              </button>

              <span
                v-if="getPageNumbers[0] > 2"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                ...
              </span>

              <button
                v-for="page in getPageNumbers"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20',
                  page === currentPage
                    ? 'z-10 bg-red-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                    : 'text-gray-900 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>

              <span
                v-if="
                  getPageNumbers[getPageNumbers.length - 1] < totalPages - 1
                "
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                ...
              </span>

              <button
                v-if="getPageNumbers[getPageNumbers.length - 1] < totalPages"
                @click="goToPage(totalPages)"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
              >
                {{ totalPages }}
              </button>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Selanjutnya</span>
                <i class="mdi mdi-chevron-right text-xl"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

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
