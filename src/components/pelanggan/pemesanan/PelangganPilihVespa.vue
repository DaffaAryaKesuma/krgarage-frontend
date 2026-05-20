<script setup lang="ts">
import type { VespaBasic } from "@/types/vespa";

interface Props {
  vespas: VespaBasic[];
  modelValue: number | null;
  error?: string;
  touched?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectVespa = (id: number) => {
  emit("update:modelValue", id);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
      >
        <i class="mdi mdi-motorbike text-xl text-blue-600"></i>
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Pilih Vespa</h2>
        <p class="text-sm text-gray-500">Vespa mana yang akan dilayanan?</p>
      </div>
    </div>

    <div
      v-if="vespas.length === 0"
      class="p-6 text-center"
    >
      <i class="mdi mdi-motorbike text-5xl text-blue-300 mb-3"></i>
      <p class="text-gray-600 font-semibold">Anda belum menambahkan Vespa</p>
      <router-link
        to="/app/vespa-saya"
        class="text-blue-600 hover:text-blue-800 font-semibold inline-block mt-2"
      >
        Tambah Vespa Sekarang
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="vespa in vespas"
        :key="vespa.id"
        @click="!vespa.pemesanan_aktif && selectVespa(vespa.id)"
        :class="[
          'p-5 rounded-lg border-2 transition-all',
          vespa.pemesanan_aktif
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
            : modelValue === vespa.id
              ? 'border-blue-500 bg-blue-50 shadow-lg cursor-pointer'
              : 'border-gray-200 hover:border-blue-200 cursor-pointer',
        ]"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              vespa.pemesanan_aktif ? 'bg-blue-100' : 'bg-blue-100',
            ]"
          >
            <i :class="['mdi mdi-motorbike text-lg', vespa.pemesanan_aktif ? 'text-gray-500' : 'text-blue-600']"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-gray-900">{{ vespa.model }}</h4>
            <p class="text-sm text-gray-600">{{ vespa.plat_nomor }}</p>
            <span
              v-if="vespa.pemesanan_aktif"
              class="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
            >
              <i class="mdi mdi-clock-outline text-xs"></i>
              Sedang dalam servis
            </span>
          </div>
          <div
            v-if="modelValue === vespa.id && !vespa.pemesanan_aktif"
            class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
          >
            <i class="mdi mdi-check text-white text-sm"></i>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="error && touched"
      class="text-red-600 text-sm mt-4 flex items-center gap-2"
    >
      <i class="mdi mdi-alert-circle"></i>{{ error }}
    </p>
  </div>
</template>
