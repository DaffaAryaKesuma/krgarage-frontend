<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import TableShell from "@/components/ui/TableShell.vue";
import type { OwnerRecentBookingActivity } from "@/types/booking";

interface Props {
  bookings: OwnerRecentBookingActivity[];
  loading: boolean;
}

defineProps<Props>();

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Total",
  "Status",
];
</script>

<template>
  <div class="rounded-2xl bg-white p-6 shadow-lg mb-8">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">
        Aktivitas Terbaru Hari Ini
      </h2>
      <router-link
        to="/pemilik/laporan-keuangan"
        class="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right"></i>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <!-- Bookings Table -->
    <TableShell
      v-else-if="bookings.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="lg"
      mobile-cards-class="space-y-4 p-4"
      table-class="w-full"
      header-row-class="border-b text-left text-sm text-gray-600"
      header-cell-class="pb-3 font-semibold"
      body-class="divide-y"
    >
      <template #mobile>
        <div
          v-for="booking in bookings"
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
            <span :class="getStatusBadgeClass(booking.status)">
              {{ getStatusLabel(booking.status) }}
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
                {{ formatDateShort(booking.tanggal_pemesanan) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ booking.nama_pelanggan }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Layanan
              </p>
              <p class="font-medium text-gray-900">
                {{ booking.nama_layanan }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Total
              </p>
              <p class="font-semibold text-gray-900">
                {{ toIDR(booking.total_harga) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="booking in bookings"
        :key="booking.id"
        class="text-sm hover:bg-gray-50"
      >
        <td class="py-4 font-semibold text-gray-900">
          {{ booking.kode_pemesanan }}
        </td>
        <td class="py-4 text-gray-700">
          {{ formatDateShort(booking.tanggal_pemesanan) }}
        </td>
        <td class="py-4 text-gray-900">
          {{ booking.nama_pelanggan }}
        </td>
        <td class="py-4 text-gray-700">{{ booking.nama_layanan }}</td>
        <td class="py-4 font-semibold text-gray-900">
          {{ toIDR(booking.total_harga) }}
        </td>
        <td class="py-4">
          <span :class="getStatusBadgeClass(booking.status)">
            {{ getStatusLabel(booking.status) }}
          </span>
        </td>
      </tr>
    </TableShell>

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <i class="mdi mdi-calendar-blank text-6xl text-gray-300"></i>
      <p class="mt-4 text-gray-600">Belum ada pemesanan hari ini</p>
    </div>
  </div>
</template>
