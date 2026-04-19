<script setup lang="ts">
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout.vue";

const navLinks = [
  { label: "Dasbor", to: "/pemilik/dasbor", icon: "mdi-view-dashboard" },
  {
    label: "Laporan Keuangan",
    to: "/pemilik/laporan-keuangan",
    icon: "mdi-chart-line",
  },
  {
    label: "Analisa Inventaris",
    to: "/pemilik/analisa-inventaris",
    icon: "mdi-package-variant",
  },
];
</script>

<template>
  <BaseAuthenticatedLayout
    home-path="/pemilik/dasbor"
    role-label="Pemilik"
    app-subtitle="Portal Pemilik"
    :nav-items="navLinks"
    desktop-breakpoint="lg"
  />
</template>
