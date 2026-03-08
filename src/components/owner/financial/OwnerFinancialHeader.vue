<script setup lang="ts">
// No props or emits needed - static header
</script>

<template>
  <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
        >
          <i class="mdi mdi-chart-line text-2xl sm:text-4xl"></i>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">Laporan Keuangan</h1>
          <p class="text-sm sm:text-base text-red-100">
            Ini adalah ringkasan performa keuangan bengkel
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
