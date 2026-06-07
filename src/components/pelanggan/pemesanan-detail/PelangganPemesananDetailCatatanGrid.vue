<script setup lang="ts">
// Tipe detail pemesanan berisi catatan pelanggan dan mekanik.
import type { Pemesanan } from "@/types/pemesanan";

// Props menerima satu detail pemesanan.
defineProps<{
  pemesanan: Pemesanan;
}>();
</script>

<template>
  <!-- Dua kartu catatan ditampilkan berdampingan di layar besar. -->
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <!-- Catatan yang ditulis pelanggan saat membuat pemesanan. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Pelanggan</h2>
      </div>
      <p class="whitespace-pre-line text-sm text-gray-700">
        {{ pemesanan.catatan_pelanggan || "Tidak ada catatan pelanggan." }}
      </p>
    </div>

    <!-- Catatan hasil pemeriksaan atau pekerjaan dari mekanik. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Mekanik</h2>
      </div>
      <p class="whitespace-pre-line text-sm text-gray-700">
        {{ pemesanan.catatan_mekanik || "Belum ada catatan dari mekanik." }}
      </p>
    </div>
  </section>
</template>
