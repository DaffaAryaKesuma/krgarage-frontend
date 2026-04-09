<script setup lang="ts">
interface Props {
  activeTab: "active" | "history";
}

defineProps<Props>();

const emit = defineEmits<{
  "update:activeTab": [value: "active" | "history"];
  historyClick: [];
}>();
</script>

<template>
  <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
        Dasbor Mekanik
      </h1>

      <!-- Tabs -->
      <div
        class="flex space-x-1 sm:space-x-2 border-b border-red-400 overflow-x-auto"
      >
        <button
          @click="emit('update:activeTab', 'active')"
          :class="[
            'px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap text-sm sm:text-base',
            activeTab === 'active'
              ? 'border-white text-white'
              : 'border-transparent text-red-100 hover:text-white',
          ]"
        >
          Pekerjaan Aktif
        </button>
        <button
          @click="
            emit('update:activeTab', 'history');
            emit('historyClick');
          "
          :class="[
            'px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap text-sm sm:text-base',
            activeTab === 'history'
              ? 'border-white text-white'
              : 'border-transparent text-red-100 hover:text-white',
          ]"
        >
          Riwayat
        </button>
      </div>
    </div>
  </div>
</template>
