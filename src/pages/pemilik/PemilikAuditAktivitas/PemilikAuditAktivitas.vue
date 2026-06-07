<script setup lang="ts">
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import PemilikAuditAktivitasFilters from "@/components/pemilik/audit-aktivitas/PemilikAuditAktivitasFilters/PemilikAuditAktivitasFilters.vue";
import PemilikAuditAktivitasTable from "@/components/pemilik/audit-aktivitas/PemilikAuditAktivitasTable/PemilikAuditAktivitasTable.vue";
import { usePemilikAuditAktivitasPage } from "./usePemilikAuditAktivitasPage";

const {
  YEAR_OPTIONS,
  selectedMonth,
  selectedYear,
  selectedModul,
  selectedRole,
  logs,
  loading,
  auditCurrentPage,
  auditItemsPerPage,
} = usePemilikAuditAktivitasPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Audit Aktivitas"
      icon="mdi-clipboard-text-clock"
      subtitle="Pantau aktivitas penting bengkel"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <PemilikAuditAktivitasFilters
        v-model:selected-month="selectedMonth"
        v-model:selected-year="selectedYear"
        v-model:selected-modul="selectedModul"
        v-model:selected-role="selectedRole"
        :year-options="YEAR_OPTIONS"
      />

      <PemilikAuditAktivitasTable
        v-model:current-page="auditCurrentPage"
        :logs="logs"
        :loading="loading"
        :items-per-page="auditItemsPerPage"
        title="Log Aktivitas Sistem"
        empty-message="Belum ada aktivitas pada periode, aktor, dan modul yang dipilih."
      />
    </div>
  </div>
</template>
