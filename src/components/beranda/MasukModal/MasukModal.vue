<script setup lang="ts">
// Field dan logic login diambil dari composable.
import { FORM_FIELDS, useMasukModal } from "@/components/beranda/MasukModal/useMasukModal";
// Helper Google Sign-In.
import { loginWithGoogle, getGoogleRedirectPath } from "@/utils/googleAuth";
// ref untuk state loading dan error Google.
import { ref } from "vue";
import { useRouter } from "vue-router";
// Helper class alert error.
import { getAlertBoxClass } from "@/utils/badgeVariants";
// Helper class tombol.
import { getFullWidthButtonClass } from "@/utils/buttonVariants";
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

// State khusus untuk proses login via Google.
const isGoogleLoading = ref(false);
const googleError = ref("");
const router = useRouter();

// Handler tombol Masuk dengan Google.
const handleGoogleLogin = () => {
  googleError.value = "";
  loginWithGoogle(
    // Callback sukses — simpan data lalu redirect.
    (_token, userData) => {
      emit("close");
      router.push(getGoogleRedirectPath(userData?.role));
    },
    // Callback error — tampilkan pesan di modal.
    (msg) => { googleError.value = msg; },
    // Callback loading.
    (loading) => { isGoogleLoading.value = loading; },
  );
};
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
      <form @submit.prevent="handleLogin" novalidate class="space-y-4">
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

        <!-- Pemisah visual antara login manual dan Google. -->
        <div class="relative my-4 flex items-center">
          <div class="flex-1 border-t border-gray-200"></div>
          <span class="mx-3 text-xs font-medium text-gray-400">ATAU</span>
          <div class="flex-1 border-t border-gray-200"></div>
        </div>

        <!-- Error dari proses login Google. -->
        <div
          v-if="googleError"
          :class="[getAlertBoxClass('error'), 'p-3 text-center shadow-none mb-2']"
        >
          <p class="text-sm font-medium">{{ googleError }}</p>
        </div>

        <!-- Tombol Masuk dengan Google — styling resmi Google. -->
        <button
          type="button"
          id="btn-masuk-google"
          @click="handleGoogleLogin"
          :disabled="isGoogleLoading"
          class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
        >
          <!-- Loading spinner Google. -->
          <span
            v-if="isGoogleLoading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
          ></span>
          <!-- Logo Google SVG resmi jika tidak loading. -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>{{ isGoogleLoading ? "Memproses..." : "Masuk dengan Google" }}</span>
        </button>

        <!-- Pindah dari modal login ke modal daftar. -->
        <p class="text-center text-gray-600 text-sm mt-4">
          Belum punya akun?
          <button
            type="button"
            @click="emit('openRegister')"
            class="inline align-baseline font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  </div>
</template>
