<script setup lang="ts">
interface Vespa {
  id: number;
  model: string;
  plat_nomor: string;
}

interface Props {
  vespas: Vespa[];
  modelValue: number | null;
  error?: string;
  touched?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: number): void;
}

const props = defineProps<Props>();
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
        <p class="text-sm text-gray-500">Vespa mana yang akan diservice?</p>
      </div>
    </div>

    <div
      v-if="vespas.length === 0"
      class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center"
    >
      <i class="mdi mdi-motorbike text-5xl text-blue-300 mb-3"></i>
      <p class="text-gray-600 font-semibold">Anda belum menambahkan Vespa</p>
      <router-link
        to="/app/my-vespas"
        class="text-blue-600 hover:text-blue-800 font-semibold inline-block mt-2"
      >
        Tambah Vespa Sekarang →
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="vespa in vespas"
        :key="vespa.id"
        @click="selectVespa(vespa.id)"
        :class="[
          'p-5 rounded-lg border-2 cursor-pointer transition-all',
          modelValue === vespa.id
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 hover:border-blue-200',
        ]"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
          >
            <i class="mdi mdi-motorbike text-lg text-red-600"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-gray-900">{{ vespa.model }}</h4>
            <p class="text-sm text-gray-600">{{ vespa.plat_nomor }}</p>
          </div>
          <div
            v-if="modelValue === vespa.id"
            class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
          >
            <i class="mdi mdi-check text-white text-sm"></i>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="error && touched"
      class="text-red-600 text-sm mt-4 flex items-center gap-2 bg-red-50 p-3 rounded border border-red-200"
    >
      <i class="mdi mdi-alert-circle"></i>{{ error }}
    </p>
  </div>
</template>
