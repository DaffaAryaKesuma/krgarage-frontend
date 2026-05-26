import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";
import type {
  InventarisSukuCadang,
  InventarisSukuCadangForm,
} from "@/types/inventaris";

export interface AdminInventarisFormModalProps {
  show: boolean;
  form: InventarisSukuCadangForm;
  selectedSukuCadang: InventarisSukuCadang | null;
  loading: boolean;
  kategoriOptions: Array<{ value: number; label: string }>;
  categoryName: string;
  categoryLoading: boolean;
}

export interface AdminInventarisFormModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:form", value: InventarisSukuCadangForm): void;
  (e: "update:categoryName", value: string): void;
  (e: "create-category"): void;
}

export const formKartuClass =
  "rounded-2xl border border-slate-200 bg-slate-50 p-4";

/** inputClass untuk AdminInventarisFormModal — dibungkus helper terpusat dari formVariants.ts */
export const inputClass = getFormInputClass();
export const textareaClass = getFormTextareaClass();
export const labelClass = FORM_LABEL_CLASS;
export const requiredMarkClass = FORM_REQUIRED_MARK_CLASS;

export const buttonPrimaryClass = getButtonClass("primary", "lg", "rounded-xl");

export const buttonSecondaryClass = getButtonClass("secondary", "lg", "rounded-xl");

export function useAdminInventarisFormModal(
  props: AdminInventarisFormModalProps,
  emit: AdminInventarisFormModalEmit,
) {
  scrollLock(() => props.show);

  const updateField = <FieldKey extends keyof InventarisSukuCadangForm>(
    key: FieldKey,
    value: InventarisSukuCadangForm[FieldKey],
  ) => {
    emit("update:form", { ...props.form, [key]: value });
  };

  const toNum = (e: Event) => Number((e.target as HTMLInputElement).value);
  const toStr = (e: Event) => (e.target as HTMLInputElement).value;

  return {
    updateField,
    toNum,
    toStr,
  };
}
