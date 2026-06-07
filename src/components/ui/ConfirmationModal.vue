<script setup lang="ts">
// scrollLock mencegah halaman belakang ikut scroll saat modal terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";
import type { ButtonVariant } from "@/utils/buttonVariants";

// Props modal dikirim dari parent sesuai kebutuhan konfirmasi.
interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

// Modal mengirim event confirm atau cancel ke parent.
interface Emits {
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Kunci scroll selama show bernilai true.
scrollLock(() => props.show);

// Warna header berdasarkan jenis aksi.
const variantHeaderBgMap: Record<NonNullable<Props["variant"]>, string> = {
  danger: "bg-red-600",
  warning: "bg-amber-600",
  info: "bg-blue-600",
  success: "bg-green-600",
};

// Variant tombol confirm mengikuti jenis aksi.
const variantButtonMap: Record<NonNullable<Props["variant"]>, ButtonVariant> = {
  danger: "danger",
  warning: "warning",
  info: "info",
  success: "success",
};

// Icon modal mengikuti variant.
const variantIconClasses = {
  danger: "mdi mdi-alert-circle",
  warning: "mdi mdi-alert",
  info: "mdi mdi-information",
  success: "mdi mdi-check-circle",
};

// Kirim event confirm ke parent.
function handleConfirm() {
  emit("confirm");
}

// Kirim event cancel ke parent.
function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <!-- Overlay modal hanya tampil saat show true. -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4 transition-opacity duration-300"
    @click.self="handleCancel"
  >
    <!-- Card modal. -->
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
    >
      <!-- Header modal dengan warna sesuai variant. -->
      <div
        :class="[
          'px-6 py-4 rounded-t-xl',
          variantHeaderBgMap[variant || 'danger'],
        ]"
      >
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <i :class="`${variantIconClasses[variant || 'danger']} text-2xl`"></i>
          {{ title }}
        </h3>
      </div>

      <!-- Body berisi pesan dan tombol aksi. -->
      <div class="p-6">
        <p class="text-gray-700 mb-6">{{ message }}</p>

        <!-- Tombol cancel dan confirm. -->
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
