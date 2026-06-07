<script setup lang="ts">
// Layout dasar yang dipakai untuk semua halaman setelah login.
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout/BaseAuthenticatedLayout.vue";

// Menu khusus admin.
const menuItems = [
  { label: "Dasbor", to: "/admin/dasbor", icon: "mdi-view-dashboard" },
  { label: "Pemesanan", to: "/admin/pemesanan", icon: "mdi-clipboard-list" },
  { label: "Layanan", to: "/admin/layanan", icon: "mdi-wrench" },
  { label: "Inventaris", to: "/admin/inventaris", icon: "mdi-package-variant" },
  { label: "Karyawan", to: "/admin/karyawan", icon: "mdi-account-group" },
  { label: "Laporan", to: "/admin/laporan-keuangan", icon: "mdi-chart-line" },
];
</script>

<template>
  <!-- Konfigurasi layout untuk role admin. -->
  <BaseAuthenticatedLayout
    beranda-path="/admin/dasbor"
    role-label="Admin"
    app-subtitle="Panel Admin"
    :nav-items="menuItems"
    desktop-breakpoint="xl"
  />
</template>
