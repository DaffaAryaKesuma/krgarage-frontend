<script setup lang="ts">
// No props needed - just navigation links
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    <router-link
      to="/app/bookings"
      class="group relative overflow-hidden p-4 sm:p-6 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105"
    >
      <div
        class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i class="mdi mdi-calendar-clock text-3xl sm:text-5xl mb-2 sm:mb-3"></i>
        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
          Pemesanan Servis Baru
        </h3>
        <p class="text-red-100 text-xs sm:text-sm">
          Buat janji temu servis untuk Vespa Anda
        </p>
      </div>
      <div
        class="absolute bottom-2 right-3 sm:right-4 text-white opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <i class="mdi mdi-arrow-right text-2xl"></i>
      </div>
    </router-link>
    <router-link
      to="/app/my-vespas"
      class="group relative overflow-hidden p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105"
    >
      <div
        class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i class="mdi mdi-motorbike text-3xl sm:text-5xl mb-2 sm:mb-3"></i>
        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Kelola Vespa</h3>
        <p class="text-gray-300 text-xs sm:text-sm">
          Daftarkan dan kelola Vespa Anda
        </p>
      </div>
      <div
        class="absolute bottom-2 right-3 sm:right-4 text-white opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <i class="mdi mdi-arrow-right text-2xl"></i>
      </div>
    </router-link>
  </section>
</template>
