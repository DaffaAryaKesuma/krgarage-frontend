<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  usePemilikAuditAktivitasFilters,
  type PemilikAuditAktivitasFiltersEmit,
  type PemilikAuditAktivitasFiltersProps,
} from "./usePemilikAuditAktivitasFilters";
import { AUDIT_ACTOR_OPTIONS, AUDIT_MODULE_OPTIONS } from "@/types/inventaris";

const props = defineProps<PemilikAuditAktivitasFiltersProps>();
const emit = defineEmits<PemilikAuditAktivitasFiltersEmit>();

const {
  monthOptions,
  formattedYearOptions,
  updateMonth,
  updateYear,
  updateModul,
  updateRole,
} = usePemilikAuditAktivitasFilters(props, emit);
</script>

<template>
  <div class="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <CustomSelect
        :model-value="selectedRole"
        :options="AUDIT_ACTOR_OPTIONS"
        @update:model-value="updateRole"
      />
      <CustomSelect
        :model-value="selectedModul"
        :options="AUDIT_MODULE_OPTIONS"
        @update:model-value="updateModul"
      />
      <CustomSelect
        :model-value="selectedMonth"
        :options="monthOptions"
        @update:model-value="updateMonth"
      />
      <CustomSelect
        :model-value="selectedYear"
        :options="formattedYearOptions"
        @update:model-value="updateYear"
      />
    </div>
  </div>
</template>
