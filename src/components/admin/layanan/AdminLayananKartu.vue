<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { getImageUrl, formatWaktu } from "@/utils/format";
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";
import type { LayananCatalogItem } from "@/types/layanan";

interface Props {
  layanan: LayananCatalogItem;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [layanan: LayananCatalogItem];
  delete: [layanan: LayananCatalogItem];
}>();

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Tanpa+Gambar";

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
};
</script>

<template>
  <div
    class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
  >
    <!-- Gambar -->
    <div
      class="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
    >
      <img
        :src="getImageUrl(layanan.gambar)"
        :alt="layanan.nama_layanan"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
      ></div>
    </div>

    <!-- Content -->
    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-start gap-2 mb-3">
        <i class="mdi mdi-wrench text-2xl text-gray-600 flex-shrink-0"></i>
        <h3 class="text-lg font-bold text-gray-900 leading-tight">
          {{ layanan.nama_layanan }}
        </h3>
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-3">
        {{ layanan.deskripsi }}
      </p>

      <!-- Info Box -->
      <div class="mb-4 mt-auto grid grid-cols-2 gap-2">
        <div :class="[getAlertBoxClass('info'), 'rounded p-2 shadow-none']">
          <p :class="META_LABEL_CLASS">Harga</p>
          <p class="text-sm font-bold" :class="getToneTextClass('info')">
            {{ toIDR(layanan.harga) }}
          </p>
        </div>
        <div :class="[getAlertBoxClass('success'), 'rounded p-2 shadow-none']">
          <p :class="META_LABEL_CLASS">Durasi</p>
          <p class="text-sm font-bold" :class="getToneTextClass('success')">
            {{ formatWaktu(layanan.durasi_pengerjaan) }}
          </p>
        </div>
      </div>

      <!-- Aksi -->
      <div class="flex gap-3">
        <button
          @click="emit('edit', layanan)"
          :class="getButtonClass('primary', 'md', 'flex-1 shadow-md')"
        >
          <i class="mdi mdi-pencil"></i>
          <span>Edit</span>
        </button>
        <button
          @click="emit('delete', layanan)"
          :class="getButtonClass('danger', 'md', 'flex-1 shadow-md')"
        >
          <i class="mdi mdi-delete"></i>
          <span>Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>
