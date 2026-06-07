<script setup lang="ts">
// ref untuk state input, watch untuk reset saat modal dibuka.
import { ref, watch } from "vue";
// Mengunci scroll halaman belakang saat modal terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper warna gradient header.
import { getGradientToneClass } from "@/utils/badgeVariants";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";
// Class error dan textarea.
import { FORM_ERROR_CLASS, getFormTextareaClass } from "@/utils/formVariants";

// Props modal catatan.
interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  required?: boolean;
  loading?: boolean;
  subtitle?: string;
}

// Event confirm membawa isi catatan sebagai string.
interface Emits {
  (event: "confirm", value: string): void;
  (event: "cancel"): void;
}

// Default props agar parent tidak wajib mengisi semuanya.
const props = withDefaults(defineProps<Props>(), {
  confirmText: "Simpan",
  cancelText: "Batal",
  placeholder: "Contoh: Keluhan bunyi kasar pada mesin sudah diatasi",
  required: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Isi textarea.
const inputValue = ref("");
// Pesan error lokal jika required tetapi kosong.
const errorMsg = ref("");

// Lock scroll selama modal terbuka.
scrollLock(() => props.show);

// Reset isi dan error setiap kali modal dibuka.
watch(() => props.show, (newVal) => {
  if (newVal) {
    inputValue.value = "";
    errorMsg.value = "";
  }
}, { immediate: true });

// Validasi lalu kirim catatan ke parent.
function handleConfirm() {
  if (props.required && !inputValue.value.trim()) {
    errorMsg.value = "Bagian ini wajib diisi";
    return;
  }
  emit("confirm", inputValue.value.trim());
}

// Kirim event cancel ke parent.
function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <!-- Overlay modal catatan. -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-black/30"
    @click.self="handleCancel"
  >
    <!-- Card modal. -->
    <div class="w-full max-w-md transform transition-all duration-300 scale-100 bg-white rounded-xl shadow-2xl">
      <!-- Header hijau untuk aksi selesai/simpan catatan. -->
      <div
        :class="[
          'px-6 py-4 rounded-t-xl bg-gradient-to-br',
          getGradientToneClass('success'),
        ]"
      >
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="mdi mdi-check-all text-2xl"></i>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-white/85 text-sm mt-1">
          {{ subtitle }}
        </p>
      </div>
      <!-- Body berisi pesan, textarea, counter, dan tombol. -->
      <div class="p-6">
        <p class="text-gray-700 mb-4">{{ message }}</p>
        <div class="mb-6">
          <!-- Textarea terhubung ke inputValue. -->
          <textarea
            v-model="inputValue"
            :placeholder="placeholder"
            :class="getFormTextareaClass(!!errorMsg)"
            rows="4"
            maxlength="1000"
          ></textarea>
          <!-- Counter panjang catatan. -->
          <div class="mt-1 text-right text-xs text-gray-500">
            {{ inputValue.length }}/1000
          </div>
          <!-- Error hanya tampil jika validasi gagal. -->
          <p v-if="errorMsg" :class="FORM_ERROR_CLASS">{{ errorMsg }}</p>
        </div>
        <!-- Tombol batal dan confirm. -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            :class="getButtonClass('secondary', 'lg', 'flex-1 border-2')"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :disabled="loading"
            :class="getButtonClass('success', 'lg', 'flex-1 shadow-lg hover:shadow-xl')"
          >
            <span v-if="loading"><i class="mdi mdi-loading mdi-spin mr-1"></i> Menyimpan...</span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
