<script setup lang="ts">
// Layout dasar yang dipakai untuk semua halaman setelah login.
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout/BaseAuthenticatedLayout.vue";

// Menu khusus pelanggan.
const navItems = [
  { label: "Dasbor", to: "/app/dasbor", icon: "mdi-view-dashboard" },
  { label: "Vespa Saya", to: "/app/vespa-saya", icon: "mdi-motorbike" },
  { label: "Pemesanan", to: "/app/pemesanan", icon: "mdi-calendar-plus" },
  { label: "Riwayat", to: "/app/riwayat", icon: "mdi-history" },
];
</script>

<template>
  <!-- Konfigurasi layout untuk role pelanggan. -->
  <BaseAuthenticatedLayout
    beranda-path="/app/dasbor"
    role-label="Pelanggan"
    app-subtitle="Manajemen Servis"
    :nav-items="navItems"
    desktop-breakpoint="lg"
  />
</template>
