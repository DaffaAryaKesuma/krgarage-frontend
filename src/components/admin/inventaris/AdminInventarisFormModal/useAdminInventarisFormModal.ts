// Composable dan konstanta untuk form tambah/edit suku cadang.
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

// Props lengkap modal form inventaris.
export interface AdminInventarisFormModalProps {
  show: boolean;
  form: InventarisSukuCadangForm;
  selectedSukuCadang: InventarisSukuCadang | null;
  loading: boolean;
  kategoriOptions: Array<{ value: number; label: string }>;
  categoryName: string;
  categoryLoading: boolean;
}

// Event yang dikirim modal ke halaman inventaris.
export interface AdminInventarisFormModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:form", value: InventarisSukuCadangForm): void;
  (e: "update:categoryName", value: string): void;
  (e: "create-category"): void;
}

// Class kartu kecil untuk tiap kelompok field.
export const formKartuClass =
  "rounded-2xl border border-slate-200 bg-slate-50 p-4";

/** inputClass untuk AdminInventarisFormModal — dibungkus helper terpusat dari formVariants.ts */
export const inputClass = getFormInputClass();
export const textareaClass = getFormTextareaClass();
export const labelClass = FORM_LABEL_CLASS;
export const requiredMarkClass = FORM_REQUIRED_MARK_CLASS;

// Class tombol modal.
export const buttonPrimaryClass = getButtonClass("primary", "lg", "rounded-xl");

export const buttonSecondaryClass = getButtonClass("secondary", "lg", "rounded-xl");

// Composable logic modal form inventaris.
export function useAdminInventarisFormModal(
  props: AdminInventarisFormModalProps,
  emit: AdminInventarisFormModalEmit,
) {
  // Lock scroll halaman saat modal terbuka.
  scrollLock(() => props.show);

  // Update satu field form dengan cara immutable agar v-model parent reaktif.
  const updateField = <FieldKey extends keyof InventarisSukuCadangForm>(
    key: FieldKey,
    value: InventarisSukuCadangForm[FieldKey],
  ) => {
    emit("update:form", { ...props.form, [key]: value });
  };

  // Helper mengambil angka dari input event.
  const toNum = (e: Event) => Number((e.target as HTMLInputElement).value);
  // Helper mengambil string dari input event.
  const toStr = (e: Event) => (e.target as HTMLInputElement).value;

  // Helper yang dipakai template.
  return {
    updateField,
    toNum,
    toStr,
  };
}
