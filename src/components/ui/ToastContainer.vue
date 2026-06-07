<script setup lang="ts">
// Komponen satu toast.
import ToastNotification from "./ToastNotification.vue";
// useToast mengambil state global daftar toast.
import { useToast } from "@/utils/useToast";

// Semua toast dan fungsi remove berasal dari composable global.
const { toasts, removeToast } = useToast();
</script>

<template>
  <!-- Container toast fixed di kanan atas layar. -->
  <div
    class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
  >
    <!-- Render semua toast aktif. -->
    <ToastNotification
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @remove="removeToast"
      class="pointer-events-auto"
    />
  </div>
</template>
