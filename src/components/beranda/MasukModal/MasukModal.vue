<script setup lang="ts">
import { FORM_FIELDS, useMasukModal } from "@/components/beranda/MasukModal/useMasukModal";
import { getAlertBoxClass } from "@/utils/badgeVariants";
import { getButtonClass, getFullWidthButtonClass } from "@/utils/buttonVariants";
import {
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
} from "@/utils/formVariants";

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

        <div
          v-if="error"
          :class="[getAlertBoxClass('error'), 'p-3 text-center shadow-none']"
        >
          <p class="text-sm font-medium">
            {{ error }}
          </p>
        </div>

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
