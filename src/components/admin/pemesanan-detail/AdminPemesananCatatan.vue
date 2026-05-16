<script setup lang="ts">
interface Props {
  catatan?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    v-if="catatan"
    class="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3"
  >
    <i class="mdi mdi-message-text text-xl text-amber-600 flex-shrink-0"></i>
    <div>
      <p class="font-medium text-amber-900 mb-1">Catatan Pelanggan:</p>
      <p class="text-amber-800 italic">"{{ catatan }}"</p>
    </div>
  </div>
</template>
