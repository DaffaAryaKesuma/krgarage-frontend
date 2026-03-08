<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadge, getStatusLabel } from "@/utils/statusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  status: string;
  total_harga?: number;
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
}

interface Props {
  bookings: Booking[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});
</script>

<template>
  <section v-if="bookings.length > 0" class="bg-white p-6 rounded-xl shadow-md">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Pemesanan Mendatang</h2>
      <router-link
        to="/app/history"
        class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>
    <LoadingSpinner v-if="isLoading" message="Memuat pemesanan..." />
    <div v-else class="space-y-4">
      <div
        v-for="b in bookings"
        :key="b.id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <i class="mdi mdi-calendar-month text-3xl text-red-600"></i>
            <div>
              <p class="text-xs text-gray-500 mb-1">Kode Pemesanan</p>
              <p class="font-bold text-gray-900 text-lg">
                {{ b.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatDateShort(b.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <span
            :class="[
              'px-3 py-1 text-xs font-semibold rounded-full',
              getStatusBadge(b.status || 'Pending'),
            ]"
          >
            {{ getStatusLabel(b.status || "Pending") }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex items-start gap-2">
            <i class="mdi mdi-motorbike text-xl text-gray-600"></i>
            <div>
              <p class="text-xs text-gray-500">Vespa</p>
              <p class="font-semibold text-gray-900">
                {{ b.vespa?.model || "N/A" }}
              </p>
              <p class="text-xs text-gray-600">
                {{ b.vespa?.plat_nomor || "N/A" }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <i class="mdi mdi-wrench text-xl text-gray-600"></i>
            <div>
              <p class="text-xs text-gray-500">Layanan</p>
              <p class="font-semibold text-gray-900 text-sm">
                {{ b.layanan.map((s) => s.nama_layanan).join(", ") }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200"
        >
          <div>
            <p class="text-xs text-gray-500">Total Biaya</p>
            <p class="text-xl font-bold text-red-600">
              {{
                toIDR(
                  b.total_harga ||
                    b.layanan.reduce((sum, s) => sum + s.harga, 0),
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
