<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import PemilikRecentActivityMobileCard from "@/components/pemilik/dashboard/PemilikRecentActivityMobileCard.vue";
import PemilikRecentActivityDesktopRow from "@/components/pemilik/dashboard/PemilikRecentActivityDesktopRow.vue";
import type { PemilikRecentBookingActivity } from "@/types/booking";

interface Props {
  bookings: PemilikRecentBookingActivity[];
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
        <PemilikRecentActivityMobileCard
          v-for="booking in bookings"
          :key="`mobile-${booking.id}`"
          :booking="booking"
        />
      </template>

      <PemilikRecentActivityDesktopRow
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
      />
    </TableShell>

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <i class="mdi mdi-calendar-blank text-6xl text-gray-300"></i>
      <p class="mt-4 text-gray-600">Belum ada pemesanan hari ini</p>
    </div>
  </div>
</template>
