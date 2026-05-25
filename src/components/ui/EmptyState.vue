<script setup lang="ts">
import { getButtonClass } from "@/utils/buttonVariants";

interface Props {
  icon: string;
  title: string;
  message: string;
  aksiText?: string;
  aksiLink?: string;
  aksiIcon?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "aksi"): void;
}>();

const BUTTON_CLASS = getButtonClass(
  "primary",
  "lg",
  "shadow-lg hover:shadow-xl hover:scale-105",
);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <!-- Icon -->
    <div class="mb-6 opacity-50">
      <i :class="icon + ' text-8xl'"></i>
    </div>

    <!-- Title -->
    <h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">{{ title }}</h3>

    <!-- Message -->
    <p class="text-gray-600 text-center max-w-md mb-8">{{ message }}</p>

    <!-- Aksi Button -->
    <router-link
      v-if="aksiLink && aksiText"
      :to="aksiLink"
      :class="BUTTON_CLASS"
    >
      {{ aksiText }}<i v-if="aksiIcon" :class="aksiIcon + ' ml-1'"></i>
    </router-link>
    <button
      v-else-if="aksiText"
      @click="emit('aksi')"
      :class="BUTTON_CLASS"
    >
      {{ aksiText }}<i v-if="aksiIcon" :class="aksiIcon + ' ml-1'"></i>
    </button>
  </div>
</template>
