<script setup lang="ts">
import { FORM_FIELDS, useMasukModal } from "@/components/beranda/MasukModal/useMasukModal";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "openRegister"): void;
}>();

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
            @input="handleInput($event, field.key)"
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
