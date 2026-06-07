import { ref, watch } from "vue";
// Lock scroll saat modal form terbuka.
import { scrollLock } from "@/composables/scrollLock";
import {
  FORM_INPUT_ICON_PREFIX_CLASS,
  FORM_INPUT_ICON_WRAPPER_CLASS,
  FORM_LABEL_CLASS,
  getFormInputClass,
} from "@/utils/formVariants";

// Bentuk data form karyawan.
export interface FormData {
  id: string | number;
  nama: string;
  email: string;
  no_telepon: string;
  password: string;
  role: string;
}

/** INPUT_CLASS untuk KaryawanFormModal — dibungkus helper terpusat dari formVariants.ts */
export const INPUT_CLASS = getFormInputClass(false, "pl-10");
export const FIELD_WRAPPER_CLASS = FORM_INPUT_ICON_WRAPPER_CLASS;
export const ICON_PREFIX_CLASS = FORM_INPUT_ICON_PREFIX_CLASS;
export const LABEL_CLASS = FORM_LABEL_CLASS;

// Event modal form karyawan.
export interface KaryawanFormModalEmit {
  (e: "close"): void;
  (e: "submit", data: FormData): void;
}

// Composable logic form tambah/edit karyawan.
export function useKaryawanFormModal(
  props: { show: boolean; isEditMode: boolean; initialData?: Partial<FormData> },
  emit: KaryawanFormModalEmit,
) {
  // Lock scroll halaman saat modal terbuka.
  scrollLock(() => props.show);

  // Nilai default form tambah karyawan.
  const defaultForm = (): FormData => ({
    id: "",
    nama: "",
    email: "",
    no_telepon: "",
    password: "",
    role: "mekanik",
  });

  // State form.
  const formData = ref<FormData>(defaultForm());

  // Set ulang form setiap modal dibuka atau initialData berubah.
  watch(
    () => [props.show, props.initialData],
    () => {
      if (props.show) {
        // Mode edit mengisi data lama, tapi password selalu dikosongkan.
        formData.value = props.initialData
          ? { ...defaultForm(), ...props.initialData, password: "" }
          : defaultForm();
      }
    },
    { immediate: true },
  );

  // Submit salinan form ke parent.
  const handleSubmit = () => emit("submit", { ...formData.value });

  // State dan handler yang dipakai template.
  return { formData, handleSubmit };
}
