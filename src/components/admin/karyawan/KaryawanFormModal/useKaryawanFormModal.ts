import { ref, watch } from "vue";
// Lock scroll saat modal form terbuka.
import { scrollLock } from "@/composables/scrollLock";
import {
  FORM_ERROR_CLASS,
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
export { FORM_ERROR_CLASS };

type FieldName = "nama" | "email" | "no_telepon" | "password";
type FormErrors = Record<FieldName, string>;

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
  const errors = ref<FormErrors>({
    nama: "",
    email: "",
    no_telepon: "",
    password: "",
  });
  const touched = ref<Record<FieldName, boolean>>({
    nama: false,
    email: false,
    no_telepon: false,
    password: false,
  });

  const resetValidation = () => {
    errors.value = { nama: "", email: "", no_telepon: "", password: "" };
    touched.value = {
      nama: false,
      email: false,
      no_telepon: false,
      password: false,
    };
  };

  const validateField = (field: FieldName): boolean => {
    const value = String(formData.value[field] ?? "").trim();

    if (field === "nama") {
      errors.value.nama = !value
        ? "Nama lengkap wajib diisi."
        : value.length < 3
          ? "Nama lengkap minimal 3 karakter."
          : !/^[\p{L}\s]+$/u.test(value)
            ? "Nama hanya boleh mengandung huruf dan spasi."
            : "";
    }

    if (field === "email") {
      errors.value.email = !value
        ? "Email wajib diisi."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
          ? "Masukkan alamat email yang valid."
          : "";
    }

    if (field === "no_telepon") {
      errors.value.no_telepon = !value
        ? "Nomor telepon wajib diisi."
        : !/^(08[0-9]{8,13}|\+628[0-9]{8,13})$/.test(value)
          ? "Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxxx."
          : "";
    }

    if (field === "password") {
      errors.value.password =
        props.isEditMode && !value
          ? ""
          : !value
            ? "Password wajib diisi."
            : value.length < 8
              ? "Password minimal 8 karakter."
              : !/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)
                ? "Password harus mengandung huruf besar, huruf kecil, dan angka."
                : "";
    }

    return !errors.value[field];
  };

  const handleBlur = (field: FieldName) => {
    touched.value[field] = true;
    validateField(field);
  };

  const handleInput = (field: FieldName) => {
    if (touched.value[field]) validateField(field);
  };

  const handlePhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const filtered = input.value.startsWith("+")
      ? `+${input.value.slice(1).replace(/\D/g, "")}`
      : input.value.replace(/\D/g, "");

    formData.value.no_telepon = filtered.slice(0, 17);
    input.value = formData.value.no_telepon;
    handleInput("no_telepon");
  };

  const getInputClass = (field: FieldName) =>
    getFormInputClass(touched.value[field] && Boolean(errors.value[field]), "pl-10");

  // Set ulang form setiap modal dibuka atau initialData berubah.
  watch(
    () => [props.show, props.initialData],
    () => {
      if (props.show) {
        // Mode edit mengisi data lama, tapi password selalu dikosongkan.
        formData.value = props.initialData
          ? { ...defaultForm(), ...props.initialData, password: "" }
          : defaultForm();
        resetValidation();
      }
    },
    { immediate: true },
  );

  // Submit salinan form ke parent setelah seluruh field lolos validasi lokal.
  const handleSubmit = () => {
    const fields: FieldName[] = ["nama", "email", "no_telepon", "password"];
    fields.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });

    if (fields.some((field) => errors.value[field])) return;

    formData.value.nama = formData.value.nama.trim();
    formData.value.email = formData.value.email.trim();
    emit("submit", { ...formData.value });
  };

  // State dan handler yang dipakai template.
  return {
    formData,
    errors,
    touched,
    handleBlur,
    handleInput,
    handlePhoneInput,
    getInputClass,
    handleSubmit,
  };
}
