<script setup lang="ts">
// watch dipakai untuk reset form saat modal ditutup.
import { watch } from "vue";
// Composable berisi form, validasi, dan submit register.
import { useRegisterModal } from "./useRegisterModal";
// Mengunci scroll halaman saat modal terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper class alert sukses/error.
import { getAlertBoxClass } from "@/utils/badgeVariants";
// Helper class tombol lebar penuh.
import { getFullWidthButtonClass } from "@/utils/buttonVariants";
// Helper class form.
import {
  FORM_ERROR_CLASS,
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
} from "@/utils/formVariants";

// Props menentukan modal daftar terbuka atau tidak.
const props = defineProps<{
  open: boolean;
}>();

// Event close dikirim saat modal ingin ditutup.
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Saat modal terbuka, scroll body dikunci.
scrollLock(() => props.open);

// Ambil state dan handler register dari composable.
const {
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
  resetFormState,
} = useRegisterModal(() => emit("close"));

// Jika modal ditutup, bersihkan form dan pesan.
watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      resetFormState();
      error.value = "";
      successMessage.value = "";
    }
  },
);
</script>

<template>
  <!-- Modal daftar hanya muncul saat open bernilai true. -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('close')"
  >
    <!-- Panel utama modal daftar. -->
    <div class="relative bg-white w-full max-w-md rounded-xl shadow-xl p-8">
      <!-- Tombol tutup modal. -->
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <span class="text-2xl">&times;</span>
      </button>

      <!-- Submit form menjalankan handleRegister. -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <h2 class="text-2xl font-bold text-center mb-6">Buat Akun Baru</h2>

        <!-- Semua field daftar dibuat dari FORM_FIELDS. -->
        <div v-for="field in FORM_FIELDS" :key="field.key" class="space-y-1">
          <label
            :for="field.key"
            :class="FORM_LABEL_CLASS"
          >
            {{ field.label }} <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
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

          <!-- Hint tambahan, contohnya aturan password. -->
          <p v-if="field.hint" :class="FORM_HINT_CLASS">
            {{ field.hint }}
          </p>

          <!-- Error field hanya muncul setelah field disentuh. -->
          <p
            v-if="
              errors[field.key as keyof typeof errors] &&
              touched[field.key as keyof typeof touched]
            "
            :class="FORM_ERROR_CLASS"
          >
            <i class="mdi mdi-alert-circle text-xs"></i>
            {{ errors[field.key as keyof typeof errors] }}
          </p>
        </div>

        <!-- Error global dari backend register. -->
        <div
          v-if="error"
          :class="[getAlertBoxClass('error'), 'p-3 shadow-none']"
        >
          <p class="text-sm font-medium">{{ error }}</p>
        </div>

        <!-- Pesan sukses setelah akun berhasil dibuat. -->
        <div
          v-if="successMessage"
          :class="[getAlertBoxClass('success'), 'p-3 shadow-none']"
        >
          <p class="text-sm font-medium">{{ successMessage }}</p>
        </div>

        <!-- Tombol submit mati saat loading atau form belum valid. -->
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          :class="getFullWidthButtonClass('primary', 'md', 'mt-6 shadow-lg hover:shadow-xl')"
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
