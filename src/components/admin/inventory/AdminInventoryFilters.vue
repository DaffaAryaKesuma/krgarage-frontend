<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Props {
  searchQuery: string;
  selectedKategori: string;
  showLowStock: boolean;
  kategoriOptions: Array<{ value: string; label: string }>;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedKategori": [value: string];
  "update:showLowStock": [value: boolean];
  addNew: [];
}>();

const handleKategoriChange = (value: string | number | null) => {
  emit("update:selectedKategori", String(value || ""));
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <div
      class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <input
        :value="searchQuery"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
        type="text"
        placeholder="Cari suku cadang..."
        class="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500 md:col-span-2"
      />
      <CustomSelect
        :model-value="selectedKategori"
        @update:model-value="handleKategoriChange"
        :options="kategoriOptions"
        placeholder="Semua kategori"
      />
      <button
        @click="emit('addNew')"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 md:col-span-2 lg:col-span-3 xl:col-span-1"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Suku Cadang</span>
      </button>
    </div>

    <label class="flex items-center text-sm text-gray-700">
      <input
        :checked="showLowStock"
        @change="
          emit(
            'update:showLowStock',
            ($event.target as HTMLInputElement).checked,
          )
        "
        type="checkbox"
        class="w-4 h-4 text-red-600 rounded focus:ring-red-500 mr-2"
      />
      Tampilkan hanya stok kritis/habis
    </label>
  </div>
</template>
