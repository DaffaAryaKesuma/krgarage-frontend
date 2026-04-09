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
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      <input
        :value="searchQuery"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
        type="text"
        placeholder="Cari suku cadang..."
        class="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <CustomSelect
        :model-value="selectedKategori"
        @update:model-value="handleKategoriChange"
        :options="kategoriOptions"
        placeholder="Semua kategori"
      />
      <button
        @click="emit('addNew')"
        class="md:col-span-2 xl:col-span-1 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
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
      Tampilkan hanya stok rendah
    </label>
  </div>
</template>
