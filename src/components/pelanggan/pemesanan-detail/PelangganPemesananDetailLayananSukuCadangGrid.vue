<script setup lang="ts">
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper mengubah nilai uang dari API menjadi number.
import { toMoneyNumber } from "@/utils/money";
// Tipe detail pemesanan.
import type { Pemesanan } from "@/types/pemesanan";

// Props menerima data pemesanan lengkap.
defineProps<{
  pemesanan: Pemesanan;
}>();

// Harga layanan memakai snapshot pivot saat pemesanan, fallback ke harga master layanan.
const getLayananPrice = (layanan: Pemesanan["layanan"][number]) =>
  toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0);
</script>

<template>
  <!-- Grid rincian layanan dan suku cadang. -->
  <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <!-- Rincian layanan yang dipesan. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="mdi mdi-wrench text-xl text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Rincian Layanan</h2>
      </div>

      <div class="space-y-2">
        <!-- Nama layanan memakai snapshot agar tetap konsisten meski master layanan berubah. -->
        <div
          v-for="layanan in pemesanan.layanan"
          :key="layanan.id"
          class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
        >
          <span class="text-sm font-medium text-gray-800">
            {{
              layanan.pivot?.nama_layanan_saat_ini ||
              layanan.nama_layanan ||
              "Layanan Dihapus"
            }}
          </span>
          <span class="text-sm font-semibold text-gray-900">
            {{ toIDR(getLayananPrice(layanan)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Rincian suku cadang yang dipakai mekanik. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="mdi mdi-cog text-xl text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Rincian Suku Cadang</h2>
      </div>

      <div v-if="pemesanan.item_pemesanan?.length" class="space-y-2">
        <!-- Nama dan harga suku cadang memakai snapshot saat dipakai. -->
        <div
          v-for="item in pemesanan.item_pemesanan"
          :key="item.id"
          class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
        >
          <span class="text-sm font-semibold text-gray-900">
            {{
              item.nama_suku_cadang_saat_ini ||
              item.suku_cadang?.nama_suku_cadang ||
              "Suku Cadang Tidak Ditemukan"
            }}
            <span class="text-xs text-gray-500">(x{{ item.jumlah }})</span>
          </span>
          <span class="text-sm font-semibold text-gray-900">
            {{ toIDR(item.harga_saat_ini * item.jumlah) }}
          </span>
        </div>
      </div>
      <!-- Jika belum ada suku cadang, tampilkan keterangan sederhana. -->
      <p v-else class="text-sm text-gray-500">
        Belum ada suku cadang yang digunakan untuk pemesanan ini.
      </p>
    </div>
  </section>
</template>
