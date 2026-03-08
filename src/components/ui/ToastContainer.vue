<script setup lang="ts">
import ToastNotification from "./ToastNotification.vue";
import { useToast } from "@/utils/useToast";

const { toasts, removeToast } = useToast();
</script>

<template>
  <div
    class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
  >
    <ToastNotification
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @remove="removeToast"
      class="pointer-events-auto"
    />
  </div>
</template>
