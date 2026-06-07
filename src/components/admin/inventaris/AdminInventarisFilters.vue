<script setup lang="ts">
// CustomSelect untuk filter kategori.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Helper class tombol dan input.
import { getButtonClass } from "@/utils/buttonVariants";
import { getFormCheckboxClass, getFormInputClass } from "@/utils/formVariants";

// Props filter inventaris dari halaman.
interface Props {
  searchQuery: string;
  selectedKategori: string;
  showLowStock: boolean;
  kategoriOptions: Array<{ value: string; label: string }>;
}

defineProps<Props>();

// Event v-model filter dan event tambah data.
const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedKategori": [value: string];
  "update:showLowStock": [value: boolean];
  addNew: [];
}>();

// Ubah kategori lalu kirim ke parent.
const handleKategoriChange = (value: string | number | null) => {
  emit("update:selectedKategori", String(value || ""));
};
</script>

<template>
  <!-- Wrapper filter inventaris. -->
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <!-- Search, kategori, dan tombol tambah. -->
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
        :class="getFormInputClass(false, 'md:col-span-2')"
      />
      <!-- Filter kategori. -->
      <CustomSelect
        :model-value="selectedKategori"
        @update:model-value="handleKategoriChange"
        :options="kategoriOptions"
        placeholder="Semua kategori"
      />
      <!-- Tombol membuka modal tambah suku cadang. -->
      <button
        @click="emit('addNew')"
        type="button"
        :class="getButtonClass('primary', 'md', 'flex w-full items-center justify-center gap-2 md:col-span-2 lg:col-span-1')"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Suku Cadang</span>
      </button>
    </div>

    <!-- Checkbox khusus stok kritis/habis. -->
    <div class="flex items-center text-sm text-gray-700">
      <input
        :checked="showLowStock"
        @change="
          emit(
            'update:showLowStock',
            ($event.target as HTMLInputElement).checked,
          )
        "
        type="checkbox"
        :class="getFormCheckboxClass('mr-2')"
      />
      <span>Tampilkan hanya stok kritis/habis</span>
    </div>
  </div>
</template>
