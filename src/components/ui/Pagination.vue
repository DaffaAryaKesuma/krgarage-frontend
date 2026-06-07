<script setup lang="ts">
import { computed } from "vue";
// Helper class tombol agar pagination konsisten.
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";

// Props pagination biasanya berasal dari meta API.
interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
  perPage?: number;
  itemLabel?: string;
}

const props = defineProps<Props>();

// Event page-change dikirim saat user memilih halaman lain.
const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

// Tombol previous aktif jika currentPage lebih dari 1.
const canPrevious = computed(() => props.currentPage > 1);
// Tombol next aktif jika currentPage belum mencapai halaman terakhir.
const canNext = computed(() => props.currentPage < props.lastPage);

// Menghitung nomor halaman yang perlu ditampilkan.
const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 7;

  // Jika total halaman sedikit, tampilkan semua.
  if (props.lastPage <= maxVisible) {
    for (let i = 1; i <= props.lastPage; i++) {
      pages.push(i);
    }
  } else {
    // Jika banyak halaman, tampilkan halaman pertama, sekitar current, dan terakhir.
    pages.push(1);

    // Titik-titik awal jika currentPage sudah jauh dari halaman 1.
    if (props.currentPage > 3) {
      pages.push("...");
    }

    // Halaman tengah di sekitar currentPage.
    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(props.lastPage - 1, props.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Titik-titik akhir jika currentPage masih jauh dari halaman terakhir.
    if (props.currentPage < props.lastPage - 2) {
      pages.push("...");
    }

    // Selalu tampilkan halaman terakhir.
    if (props.lastPage > 1) {
      pages.push(props.lastPage);
    }
  }

  return pages;
});

// Class tombol nomor halaman, active memakai warna primary.
const getPaginationButtonClass = (isActive: boolean) =>
  getButtonClass(isActive ? "primary" : "secondary", "sm", "min-w-10");

// Class tombol icon previous/next.
const getPaginationIconButtonClass = () =>
  getIconButtonClass("neutral", "md", "border border-gray-300 bg-white");

// Pindah halaman hanya jika page valid dan berbeda dari halaman sekarang.
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.lastPage && page !== props.currentPage) {
    emit("page-change", page);
  }
};
</script>

<template>
  <!-- Pagination hanya tampil jika total data lebih besar dari perPage. -->
  <div
    v-if="total > (perPage || 10)"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200"
  >
    <!-- Info range data yang sedang ditampilkan. -->
    <div class="text-sm text-gray-600">
      Menampilkan
      <span class="font-semibold">{{ to }}</span> dari
      <span class="font-semibold">{{ total }}</span>
      {{ itemLabel || "pemesanan" }}
    </div>

    <!-- Tombol pagination hanya muncul jika lebih dari 1 halaman. -->
    <div v-if="lastPage > 1" class="flex items-center gap-1">
      <!-- Tombol halaman sebelumnya. -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="!canPrevious"
        :class="getPaginationIconButtonClass()"
      >
        <i class="mdi mdi-chevron-left text-lg"></i>
      </button>

      <!-- Nomor halaman dan titik-titik. -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <span v-if="page === '...'" class="px-3 py-2 text-gray-500 text-sm">
          ...
        </span>
        <button
          v-else
          @click="goToPage(page as number)"
          :class="getPaginationButtonClass(currentPage === page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Tombol halaman berikutnya. -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="!canNext"
        :class="getPaginationIconButtonClass()"
      >
        <i class="mdi mdi-chevron-right text-lg"></i>
      </button>
    </div>
  </div>
</template>
