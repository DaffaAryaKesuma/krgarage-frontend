<script setup lang="ts">
import { onMounted } from "vue";
import ToastContainer from "@/components/ui/ToastContainer.vue";
import { useToast } from "@/utils/useToast";

const toast = useToast();

// Expose toast function globally untuk axios interceptor
onMounted(() => {
  (window as any).__krg_showToast = (message: string) => {
    toast.error(message);
  };
});
</script>

<template>
  <router-view />
  <ToastContainer />
</template>

<style>
@import "./main.css";
</style>
