import { computed } from "vue";
import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  getFormCheckboxClass,
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";
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

export const inputClass = getFormInputClass(false, "rounded-xl px-4 py-3");
export const textareaClass = getFormTextareaClass(false, "rounded-xl px-4 py-3");
export const labelClass = FORM_LABEL_CLASS;
export const hintClass = FORM_HINT_CLASS;
export const checkboxClass = getFormCheckboxClass("mt-1");

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
