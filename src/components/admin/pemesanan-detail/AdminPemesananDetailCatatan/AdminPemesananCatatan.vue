<script setup lang="ts">
// Props catatan bisa kosong, karena tidak semua pemesanan punya catatan.
interface Props {
  catatanPelanggan?: string;
  catatanMekanik?: string;
}

defineProps<Props>();
</script>

<template>
  <!-- Grid dua catatan: dari pelanggan dan dari mekanik. -->
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <!-- Catatan pelanggan saat membuat pemesanan. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Pelanggan</h2>
      </div>
      <p class="text-sm text-gray-700 whitespace-pre-line">
        {{ catatanPelanggan || "Tidak ada catatan pelanggan." }}
      </p>
    </div>

    <!-- Catatan mekanik setelah pekerjaan selesai. -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-gray-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Mekanik</h2>
      </div>
      <p class="text-sm text-gray-700 whitespace-pre-line">
        {{ catatanMekanik || "Belum ada catatan dari mekanik." }}
      </p>
    </div>
  </section>
</template>
