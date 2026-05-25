import { ref, watch } from "vue";
import { scrollLock } from "@/composables/scrollLock";
import { getFormInputClass } from "@/utils/formVariants";

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

export interface KaryawanFormModalEmit {
  (e: "close"): void;
  (e: "submit", data: FormData): void;
}

export function useKaryawanFormModal(
  props: { show: boolean; isEditMode: boolean; initialData?: Partial<FormData> },
  emit: KaryawanFormModalEmit,
) {
  scrollLock(() => props.show);

  const defaultForm = (): FormData => ({
    id: "",
    nama: "",
    email: "",
    no_telepon: "",
    password: "",
    role: "mekanik",
  });

  const formData = ref<FormData>(defaultForm());

  watch(
    () => [props.show, props.initialData],
    () => {
      if (props.show) {
        formData.value = props.initialData
          ? { ...defaultForm(), ...props.initialData, password: "" }
          : defaultForm();
      }
    },
    { immediate: true },
  );

  const handleSubmit = () => emit("submit", { ...formData.value });

  return { formData, handleSubmit };
}
