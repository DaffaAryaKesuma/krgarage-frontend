<script setup lang="ts">
// Composable menyediakan data statistik dan ref section untuk animasi.
import { useBerandaStatistik } from "@/components/beranda/BerandaStatistik/useBerandaStatistik";

// statistik berisi angka animasi, sectionRef dipasang ke section.
const { statistik, sectionRef } = useBerandaStatistik();
</script>

<template>
  <!-- Section statistik publik. -->
  <section ref="sectionRef" id="statistik-section" class="bg-white py-12 md:py-16">
    <div class="mx-auto max-w-7xl px-4 md:px-8">
      <!-- Grid angka statistik. -->
      <div class="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
        <div v-for="(stat, i) in statistik" :key="i" class="text-center">
          <!-- Angka dibulatkan karena value bergerak dalam pecahan saat animasi. -->
          <div class="text-3xl md:text-5xl font-bold text-red-700 mb-2">
            {{ Math.round(stat.value) }}{{ stat.suffix }}
          </div>
          <div class="text-sm md:text-base text-gray-600 font-medium">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
