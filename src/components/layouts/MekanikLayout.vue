<script setup lang="ts">
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout.vue";
</script>

<template>
  <BaseAuthenticatedLayout
    home-path="/mekanik/dasbor"
    role-label="Mekanik"
    app-subtitle="Panel Mekanik"
    :nav-items="[]"
    desktop-breakpoint="lg"
    root-class="min-h-screen bg-gradient-to-br from-gray-50 to-red-50"
    nav-class="bg-white shadow-lg border-b border-gray-200"
  />
</template>
