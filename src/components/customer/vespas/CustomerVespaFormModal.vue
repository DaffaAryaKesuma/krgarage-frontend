<script setup lang="ts">
import { reactive, watch } from "vue";

interface Props {
  show: boolean;
  mode: "add" | "edit";
  initialData?: {
    id?: number | null;
    model: string;
    tahun_produksi: number | null;
    plat_nomor: string;
  };
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  mode: "add",
  error: "",
});

const emit = defineEmits<{
  submit: [
    data: {
      id?: number | null;
      model: string;
      tahun_produksi: number | null;
      plat_nomor: string;
    },
  ];
  close: [];
}>();

const form = reactive({
  id: null as number | null,
  model: "",
  tahun_produksi: null as number | null,
  plat_nomor: "",
});

const errors = reactive({
  model: "",
  tahun_produksi: "",
  plat_nomor: "",
});

const touched = reactive({
  model: false,
  tahun_produksi: false,
  plat_nomor: false,
});

// Validation rules
const VALIDATION_RULES = {
  model: {
    required: "Model vespa harus diisi",
    minLength: { value: 2, message: "Model vespa minimal 2 karakter" },
    maxLength: { value: 50, message: "Model vespa maksimal 50 karakter" },
  },
  tahun_produksi: {
    required: "Tahun Produksi vespa harus diisi",
    min: { value: 1946, message: "Tahun Produksi vespa minimal 1946" },
    max: {
      value: new Date().getFullYear() + 1,
      message: `Tahun Produksi vespa maksimal ${new Date().getFullYear() + 1}`,
    },
  },
  plat_nomor: {
    required: "Plat Nomor harus diisi",
    minLength: { value: 3, message: "Plat Nomor minimal 3 karakter" },
    maxLength: { value: 15, message: "Plat Nomor maksimal 15 karakter" },
    pattern: {
      value: /^[A-Z0-9\s]+$/i,
      message: "Plat Nomor hanya boleh mengandung huruf dan angka",
    },
  },
};

// Validate single field
const validateField = (field: keyof typeof errors) => {
  if (!touched[field]) return;

  const rules = VALIDATION_RULES[field];
  const value = form[field];
  let errorMsg = "";

  if (field === "model" || field === "plat_nomor") {
    const str = String(value || "").trim();
    if (!str) errorMsg = rules.required;
    else if (str.length < (rules as any).minLength.value)
      errorMsg = (rules as any).minLength.message;
    else if (str.length > (rules as any).maxLength.value)
      errorMsg = (rules as any).maxLength.message;
    else if (field === "plat_nomor" && !(rules as any).pattern.value.test(str))
      errorMsg = (rules as any).pattern.message;
  } else if (field === "tahun_produksi") {
    if (!value) errorMsg = rules.required;
    else if (value < (rules as any).min.value)
      errorMsg = (rules as any).min.message;
    else if (value > (rules as any).max.value)
      errorMsg = (rules as any).max.message;
  }

  errors[field] = errorMsg;
};

// Validate all fields
const validateAll = () => {
  (Object.keys(touched) as (keyof typeof touched)[]).forEach((key) => {
    touched[key] = true;
    validateField(key);
  });
  return !Object.values(errors).some((e) => e);
};

// Handle submit
const handleSubmit = () => {
  if (!validateAll()) return;
  emit("submit", { ...form });
};

// Watch for initial data changes (when opening edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.id = newData.id || null;
      form.model = newData.model || "";
      form.tahun_produksi = newData.tahun_produksi || null;
      form.plat_nomor = newData.plat_nomor || "";
    } else {
      // Reset form
      form.id = null;
      form.model = "";
      form.tahun_produksi = null;
      form.plat_nomor = "";
      Object.keys(touched).forEach(
        (key) => (touched[key as keyof typeof touched] = false),
      );
      Object.keys(errors).forEach(
        (key) => (errors[key as keyof typeof errors] = ""),
      );
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <section
      class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <h2
        class="text-2xl font-bold text-gray-900 mb-6 p-6 border-b border-gray-100 sticky top-0 bg-white"
      >
        <i class="mdi mdi-pencil-box text-red-600 mr-2"></i>
        {{ mode === "add" ? "Tambah Vespa Baru" : "Edit Vespa" }}
      </h2>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Model Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-car-side text-red-600 mr-1"></i>Model
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              @blur="
                touched.model = true;
                validateField('model');
              "
              @input="validateField('model')"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none',
                errors.model && touched.model
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: Vespa Sprint 150"
            />
            <p
              v-if="errors.model && touched.model"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.model }}
            </p>
          </div>

          <!-- Tahun Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-calendar text-red-600 mr-1"></i>Tahun
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.tahun_produksi"
              type="number"
              @blur="
                touched.tahun_produksi = true;
                validateField('tahun_produksi');
              "
              @input="validateField('tahun_produksi')"
              :min="1946"
              :max="new Date().getFullYear() + 1"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none',
                errors.tahun_produksi && touched.tahun_produksi
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: 2020"
            />
            <p
              v-if="errors.tahun_produksi && touched.tahun_produksi"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.tahun_produksi }}
            </p>
          </div>

          <!-- Plat Nomor Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-license text-red-600 mr-1"></i>Plat Nomor
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.plat_nomor"
              type="text"
              @blur="
                touched.plat_nomor = true;
                validateField('plat_nomor');
              "
              @input="validateField('plat_nomor')"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none uppercase',
                errors.plat_nomor && touched.plat_nomor
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: BM 1234 ABC"
            />
            <p
              v-if="errors.plat_nomor && touched.plat_nomor"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.plat_nomor }}
            </p>
          </div>
        </div>

        <p
          v-if="error"
          class="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
        >
          <i class="mdi mdi-alert text-lg"></i>
          {{ error }}
        </p>

        <div class="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <i class="mdi mdi-check-circle"></i>
            {{ mode === "add" ? "Tambah Vespa" : "Perbarui Vespa" }}
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
