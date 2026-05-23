<script setup lang="ts">
import { useBerandaStatistik } from "@/components/beranda/BerandaStatistik/useBerandaStatistik";

const { statistik, sectionRef } = useBerandaStatistik();
</script>

<template>
  <!-- Statistik Section -->
  <section ref="sectionRef" id="statistik-section" class="bg-white py-12 md:py-16">
    <div class="mx-auto max-w-7xl px-4 md:px-8">
      <div class="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
        <div v-for="(stat, i) in statistik" :key="i" class="text-center">
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
