<script setup lang="ts">
// LoadingSpinner menerima pesan opsional dari parent.
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    // Default pesan jika parent tidak mengirim message.
    message: "Memuat data...",
  },
);
</script>

<template>
  <!-- Wrapper loading di tengah. -->
  <div class="flex flex-col items-center justify-center py-12">
    <!-- Dua lingkaran: satu ping, satu spin. -->
    <div class="relative w-16 h-16 mb-4">
      <div
        class="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"
      ></div>
      <div
        class="absolute inset-0 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
      ></div>
    </div>
    <!-- Pesan loading. -->
    <p class="text-gray-600 font-medium">{{ message }}</p>
  </div>
</template>
