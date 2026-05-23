import { ref, watch } from "vue";
import { scrollLock } from "@/composables/scrollLock";

export interface FormData {
  id: string | number;
  nama: string;
  email: string;
  no_telepon: string;
  password: string;
  role: string;
}

export const INPUT_CLASS =
  "block w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white";

export function useKaryawanFormModal(
  props: { show: boolean; isEditMode: boolean; initialData?: Partial<FormData> },
  emit: (e: "close" | "submit", ...args: any[]) => void,
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
