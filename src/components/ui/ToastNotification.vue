<script setup lang="ts">
import { ref, onMounted } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

const props = defineProps<{
  toast: Toast;
}>();

const emit = defineEmits<{
  (e: "remove", id: number): void;
}>();

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 10);

  const duration = props.toast.duration || 3000;
  setTimeout(() => {
    handleClose();
  }, duration);
});

function handleClose() {
  isVisible.value = false;
  setTimeout(() => {
    emit("remove", props.toast.id);
  }, 300);
}

const typeClasses = {
  success: "bg-green-500 border-green-600",
  error: "bg-red-500 border-red-600",
  warning: "bg-yellow-500 border-yellow-600",
  info: "bg-blue-500 border-blue-600",
};

const typeIcons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 text-white min-w-[300px] max-w-md transition-all duration-300 transform',
      typeClasses[toast.type],
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
    ]"
  >
    <div class="text-2xl font-bold">
      {{ typeIcons[toast.type] }}
    </div>
    <div class="flex-1 font-medium">
      {{ toast.message }}
    </div>
    <button
      @click="handleClose"
      class="text-white hover:text-gray-200 transition-colors text-xl font-bold"
    >
      ×
    </button>
  </div>
</template>
