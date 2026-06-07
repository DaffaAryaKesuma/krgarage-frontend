<script setup lang="ts">
import { ref, onMounted } from "vue";
// Mengambil warna solid berdasarkan tipe toast.
import { getSolidToneClass } from "@/utils/badgeVariants";
import type { SolidToneKey } from "@/utils/badgeVariants";

// Bentuk satu toast yang ditampilkan.
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

// Props berisi data toast.
const props = defineProps<{
  toast: Toast;
}>();

// Event remove dikirim setelah animasi keluar selesai.
const emit = defineEmits<{
  (e: "remove", id: number): void;
}>();

// State animasi masuk/keluar.
const isVisible = ref(false);

// Saat mounted, jalankan animasi masuk lalu auto-close sesuai durasi.
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 10);

  // Durasi bisa dikirim per toast, fallback 3000 ms.
  const duration = props.toast.duration || 3000;
  setTimeout(() => {
    handleClose();
  }, duration);
});

// Menutup toast dengan animasi, lalu minta parent menghapus data toast.
function handleClose() {
  isVisible.value = false;
  setTimeout(() => {
    emit("remove", props.toast.id);
  }, 300);
}

// Mapping tipe toast ke tone warna.
const typeToneMap: Record<Toast["type"], SolidToneKey> = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "info",
};

// Icon teks sederhana per tipe toast.
const typeIcons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};
</script>

<template>
  <!-- Card toast dengan animasi slide dari kanan. -->
  <div
    :class="[
      'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 text-white min-w-[300px] max-w-md transition-all duration-300 transform',
      getSolidToneClass(typeToneMap[toast.type]),
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
    ]"
  >
    <!-- Icon toast. -->
    <div class="text-2xl font-bold">
      {{ typeIcons[toast.type] }}
    </div>
    <!-- Pesan toast. -->
    <div class="flex-1 font-medium">
      {{ toast.message }}
    </div>
  </div>
</template>
