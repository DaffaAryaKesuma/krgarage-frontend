<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSolidToneClass } from "@/utils/badgeVariants";
import type { SolidToneKey } from "@/utils/badgeVariants";

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

const typeToneMap: Record<Toast["type"], SolidToneKey> = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "info",
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
      getSolidToneClass(typeToneMap[toast.type]),
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
    ]"
  >
    <div class="text-2xl font-bold">
      {{ typeIcons[toast.type] }}
    </div>
    <div class="flex-1 font-medium">
      {{ toast.message }}
    </div>
  </div>
</template>
