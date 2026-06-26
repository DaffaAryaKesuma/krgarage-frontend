<script setup lang="ts">
// Layout dasar yang dipakai untuk semua halaman setelah login.
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout/BaseAuthenticatedLayout.vue";

// Menu khusus pemilik.
const navLinks = [
  { label: "Dasbor", to: "/pemilik/dasbor", icon: "mdi-view-dashboard" },
  {
    label: "Laporan Keuangan",
    to: "/pemilik/laporan-keuangan",
    icon: "mdi-chart-line",
  },
  {
    label: "Analisis Inventaris",
    to: "/pemilik/analisa-inventaris",
    icon: "mdi-package-variant",
  },
  {
    label: "Audit Aktivitas",
    to: "/pemilik/audit-aktivitas",
    icon: "mdi-clipboard-text-clock",
  },
];
</script>

<template>
  <!-- Konfigurasi layout untuk role pemilik. -->
  <BaseAuthenticatedLayout
    beranda-path="/pemilik/dasbor"
    role-label="Pemilik"
    app-subtitle="Portal Pemilik"
    :nav-items="navLinks"
    desktop-breakpoint="lg"
  />
</template>
