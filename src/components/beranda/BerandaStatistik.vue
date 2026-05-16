<script setup lang="ts">
import { onMounted, ref } from "vue";

type StatistikConfigItem = {
  target: number;
  label: string;
  suffix: string;
};

type StatistikAnimatedItem = StatistikConfigItem & {
  value: number;
};

const STATISTIK_CONFIG: StatistikConfigItem[] = [
  { target: 10, label: "Tahun Pengalaman", suffix: "+" },
  { target: 5, label: "Penghargaan Balap", suffix: "+" },
  { target: 500, label: "Pelanggan Terlayani", suffix: "+" },
  { target: 100, label: "Spesialis Vespa", suffix: "%" },
];

const statistik = ref<StatistikAnimatedItem[]>(
  STATISTIK_CONFIG.map((s) => ({ ...s, value: 0 })),
);
const sectionRef = ref<HTMLElement | null>(null);

const animateStatistik = () => {
  statistik.value.forEach((stat: StatistikAnimatedItem) => {
    const duration = 2000;
    const increment = stat.target / (duration / 16);
    const timer = setInterval(() => {
      if (stat.value < stat.target) {
        stat.value = Math.min(stat.value + increment, stat.target);
      } else {
        stat.value = stat.target;
        clearInterval(timer);
      }
    }, 16);
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStatistik();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 },
  );

  if (sectionRef.value) observer.observe(sectionRef.value);
});
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
