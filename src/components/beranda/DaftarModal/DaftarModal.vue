<script setup lang="ts">
import { watch } from "vue";
import { useRegisterModal } from "./useRegisterModal";
import { scrollLock } from "@/composables/scrollLock";
import { getAlertBoxClass } from "@/utils/badgeVariants";
import { getFullWidthButtonClass } from "@/utils/buttonVariants";
import {
  FORM_ERROR_CLASS,
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
} from "@/utils/formVariants";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

scrollLock(() => props.open);

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

          <p v-if="field.hint" :class="FORM_HINT_CLASS">
            {{ field.hint }}
          </p>

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
          :class="[getAlertBoxClass('error'), 'p-3 shadow-none']"
        >
          <p class="text-sm font-medium">{{ error }}</p>
        </div>

        <div
          v-if="successMessage"
          :class="[getAlertBoxClass('success'), 'p-3 shadow-none']"
        >
          <p class="text-sm font-medium">{{ successMessage }}</p>
        </div>

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
