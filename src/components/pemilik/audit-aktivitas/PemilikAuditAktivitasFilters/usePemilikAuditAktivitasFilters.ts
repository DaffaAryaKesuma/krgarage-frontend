import { computed } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";
import type { AuditActorRole, AuditModulKey } from "@/types/inventaris";

export interface PemilikAuditAktivitasFiltersProps {
  selectedMonth: number;
  selectedYear: number;
  selectedModul: AuditModulKey;
  selectedRole: AuditActorRole;
  yearOptions: number[];
}

export interface PemilikAuditAktivitasFiltersEmit {
  (event: "update:selectedMonth", value: number): void;
  (event: "update:selectedYear", value: number): void;
  (event: "update:selectedModul", value: AuditModulKey): void;
  (event: "update:selectedRole", value: AuditActorRole): void;
}

export function usePemilikAuditAktivitasFilters(
  props: PemilikAuditAktivitasFiltersProps,
  emit: PemilikAuditAktivitasFiltersEmit,
) {
  const monthOptions = getMonthOptions().map((month) => ({
    value: Number(month.value),
    label: month.label,
  }));

  const formattedYearOptions = computed(() =>
    props.yearOptions.map((year) => ({
      value: year,
      label: year.toString(),
    })),
  );

  const updateMonth = (value: string | number | null) => {
    if (value !== null) emit("update:selectedMonth", Number(value));
  };

  const updateYear = (value: string | number | null) => {
    if (value !== null) emit("update:selectedYear", Number(value));
  };

  const updateModul = (value: string | number | null) => {
    if (value !== null) {
      emit("update:selectedModul", String(value) as AuditModulKey);
    }
  };

  const updateRole = (value: string | number | null) => {
    if (value !== null) {
      emit("update:selectedRole", String(value) as AuditActorRole);
    }
  };

  return {
    monthOptions,
    formattedYearOptions,
    updateMonth,
    updateYear,
    updateModul,
    updateRole,
  };
}
