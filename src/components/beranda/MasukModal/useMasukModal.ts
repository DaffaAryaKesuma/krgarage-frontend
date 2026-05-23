import { ref, reactive, computed, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getRedirectPathForRole } from "@/utils/roleRoutes";
import { scrollLock } from "@/composables/scrollLock";

export const FORM_FIELDS = [
  { key: "email", label: "Email", type: "email", placeholder: "email@example.com" },
  { key: "password", label: "Password", type: "password", placeholder: "Masukkan password" },
];

const VALIDATION_RULES = {
  email: [
    { test: (val: string) => val.trim() !== "", msg: "Email wajib diisi" },
    { test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), msg: "Format email salah" },
  ],
  password: [
    { test: (val: string) => val !== "", msg: "Password wajib diisi" },
    { test: (val: string) => val.length >= 6, msg: "Minimal 6 karakter" },
  ],
};

export function useMasukModal(
  getOpen: () => boolean,
  emit: (e: "close") => void,
) {
  scrollLock(getOpen);

  const form = reactive({ email: "", password: "" });
  const errors = reactive({ email: "", password: "" });
  const touched = reactive({ email: false, password: false });
  const error = ref("");
  const isLoading = ref(false);
  const router = useRouter();

  watch(getOpen, (newVal) => {
    if (!newVal) {
      form.email = "";
      form.password = "";
      errors.email = "";
      errors.password = "";
      touched.email = false;
      touched.password = false;
      error.value = "";
    }
  });

  const validate = (fieldKey: keyof typeof form) => {
    const rules = VALIDATION_RULES[fieldKey] || [];
    for (const rule of rules) {
      if (!rule.test(form[fieldKey])) {
        errors[fieldKey] = rule.msg;
        return;
      }
    }
    errors[fieldKey] = "";
  };

  const isFormValid = computed(
    () => form.email !== "" && form.password !== "" && errors.email === "" && errors.password === "",
  );

  const handleInput = (e: Event, key: string) => {
    const fieldKey = key as keyof typeof form;
    form[fieldKey] = (e.target as HTMLInputElement).value;
    validate(fieldKey);
  };

  const handleBlur = (key: string) => {
    const fieldKey = key as keyof typeof form;
    touched[fieldKey] = true;
    validate(fieldKey);
  };

  const getInputClass = (fieldKey: keyof typeof form) => [
    "mt-1 w-full rounded-md border px-3 py-2 transition-colors outline-none",
    errors[fieldKey] && touched[fieldKey]
      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-500",
  ];

  const handleLogin = async () => {
    if (!isFormValid.value) return;
    error.value = "";
    isLoading.value = true;
    try {
      const response = await axios.post(`${API_URL}/masuk`, form);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      emit("close");
      router.push(getRedirectPathForRole(response.data.data?.role));
    } catch (err: any) {
      logError(err, "handleLogin");
      error.value = handleApiError(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    errors,
    touched,
    error,
    isLoading,
    isFormValid,
    handleInput,
    handleBlur,
    getInputClass,
    handleLogin,
  };
}
