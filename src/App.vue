<script setup lang="ts">
// onMounted dipakai untuk menjalankan kode setelah App.vue siap di browser.
import { onMounted } from "vue";
// Container toast global untuk menampilkan notifikasi.
import ToastContainer from "@/components/ui/ToastContainer.vue";
// Composable toast untuk memanggil toast.error/success.
import { useToast } from "@/utils/useToast";

// Ambil instance toast.
const toast = useToast();

// Expose toast function globally untuk axios interceptor.
onMounted(() => {
  // Axios interceptor berada di luar komponen, jadi dibuatkan fungsi global sederhana.
  (window as any).__krg_showToast = (message: string) => {
    toast.error(message);
  };
});
</script>

<template>
  <!-- router-view adalah tempat halaman aktif dirender oleh Vue Router. -->
  <router-view />
  <!-- ToastContainer selalu tersedia di seluruh halaman. -->
  <ToastContainer />
</template>

<style>
/* Import CSS global dari root aplikasi. */
@import "./main.css";
</style>
