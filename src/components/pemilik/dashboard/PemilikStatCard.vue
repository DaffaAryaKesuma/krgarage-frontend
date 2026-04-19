<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
  trend?: number; // percentage change
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  iconBgColor: "bg-red-100",
  iconColor: "text-red-600",
  loading: false,
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>

        <!-- Loading State -->
        <div v-if="loading" class="mt-2">
          <div class="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>

        <!-- Value -->
        <h3 v-else class="mt-2 text-2xl font-bold text-gray-900">
          {{ value }}
        </h3>

        <!-- Trend Indicator -->
        <div v-if="trend !== undefined" class="mt-2 flex items-center gap-1">
          <i
            :class="[
              'mdi',
              trend >= 0
                ? 'mdi-trending-up text-green-600'
                : 'mdi-trending-down text-red-600',
              'text-lg',
            ]"
          ></i>
          <span
            :class="[
              'text-sm font-semibold',
              trend >= 0 ? 'text-green-600' : 'text-red-600',
            ]"
          >
            {{ Math.abs(trend) }}%
          </span>
          <span class="text-xs text-gray-500">vs bulan lalu</span>
        </div>
      </div>

      <!-- Icon -->
      <div
        :class="['rounded-xl flex items-center justify-center', iconBgColor]"
        style="width: 48px; height: 48px"
      >
        <i
          :class="['mdi', icon, iconColor, 'text-2xl']"
          style="line-height: 1"
        ></i>
      </div>
    </div>

    <!-- Decorative Element -->
    <div
      class="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"
    ></div>
  </div>
</template>
