<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const FORM_FIELDS = [
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
  const hasEmptyFields = Object.keys(form).some(
    (key) => form[key as keyof typeof form] === "",
  );

  const hasErrors = Object.values(errors).some((msg) => msg !== "");

  return !hasEmptyFields && !hasErrors;
});

const handleInput = (event: Event, key: string) => {
  const val = (event.target as HTMLInputElement).value;
  const fieldKey = key as keyof typeof form;

  form[fieldKey] = val;

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
    const response = await axios.post(`${API_URL}/register`, payload);
    successMessage.value = response.data.message || "Registrasi berhasil!";

    Object.keys(form).forEach((key) => (form[key as keyof typeof form] = ""));
    Object.keys(touched).forEach(
      (key) => (touched[key as keyof typeof touched] = false),
    );

    setTimeout(() => emit("close"), 3000);
  } catch (err: any) {
    logError(err, "handleRegister");
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

      <form @submit.prevent="handleRegister" class="space-y-4">
        <h2 class="text-2xl font-bold text-center mb-6">Buat Akun Baru</h2>

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
            @input="handleInput($event, field.key)"
            @blur="handleBlur(field.key)"
            :class="getInputClass(field.key as keyof typeof form)"
          />

          <p v-if="field.hint" class="text-[10px] text-gray-500 mt-1">
            {{ field.hint }}
          </p>

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
          <p class="text-red-700 text-sm font-medium">{{ error }}</p>
        </div>

        <div
          v-if="successMessage"
          class="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-green-700 text-sm font-medium">{{ successMessage }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          :class="[
            'w-full mt-6 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2',
            isLoading || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
          ]"
        >
          <span
            v-if="isLoading"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
          ></span>
          <span>{{ isLoading ? "Memproses..." : "Register" }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
