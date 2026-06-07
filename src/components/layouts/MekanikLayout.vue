<script setup lang="ts">
// Layout dasar yang dipakai untuk semua halaman setelah login.
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout/BaseAuthenticatedLayout.vue";


</script>

<template>
  <!-- Konfigurasi layout untuk role mekanik. -->
  <BaseAuthenticatedLayout
    beranda-path="/mekanik/dasbor"
    role-label="Mekanik"
    app-subtitle="Panel Mekanik"

    desktop-breakpoint="lg"
    root-class="min-h-screen bg-gradient-to-br from-gray-50 to-red-50"
    nav-class="bg-white shadow-lg border-b border-gray-200"
  />
</template>
