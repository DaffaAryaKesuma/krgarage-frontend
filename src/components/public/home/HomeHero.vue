<script setup lang="ts">
const FEATURE_HIGHLIGHTS = [
  { icon: "mdi-shield-check", label: "Garansi Resmi" },
];

const emit = defineEmits<{
  (e: "order"): void;
}>();
</script>

<template>
  <!-- Hero Section -->
  <main
    id="beranda"
    class="relative flex min-h-screen items-center justify-center bg-gray-900 bg-cover bg-center px-4 pt-24 pb-16 md:px-8 text-center text-white overflow-hidden"
    style="background-image: url(&quot;/src/assets/homepage.png&quot;)"
  >
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
    ></div>

    <!-- Animated BG Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <div class="relative z-10 mx-auto max-w-4xl">
      <h1
        class="text-4xl font-extrabold md:text-6xl lg:text-7xl mb-6 leading-tight"
      >
        <span class="block">Perawatan Ahli untuk</span>
        <span
          class="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
        >
          Vespa Klasik Anda
        </span>
      </h1>

      <p
        class="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
      >
        Perawatan, penyetelan, dan restorasi mesin 2-tak profesional dengan
        garansi resmi. Berikan vespa Anda perawatan yang layak.
      </p>

      <!-- Feature Highlights -->
      <div class="flex flex-wrap justify-center gap-4 mt-8 mb-10">
        <div
          v-for="feature in FEATURE_HIGHLIGHTS"
          :key="feature.label"
          class="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          <i :class="['mdi', feature.icon, 'text-red-400 text-xl']"></i>
          <span class="text-sm font-semibold">{{ feature.label }}</span>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
      >
        <button
          @click="emit('order')"
          class="group relative px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto overflow-hidden"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            Pesan Sekarang
            <i
              class="mdi mdi-arrow-right text-xl group-hover:translate-x-1 transition-transform"
            ></i>
          </span>
        </button>

        <a
          href="#layanan"
          class="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-lg hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 w-full sm:w-auto flex items-center justify-center gap-2"
        >
          Lihat Layanan
          <i class="mdi mdi-chevron-down text-xl"></i>
        </a>
      </div>
    </div>
  </main>
</template>
