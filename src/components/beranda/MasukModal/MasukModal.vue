<script setup lang="ts">
// Field dan logic login diambil dari composable.
import { FORM_FIELDS, useMasukModal } from "@/components/beranda/MasukModal/useMasukModal";
// Helper class alert error.
import { getAlertBoxClass } from "@/utils/badgeVariants";
// Helper class tombol.
import { getButtonClass, getFullWidthButtonClass } from "@/utils/buttonVariants";
// Helper class label, required mark, dan error form.
import {
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
} from "@/utils/formVariants";

// Props menentukan modal sedang terbuka atau tidak.
const props = defineProps<{ open: boolean }>();
// Event close menutup modal, openRegister pindah ke modal daftar.
const emit = defineEmits<{
  (e: "close"): void;
  (e: "openRegister"): void;
}>();

// Ambil state form dan handler login dari composable.
const {
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
} = useMasukModal(() => props.open, () => emit("close"));
</script>

<template>
  <!-- Modal login hanya muncul saat open bernilai true. -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('close')"
  >
    <!-- Panel modal login. -->
    <div class="relative bg-white w-full max-w-md rounded-xl shadow-xl p-8">
      <!-- Tombol tutup modal. -->
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <span class="text-2xl">&times;</span>
      </button>

      <!-- Submit form menjalankan handleLogin. -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <h2 class="text-2xl font-bold text-center mb-6">Login Akun</h2>

        <!-- Field login di-loop dari FORM_FIELDS. -->
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

          <!-- Error field hanya muncul jika field sudah disentuh. -->
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

        <!-- Error global dari backend login. -->
        <div
          v-if="error"
          :class="[getAlertBoxClass('error'), 'p-3 text-center shadow-none']"
        >
          <p class="text-sm font-medium">
            {{ error }}
          </p>
        </div>

        <!-- Tombol submit mati saat loading atau form belum valid. -->
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          :class="getFullWidthButtonClass('primary', 'md', 'mt-6 shadow-lg')"
        >
          <span
            v-if="isLoading"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
          ></span>
          <span>{{ isLoading ? "Memproses..." : "Masuk" }}</span>
        </button>

        <!-- Pindah dari modal login ke modal daftar. -->
        <p class="text-center text-gray-600 text-sm mt-4">
          Belum punya akun?
          <button
            type="button"
            @click="emit('openRegister')"
            :class="getButtonClass('link', 'xs', 'inline p-0 align-baseline hover:underline')"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  </div>
</template>
