<script setup lang="ts">
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

defineProps<Props>();
const emit = defineEmits<Emits>();

const variantClasses = {
  danger: "from-red-500 to-red-600",
  warning: "from-yellow-500 to-yellow-600",
  info: "from-blue-500 to-blue-600",
  success: "from-green-500 to-green-600",
};

const variantButtonClasses = {
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  warning:
    "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
  info: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  success:
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
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
          variantClasses[variant || 'danger'],
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

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ cancelText || "Batal" }}
          </button>
          <button
            @click="handleConfirm"
            :class="[
              'flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl',
              variantButtonClasses[variant || 'danger'],
            ]"
          >
            {{ confirmText || "Ya, Lanjutkan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>