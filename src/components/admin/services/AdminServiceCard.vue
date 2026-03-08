<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { getImageUrl, formatWaktu } from "@/utils/format";

interface Service {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string | null;
}

interface Props {
  service: Service;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [service: Service];
  delete: [service: Service];
}>();

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Tanpa+Gambar";

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
};
</script>

<template>
  <div
    class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-300"
  >
    <!-- Gambar -->
    <div
      class="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
    >
      <img
        :src="getImageUrl(service.gambar)"
        :alt="service.nama_layanan"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
      ></div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start gap-2 mb-3">
        <i class="mdi mdi-wrench text-2xl text-gray-600 flex-shrink-0"></i>
        <h3 class="text-lg font-bold text-gray-900 leading-tight">
          {{ service.nama_layanan }}
        </h3>
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-3">
        {{ service.deskripsi }}
      </p>

      <!-- Info Box -->
      <div
        class="bg-gray-100 p-3 rounded-lg mb-4 grid grid-cols-2 gap-2 text-sm"
      >
        <div>
          <p class="text-gray-600 text-xs">Estimasi Harga</p>
          <p class="font-bold text-red-600">
            {{ toIDR(service.harga) }}
          </p>
        </div>
        <div>
          <p class="text-gray-600 text-xs">Estimasi Durasi</p>
          <p class="font-bold text-blue-600">
            {{ formatWaktu(service.durasi_pengerjaan) }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="emit('edit', service)"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
        >
          <i class="mdi mdi-pencil"></i>
          <span>Edit</span>
        </button>
        <button
          @click="emit('delete', service)"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
        >
          <i class="mdi mdi-delete"></i>
          <span>Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>
