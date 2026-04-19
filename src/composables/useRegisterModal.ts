import { computed, reactive, ref } from "vue";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";

type RegisterFieldKey = "name" | "email" | "no_telepon" | "password";

interface RegisterFieldConfig {
  key: RegisterFieldKey;
  label: string;
  type: string;
  placeholder: string;
  hint?: string;
}

const FORM_FIELDS: RegisterFieldConfig[] = [
  {
    key: "name",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukkan nama lengkap",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "email@example.com",
  },
  {
    key: "no_telepon",
    label: "Nomor HP",
    type: "tel",
    placeholder: "081234567890",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Minimal 8 karakter",
    hint: "Harus 8+ karakter, huruf besar, huruf kecil, dan angka",
  },
];

const VALIDATION_RULES = {
  name: [
    { test: (val: string) => val.trim() !== "", msg: "Nama harus diisi" },
    { test: (val: string) => val.length >= 3, msg: "Minimal 3 karakter" },
  ],
  email: [
    { test: (val: string) => val.trim() !== "", msg: "Email harus diisi" },
    {
      test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      msg: "Format email tidak valid",
    },
  ],
  no_telepon: [
    { test: (val: string) => val.trim() !== "", msg: "Nomor HP harus diisi" },
    {
      test: (val: string) =>
        /^(08|\+628)[0-9]{8,13}$/.test(val.replace(/\s/g, "")),
      msg: "Format HP tidak valid",
    },
  ],
  password: [
    { test: (val: string) => val !== "", msg: "Password harus diisi" },
    { test: (val: string) => val.length >= 8, msg: "Minimal 8 karakter" },
    {
      test: (val: string) => /(?=.*[a-z])/.test(val),
      msg: "Butuh huruf kecil",
    },
    {
      test: (val: string) => /(?=.*[A-Z])/.test(val),
      msg: "Butuh huruf besar",
    },
    { test: (val: string) => /(?=.*\d)/.test(val), msg: "Butuh angka" },
  ],
};

export function useRegisterModal(onClose: () => void) {
  const form = reactive({
    name: "",
    email: "",
    no_telepon: "",
    password: "",
  });

  const errors = reactive({
    name: "",
    email: "",
    no_telepon: "",
    password: "",
  });

  const touched = reactive({
    name: false,
    email: false,
    no_telepon: false,
    password: false,
  });

  const error = ref("");
  const successMessage = ref("");
  const isLoading = ref(false);

  const validate = (fieldKey: RegisterFieldKey) => {
    const rules = VALIDATION_RULES[fieldKey] || [];
    const value = form[fieldKey];

    for (const rule of rules) {
      if (!rule.test(value)) {
        errors[fieldKey] = rule.msg;
        return;
      }
    }

    errors[fieldKey] = "";
  };

  const isFormValid = computed(() => {
    const hasEmptyFields = Object.keys(form).some(
      (key) => form[key as RegisterFieldKey] === "",
    );

    const hasErrors = Object.values(errors).some((msg) => msg !== "");

    return !hasEmptyFields && !hasErrors;
  });

  const handleInput = (event: Event, key: string) => {
    const val = (event.target as HTMLInputElement).value;
    const fieldKey = key as RegisterFieldKey;

    form[fieldKey] = val;
    validate(fieldKey);
  };

  const handleBlur = (key: string) => {
    const fieldKey = key as RegisterFieldKey;
    touched[fieldKey] = true;
    validate(fieldKey);
  };

  const getInputClass = (key: string) => {
    const fieldKey = key as RegisterFieldKey;

    return [
      "mt-1 w-full rounded-md border px-3 py-2 transition-colors outline-none",
      errors[fieldKey] && touched[fieldKey]
        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-500",
    ];
  };

  const resetFormState = () => {
    (Object.keys(form) as RegisterFieldKey[]).forEach((key) => {
      form[key] = "";
      touched[key] = false;
      errors[key] = "";
    });
  };

  const handleRegister = async () => {
    if (!isFormValid.value) return;

    error.value = "";
    successMessage.value = "";
    isLoading.value = true;

    try {
      const payload = {
        nama: form.name,
        email: form.email,
        no_telepon: form.no_telepon,
        password: form.password,
      };

      const response = await axios.post(`${API_URL}/daftar`, payload);
      successMessage.value = response.data.message || "Registrasi berhasil!";

      resetFormState();

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      logError(err, "handleRegister");
      error.value = handleApiError(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    FORM_FIELDS,
    form,
    errors,
    touched,
    error,
    successMessage,
    isLoading,
    isFormValid,
    handleInput,
    handleBlur,
    getInputClass,
    handleRegister,
  };
}
