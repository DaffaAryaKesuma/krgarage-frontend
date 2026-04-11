<script setup lang="ts">
// No props needed - just navigation links
</script>

<template>
  <section class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4">
    <router-link
      to="/app/pemesanan"
      class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-700 p-3 text-white transition-all duration-300 hover:shadow-2xl sm:p-4 md:p-6"
    >
      <div
        class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i
          class="mdi mdi-calendar-clock mb-1 text-2xl sm:mb-2 sm:text-4xl md:mb-3 md:text-5xl"
        ></i>
        <h3
          class="mb-1 text-base leading-tight font-bold sm:mb-2 sm:text-lg md:text-xl"
        >
          Pemesanan Servis Baru
        </h3>
        <p class="line-clamp-2 text-[11px] text-red-100 sm:text-xs md:text-sm">
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
      to="/app/vespa-saya"
      class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 p-3 text-white transition-all duration-300 hover:shadow-2xl sm:p-4 md:p-6"
    >
      <div
        class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i
          class="mdi mdi-motorbike mb-1 text-2xl sm:mb-2 sm:text-4xl md:mb-3 md:text-5xl"
        ></i>
        <h3
          class="mb-1 text-base leading-tight font-bold sm:mb-2 sm:text-lg md:text-xl"
        >
          Kelola Vespa
        </h3>
        <p class="line-clamp-2 text-[11px] text-gray-300 sm:text-xs md:text-sm">
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
