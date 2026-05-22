<script setup lang="ts">
import { ref, watch } from 'vue';

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

interface Emits {
  (e: "confirm", value: string): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Simpan',
  cancelText: 'Batal',
  placeholder: 'Contoh: Keluhan bunyi kasar pada mesin sudah diatasi',
  required: false,
  loading: false,
});

const emit = defineEmits<Emits>();

import { scrollLock } from "@/composables/scrollLock";

const inputValue = ref('');
const errorMsg = ref('');

scrollLock(() => props.show);

watch(() => props.show, (newVal) => {
  if (newVal) {
    inputValue.value = '';
    errorMsg.value = '';
  }
}, { immediate: true });

function handleConfirm() {
  if (props.required && !inputValue.value.trim()) {
    errorMsg.value = 'Bagian ini wajib diisi';
    return;
  }
  emit('confirm', inputValue.value.trim());
}

function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-black/30"
    @click.self="handleCancel"
  >
    <div class="w-full max-w-md transform transition-all duration-300 scale-100 bg-white rounded-xl shadow-2xl">
      <div class="px-6 py-4 rounded-t-xl bg-green-600">
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="mdi mdi-check-all text-2xl"></i>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-green-50 text-sm mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div class="p-6">
        <p class="text-gray-700 mb-4">{{ message }}</p>
        <div class="mb-6">
          <textarea
            v-model="inputValue"
            :placeholder="placeholder"
            class="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2"
            :class="errorMsg ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-gray-200 focus:ring-gray-200'"
            rows="4"
            maxlength="1000"
          ></textarea>
          <div class="mt-1 text-right text-xs text-gray-500">
            {{ inputValue.length }}/1000
          </div>
          <p v-if="errorMsg" class="mt-1 text-sm text-red-500">{{ errorMsg }}</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex justify-center items-center gap-2 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :disabled="loading"
            class="flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-all flex justify-center items-center gap-2 bg-green-600 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="loading"><i class="mdi mdi-loading mdi-spin mr-1"></i> Menyimpan...</span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
