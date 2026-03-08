<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface BookingItem {
  id: number;
  suku_cadang: {
    id: number;
    nama_suku_cadang: string;
    kategori: string;
  };
  jumlah: number;
  harga_saat_ini: number;
}

interface Props {
  bookingItems?: BookingItem[];
  isInProgress: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  addSparepart: [];
  deleteItem: [itemId: number];
}>();
</script>

<template>
  <div class="border-t border-gray-100 pt-6">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Suku Cadang
      </h3>
      <button
        v-if="isInProgress"
        @click="emit('addSparepart')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Suku Cadang</span>
      </button>
    </div>

    <!-- Sparepart List -->
    <div v-if="bookingItems?.length" class="space-y-2">
      <div
        v-for="item in bookingItems"
        :key="item.id"
        class="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
      >
        <div class="flex-1">
          <span class="font-medium text-gray-900">{{
            item.suku_cadang.nama_suku_cadang
          }}</span>
          <p class="text-sm text-gray-600 mt-1">
            {{ item.jumlah }} × {{ toIDR(item.harga_saat_ini) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-bold text-gray-900">
            {{ toIDR(item.harga_saat_ini * item.jumlah) }}
          </span>
          <button
            v-if="isInProgress"
            @click="emit('deleteItem', item.id)"
            class="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
            title="Hapus"
          >
            <i class="mdi mdi-delete"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
      <i class="mdi mdi-package-variant text-3xl mb-2"></i>
      <p class="text-sm">Belum ada suku cadang yang digunakan</p>
    </div>
  </div>
</template>
