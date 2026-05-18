<script setup lang="ts">
interface Props {
  catatanPelanggan?: string;
  catatanMekanik?: string;
}

defineProps<Props>();
</script>

<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <!-- Catatan Pelanggan -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-outline text-amber-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Pelanggan</h2>
      </div>
      <p class="text-sm text-gray-700 whitespace-pre-line">
        {{ catatanPelanggan || "Tidak ada catatan pelanggan." }}
      </p>
    </div>

    <!-- Catatan Mekanik -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <i class="mdi mdi-note-text text-green-600"></i>
        <h2 class="font-semibold text-gray-900">Catatan Mekanik</h2>
      </div>
      <p class="text-sm text-gray-700 whitespace-pre-line">
        {{ catatanMekanik || "Belum ada catatan dari mekanik." }}
      </p>
    </div>
  </section>
</template>
