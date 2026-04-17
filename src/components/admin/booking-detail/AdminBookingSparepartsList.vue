<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { BookingItem } from "@/types/booking";

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
  <div>
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-semibold text-gray-900 tracking-wide">
        <i class="mdi mdi-cog text-orange-600 text-xl"></i>
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
        class="group flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
      >
        <div class="flex-1">
          <span class="font-medium text-gray-900">{{
            item.suku_cadang.nama_suku_cadang
          }}</span>
          <span class="text-sm text-gray-600 mx-3">x</span>
          <span class="text-sm text-gray-600">{{ item.jumlah }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-medium text-gray-900">
            {{ toIDR(item.harga_saat_ini * item.jumlah) }}
          </span>
          <button
            v-if="isInProgress"
            @click="emit('deleteItem', item.id)"
            class="rounded-lg p-2 text-red-600 transition hover:bg-red-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
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
