import { scrollLock } from "@/composables/scrollLock";
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

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100";

const buttonBaseClass =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const buttonPrimaryClass = `${buttonBaseClass} bg-red-600 text-white hover:bg-red-700`;

export const buttonSecondaryClass = `${buttonBaseClass} border border-slate-300 text-slate-700 hover:bg-slate-100`;

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
