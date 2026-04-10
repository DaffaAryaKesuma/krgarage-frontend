<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "Memuat data...",
  },
);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="relative w-16 h-16 mb-4">
      <div
        class="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"
      ></div>
      <div
        class="absolute inset-0 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
      ></div>
    </div>
    <p class="text-gray-600 font-medium">{{ message }}</p>
  </div>
</template>
