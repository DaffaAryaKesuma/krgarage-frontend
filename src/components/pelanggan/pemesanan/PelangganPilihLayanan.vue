<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatWaktu, getImageUrl } from "@/utils/format";
import type { LayananCatalogItem } from "@/types/layanan";

interface Props {
  layanan: LayananCatalogItem[];
  modelValue: number[];
  error?: string;
  touched?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: number[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toggleLayanan = (id: number) => {
  const selectedIds = [...props.modelValue];
  const idx = selectedIds.indexOf(id);

  if (idx === -1) {
    selectedIds.push(id);
  } else {
    selectedIds.splice(idx, 1);
  }

  emit("update:modelValue", selectedIds);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
      >
        <i class="mdi mdi-wrench text-xl text-red-600"></i>
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
          Pilih Layanan
        </h2>
        <p class="text-sm text-gray-500">
          Pilih satu atau lebih layanan yang Anda butuhkan
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in layanan"
        :key="item.id"
        @click="toggleLayanan(item.id)"
        :class="[
          'group relative bg-white rounded-xl border-2 cursor-pointer transition-all duration-200',
          modelValue.includes(item.id)
            ? 'border-green-500 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md',
        ]"
      >
        <!-- Gambar -->
        <div class="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            :src="getImageUrl(item.gambar)"
            :alt="item.nama_layanan"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            @error="
              (e: Event) =>
                ((e.target as HTMLImageElement).src =
                  'https://placehold.co/600x400?text=Tidak+Ada+Gambar')
            "
          />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"
          ></div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="font-bold text-gray-900 text-base mb-2">
            {{ item.nama_layanan }}
          </h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ item.deskripsi }}
          </p>

          <!-- Info -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="bg-red-50 p-2 rounded border border-red-200">
              <p class="text-xs text-gray-600">Harga</p>
              <p class="text-sm font-bold text-red-600">
                {{ toIDR(item.harga) }}
              </p>
            </div>
            <div class="bg-green-50 p-2 rounded border border-green-200">
              <p class="text-xs text-gray-600">Durasi</p>
              <p class="text-sm font-bold text-green-600">
                {{ formatWaktu(item.durasi_pengerjaan) }}
              </p>
            </div>
          </div>

          <!-- Checkbox -->
          <div
            class="flex items-center justify-between pt-2 border-t border-gray-200"
          >
            <span class="text-xs font-semibold text-gray-700"
              >Pilih layanan</span
            >
            <div
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                modelValue.includes(item.id)
                  ? 'bg-green-500 border-green-600'
                  : 'border-gray-300',
              ]"
            >
              <i
                v-if="modelValue.includes(item.id)"
                class="mdi mdi-check text-white text-sm"
              ></i>
            </div>
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
