<script setup lang="ts">
// Komponen ini tidak butuh props karena hanya berisi link navigasi cepat.
</script>

<template>
  <!-- Dua aksi utama pelanggan: buat pemesanan dan kelola Vespa. -->
  <section class="grid grid-cols-2 gap-2 sm:gap-4">
    <!-- Link ke halaman pemesanan baru. -->
    <router-link
      to="/app/pemesanan"
      class="group relative overflow-hidden rounded-lg bg-gradient-to-br from-red-600 to-red-700 p-3 text-white transition-all duration-300 hover:shadow-2xl sm:rounded-xl sm:p-4 md:p-6"
    >
      <div
        class="absolute top-0 right-0 h-20 w-20 rounded-full bg-white opacity-10 -mr-10 -mt-10 sm:h-32 sm:w-32 sm:-mr-16 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i
          class="mdi mdi-calendar-clock mb-1 text-xl sm:mb-2 sm:text-4xl md:mb-3 md:text-5xl"
        ></i>
        <h3
          class="mb-1 text-sm leading-tight font-bold sm:mb-2 sm:text-lg md:text-xl"
        >
          Pemesanan Baru
        </h3>
        <p class="line-clamp-2 text-[10px] text-red-100 sm:text-xs md:text-sm">
          Buat pemesanan servis untuk vespa anda
        </p>
      </div>
      <div
        class="absolute bottom-2 right-3 text-white opacity-50 transition-opacity group-hover:opacity-100 sm:right-4"
      >
        <i class="mdi mdi-arrow-right text-xl sm:text-2xl"></i>
      </div>
    </router-link>
    <!-- Link ke halaman Vespa Saya. -->
    <router-link
      to="/app/vespa-saya"
      class="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 p-3 text-white transition-all duration-300 hover:shadow-2xl sm:rounded-xl sm:p-4 md:p-6"
    >
      <div
        class="absolute top-0 right-0 h-20 w-20 rounded-full bg-white opacity-10 -mr-10 -mt-10 sm:h-32 sm:w-32 sm:-mr-16 sm:-mt-16"
      ></div>
      <div class="relative z-10">
        <i
          class="mdi mdi-motorbike mb-1 text-xl sm:mb-2 sm:text-4xl md:mb-3 md:text-5xl"
        ></i>
        <h3
          class="mb-1 text-sm leading-tight font-bold sm:mb-2 sm:text-lg md:text-xl"
        >
          Kelola Vespa
        </h3>
        <p class="line-clamp-2 text-[10px] text-gray-300 sm:text-xs md:text-sm">
          Daftarkan dan kelola vespa anda
        </p>
      </div>
      <div
        class="absolute bottom-2 right-3 text-white opacity-50 transition-opacity group-hover:opacity-100 sm:right-4"
      >
        <i class="mdi mdi-arrow-right text-xl sm:text-2xl"></i>
      </div>
    </router-link>
  </section>
</template>
