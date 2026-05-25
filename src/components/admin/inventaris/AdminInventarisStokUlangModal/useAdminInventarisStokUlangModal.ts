import { computed } from "vue";
import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import type { InventarisSukuCadang } from "@/types/inventaris";

export interface AdminInventarisStokUlangModalProps {
  show: boolean;
  selectedSukuCadang: InventarisSukuCadang | null;
  restockQuantity: number;
  restockUnitPrice: number;
  restockUpdateMasterPrice: boolean;
  restockNote: string;
  loading: boolean;
}

export interface AdminInventarisStokUlangModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:restockQuantity", value: number): void;
  (e: "update:restockUnitPrice", value: number): void;
  (e: "update:restockUpdateMasterPrice", value: boolean): void;
  (e: "update:restockNote", value: string): void;
}

export const modalKartuClass =
  "rounded-2xl border border-gray-200 bg-gray-50 p-4";

export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 ";

export const buttonPrimaryClass = getButtonClass("success", "lg", "rounded-xl");

export const buttonSecondaryClass = getButtonClass("secondary", "lg", "rounded-xl");

export function useAdminInventarisStokUlangModal(
  props: AdminInventarisStokUlangModalProps,
) {
  scrollLock(() => props.show);

  const totalPengeluaran = computed(
    () => props.restockQuantity * props.restockUnitPrice,
  );

  return {
    totalPengeluaran,
  };
}
