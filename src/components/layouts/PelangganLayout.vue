<script setup lang="ts">
import BaseAuthenticatedLayout from "@/components/layouts/BaseAuthenticatedLayout/BaseAuthenticatedLayout.vue";

const navItems = [
  { label: "Dasbor", to: "/app/dasbor", icon: "mdi-view-dashboard" },
  { label: "Vespa Saya", to: "/app/vespa-saya", icon: "mdi-motorbike" },
  { label: "Pemesanan", to: "/app/pemesanan", icon: "mdi-calendar-plus" },
  { label: "Riwayat", to: "/app/riwayat", icon: "mdi-history" },
];
</script>

<template>
  <BaseAuthenticatedLayout
    beranda-path="/app/dasbor"
    role-label="Pelanggan"
    app-subtitle="Manajemen Servis"
    :nav-items="navItems"
    desktop-breakpoint="lg"
  />
</template>
