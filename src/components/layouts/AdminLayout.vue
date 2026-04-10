<script setup lang="ts">
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout.vue";

const menuItems = [
  { label: "Dasbor", to: "/admin/dasbor", icon: "mdi-view-dashboard" },
  { label: "Pemesanan", to: "/admin/pemesanan", icon: "mdi-clipboard-list" },
  { label: "Layanan", to: "/admin/layanan", icon: "mdi-wrench" },
  { label: "Inventaris", to: "/admin/inventaris", icon: "mdi-package-variant" },
  { label: "Laporan", to: "/admin/laporan-keuangan", icon: "mdi-chart-line" },
];
</script>

<template>
  <BaseAuthenticatedLayout
    home-path="/admin/dasbor"
    role-label="Admin"
    app-subtitle="Panel Admin"
    :nav-items="menuItems"
    desktop-breakpoint="lg"
  />
</template>
