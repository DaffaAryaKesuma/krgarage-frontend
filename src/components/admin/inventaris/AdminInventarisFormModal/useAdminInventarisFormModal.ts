// Composable dan konstanta untuk form tambah/edit suku cadang.
import { ref, watch } from "vue";
import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
  FORM_ERROR_CLASS,
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
export const errorClass = FORM_ERROR_CLASS;

type RequiredField =
  | "nama_suku_cadang"
  | "id_kategori"
  | "jumlah_stok"
  | "harga_beli"
  | "harga_jual"
  | "batas_minimal_stok";

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
  const errors = ref<Record<RequiredField, string>>({
    nama_suku_cadang: "",
    id_kategori: "",
    jumlah_stok: "",
    harga_beli: "",
    harga_jual: "",
    batas_minimal_stok: "",
  });
  const touched = ref<Record<RequiredField, boolean>>({
    nama_suku_cadang: false,
    id_kategori: false,
    jumlah_stok: false,
    harga_beli: false,
    harga_jual: false,
    batas_minimal_stok: false,
  });

  watch(() => props.show, (show) => {
    if (!show) return;
    Object.keys(errors.value).forEach((key) => {
      errors.value[key as RequiredField] = "";
      touched.value[key as RequiredField] = false;
    });
  });

  const validateField = (
    field: RequiredField,
    nextValue: InventarisSukuCadangForm[RequiredField] = props.form[field],
  ) => {
    const value = nextValue;
    if (field === "nama_suku_cadang") {
      errors.value[field] = String(value).trim() ? "" : "Nama suku cadang wajib diisi.";
    } else if (field === "id_kategori") {
      errors.value[field] = value ? "" : "Kategori wajib dipilih.";
    } else if (value === null || value === undefined || Number.isNaN(Number(value))) {
      errors.value[field] = "Kolom ini wajib diisi.";
    } else {
      errors.value[field] = Number(value) < 0 ? "Nilai tidak boleh kurang dari 0." : "";
    }
    return !errors.value[field];
  };

  const handleBlur = (field: RequiredField) => {
    touched.value[field] = true;
    validateField(field);
  };

  const getInputClass = (field: RequiredField) =>
    getFormInputClass(touched.value[field] && Boolean(errors.value[field]));

  watch(
    () => [
      props.form.nama_suku_cadang,
      props.form.id_kategori,
      props.form.jumlah_stok,
      props.form.harga_beli,
      props.form.harga_jual,
      props.form.batas_minimal_stok,
    ],
    () => {
      (Object.keys(touched.value) as RequiredField[]).forEach((field) => {
        if (touched.value[field]) {
          validateField(field);
        }
      });
    },
  );

  const handleSubmit = () => {
    const fields = Object.keys(errors.value) as RequiredField[];
    fields.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });
    if (fields.some((field) => errors.value[field])) return;
    emit("submit");
  };

  // Update satu field form dengan cara immutable agar v-model parent reaktif.
  const updateField = <FieldKey extends keyof InventarisSukuCadangForm>(
    key: FieldKey,
    value: InventarisSukuCadangForm[FieldKey],
  ) => {
    emit("update:form", { ...props.form, [key]: value });
  };

  const updateRequiredField = <FieldKey extends RequiredField>(
    key: FieldKey,
    value: InventarisSukuCadangForm[FieldKey],
  ) => {
    updateField(key, value);
    if (touched.value[key]) {
      validateField(key, value);
    }
  };

  // Helper mengambil angka dari input event.
  const toNum = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    return value === "" ? Number.NaN : Number(value);
  };
  // Helper mengambil string dari input event.
  const toStr = (e: Event) => (e.target as HTMLInputElement).value;

  // Helper yang dipakai template.
  return {
    updateField,
    updateRequiredField,
    toNum,
    toStr,
    errors,
    touched,
    validateField,
    handleBlur,
    getInputClass,
    handleSubmit,
  };
}
