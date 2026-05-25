<script setup lang="ts">
import { scrollLock } from "@/composables/scrollLock";
import { getGradientToneClass } from "@/utils/badgeVariants";
import type { GradientToneKey } from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";
import type { ButtonVariant } from "@/utils/buttonVariants";

interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

interface Emits {
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

scrollLock(() => props.show);

const variantToneMap: Record<NonNullable<Props["variant"]>, GradientToneKey> = {
  danger: "danger",
  warning: "warning",
  info: "info",
  success: "success",
};

const variantButtonMap: Record<NonNullable<Props["variant"]>, ButtonVariant> = {
  danger: "danger",
  warning: "warning",
  info: "info",
  success: "success",
};

const variantIconClasses = {
  danger: "mdi mdi-alert-circle",
  warning: "mdi mdi-alert",
  info: "mdi mdi-information",
  success: "mdi mdi-check-circle",
};

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4 transition-opacity duration-300"
    @click.self="handleCancel"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
    >
      <!-- Header -->
      <div
        :class="[
          'bg-gradient-to-r px-6 py-4 rounded-t-xl',
          getGradientToneClass(variantToneMap[variant || 'danger']),
        ]"
      >
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <i :class="`${variantIconClasses[variant || 'danger']} text-2xl`"></i>
          {{ title }}
        </h3>
      </div>

      <!-- Body -->
      <div class="p-6">
        <p class="text-gray-700 mb-6">{{ message }}</p>

        <!-- Aksi Buttons -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            :class="getButtonClass('secondary', 'lg', 'flex-1 border-2')"
          >
            {{ cancelText || "Batal" }}
          </button>
          <button
            @click="handleConfirm"
            :class="getButtonClass(variantButtonMap[variant || 'danger'], 'lg', 'flex-1 shadow-lg hover:shadow-xl')"
          >
            {{ confirmText || "Ya, Lanjutkan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
