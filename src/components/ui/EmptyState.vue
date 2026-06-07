<script setup lang="ts">
// Helper class tombol supaya gaya tombol konsisten dengan komponen lain.
import { getButtonClass } from "@/utils/buttonVariants";

// Props adalah data yang dikirim parent untuk mengisi empty state.
interface Props {
  icon: string;
  title: string;
  message: string;
  aksiText?: string;
  aksiLink?: string;
  aksiIcon?: string;
}

// EmptyState hanya menerima props, tidak punya state internal.
defineProps<Props>();

// Event aksi dikirim saat tombol biasa diklik.
const emit = defineEmits<{
  (e: "aksi"): void;
}>();

// Class tombol dibuat sekali agar tidak ditulis panjang di template.
const BUTTON_CLASS = getButtonClass(
  "primary",
  "lg",
  "shadow-lg hover:shadow-xl hover:scale-105",
);
</script>

<template>
  <!-- Tampilan saat data kosong, misalnya belum ada layanan/pemesanan. -->
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <!-- Icon utama empty state. -->
    <div class="mb-6 opacity-50">
      <i :class="icon + ' text-8xl'"></i>
    </div>

    <!-- Judul kondisi kosong. -->
    <h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">{{ title }}</h3>

    <!-- Pesan penjelasan singkat. -->
    <p class="text-gray-600 text-center max-w-md mb-8">{{ message }}</p>

    <!-- Jika aksiLink ada, tombol menjadi router-link. -->
    <router-link
      v-if="aksiLink && aksiText"
      :to="aksiLink"
      :class="BUTTON_CLASS"
    >
      {{ aksiText }}<i v-if="aksiIcon" :class="aksiIcon + ' ml-1'"></i>
    </router-link>
    <!-- Jika tidak ada aksiLink, tombol mengirim event aksi ke parent. -->
    <button
      v-else-if="aksiText"
      @click="emit('aksi')"
      :class="BUTTON_CLASS"
    >
      {{ aksiText }}<i v-if="aksiIcon" :class="aksiIcon + ' ml-1'"></i>
    </button>
  </div>
</template>
