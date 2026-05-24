<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { Pemesanan, PemesananItem } from "@/types/pemesanan";

interface Props {
  layanan?: Pemesanan["layanan"];
  pemesananItems?: PemesananItem[];
  isInProgress: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  addSukuCadang: [];
  deleteItem: [itemId: number];
}>();
</script>

<template>
  <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <!-- Layanan -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3
        class="font-semibold text-gray-900 tracking-wide mb-3 flex items-center gap-2"
      >
        <i class="mdi mdi-wrench text-gray-600 text-xl"></i>
        Layanan
      </h3>
      <div class="space-y-2">
        <div
          v-for="item in layanan"
          :key="item.id"
          class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span class="font-medium text-sm text-gray-900">{{
              item.nama_layanan
            }}</span>
          </div>
          <span class="font-medium text-sm text-gray-900">{{
            toIDR(item.harga ?? 0)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Suku Cadang -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div class="flex justify-between items-center mb-3">
        <h3
          class="font-semibold text-gray-900 tracking-wide flex items-center gap-2"
        >
          <i class="mdi mdi-cog text-gray-600 text-xl"></i>
          Suku Cadang
        </h3>
        <button
          v-if="isInProgress"
          @click="emit('addSukuCadang')"
          class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition shadow-sm"
        >
          <i class="mdi mdi-plus"></i>
          <span>Tambah</span>
        </button>
      </div>

      <!-- SukuCadang Daftar -->
      <div v-if="pemesananItems?.length" class="space-y-2">
        <div
          v-for="item in pemesananItems"
          :key="item.id"
          class="group flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
        >
          <div class="flex-1">
            <span class="font-medium text-sm text-gray-900">{{
              item.nama_suku_cadang_saat_ini ||
              item.suku_cadang?.nama_suku_cadang ||
              "Suku Cadang Tidak Ditemukan"
            }}</span>
            <span class="text-sm text-gray-600 mx-3">x</span>
            <span class="text-sm text-gray-600">{{ item.jumlah }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-medium text-sm text-gray-900">
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
  </section>
</template>
