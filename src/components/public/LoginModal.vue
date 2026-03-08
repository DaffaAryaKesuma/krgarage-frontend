<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "openRegister"): void;
}>();

const FORM_FIELDS = [
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "email@example.com",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Masukkan password",
  },
];

const VALIDATION_RULES = {
  email: [
    { test: (val: string) => val.trim() !== "", msg: "Email wajib diisi" },
    {
      test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      msg: "Format email salah",
    },
  ],
  password: [
    { test: (val: string) => val !== "", msg: "Password wajib diisi" },
    { test: (val: string) => val.length >= 6, msg: "Minimal 6 karakter" },
  ],
};

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  mekanik: "/mechanic/dashboard",
  owner: "/owner/dashboard",
  customer: "/app/dashboard",
};

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const touched = reactive({
  email: false,
  password: false,
});

const error = ref("");
const isLoading = ref(false);
const router = useRouter();

const validate = (fieldKey: keyof typeof form) => {
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
  const isFilled = form.email !== "" && form.password !== "";
  const hasNoErrors = errors.email === "" && errors.password === "";
  return isFilled && hasNoErrors;
});

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
    const response = await axios.post(`${API_URL}/login`, form);

    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    emit("close");

    const userRole = response.data.user.role as keyof typeof ROLE_ROUTES;
    const redirectPath = ROLE_ROUTES[userRole] || ROLE_ROUTES.customer;

    router.push(redirectPath);
  } catch (err: any) {
    logError(err, "handleLogin");
    error.value = handleApiError(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('close')"
  >
    <div class="relative bg-white w-full max-w-md rounded-xl shadow-xl p-8">
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <span class="text-2xl">&times;</span>
      </button>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <h2 class="text-2xl font-bold text-center mb-6">Login Akun</h2>

        <div v-for="field in FORM_FIELDS" :key="field.key" class="space-y-1">
          <label
            :for="field.key"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label }} <span class="text-red-500">*</span>
          </label>

          <input
            :id="field.key"
            :type="field.type"
            :placeholder="field.placeholder"
            :value="form[field.key as keyof typeof form]"
            @input="(e) => handleInput(e, field.key)"
            @blur="handleBlur(field.key)"
            :class="getInputClass(field.key as keyof typeof form)"
          />

          <p
            v-if="
              errors[field.key as keyof typeof errors] &&
              touched[field.key as keyof typeof touched]
            "
            class="text-xs text-red-600 flex items-center gap-1 mt-1"
          >
            <span>⚠</span> {{ errors[field.key as keyof typeof errors] }}
          </p>
        </div>

        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-700 text-sm font-medium text-center">
            {{ error }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          :class="[
            'w-full mt-6 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2',
            isLoading || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg',
          ]"
        >
          <span
            v-if="isLoading"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
          ></span>
          <span>{{ isLoading ? "Memproses..." : "Masuk" }}</span>
        </button>

        <p class="text-center text-gray-600 text-sm mt-4">
          Belum punya akun?
          <button
            type="button"
            @click="emit('openRegister')"
            class="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  </div>
</template>
