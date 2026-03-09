<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadge, getStatusLabel } from "@/utils/statusBadge";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  nama_pelanggan: string;
  nama_layanan: string;
  total_harga: number;
  status: string;
}

interface Props {
  bookings: Booking[];
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
        to="/owner/financial"
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
    <div v-else-if="bookings.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b text-left text-sm text-gray-600">
            <th
              v-for="header in TABLE_HEADERS"
              :key="header"
              class="pb-3 font-semibold"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
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
    </div>

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <i class="mdi mdi-calendar-blank text-6xl text-gray-300"></i>
      <p class="mt-4 text-gray-600">Belum ada pemesanan hari ini</p>
    </div>
  </div>
</template>
