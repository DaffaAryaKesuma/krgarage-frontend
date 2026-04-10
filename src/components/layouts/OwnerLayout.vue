<script setup lang="ts">
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout.vue";

const navLinks = [
  { label: "Dasbor", to: "/owner/dasbor", icon: "mdi-view-dashboard" },
  {
    label: "Laporan Keuangan",
    to: "/owner/laporan-keuangan",
    icon: "mdi-chart-line",
  },
  {
    label: "Analisa Inventaris",
    to: "/owner/analisa-inventaris",
    icon: "mdi-package-variant",
  },
];
</script>

<template>
  <BaseAuthenticatedLayout
    home-path="/owner/dasbor"
    role-label="Pemilik"
    app-subtitle="Portal Pemilik"
    :nav-items="navLinks"
    desktop-breakpoint="lg"
  />
</template>
