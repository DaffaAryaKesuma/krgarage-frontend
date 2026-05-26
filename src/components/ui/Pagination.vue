<script setup lang="ts">
import { computed } from "vue";
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";

interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
  perPage?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

// Button states
const canPrevious = computed(() => props.currentPage > 1);
const canNext = computed(() => props.currentPage < props.lastPage);

// Calculate visible page numbers
const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 7;

  if (props.lastPage <= maxVisible) {
    for (let i = 1; i <= props.lastPage; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (props.currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(props.lastPage - 1, props.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (props.currentPage < props.lastPage - 2) {
      pages.push("...");
    }

    if (props.lastPage > 1) {
      pages.push(props.lastPage);
    }
  }

  return pages;
});

const getPaginationButtonClass = (isActive: boolean) =>
  getButtonClass(isActive ? "primary" : "secondary", "sm", "min-w-10");

const getPaginationIconButtonClass = () =>
  getIconButtonClass("neutral", "md", "border border-gray-300 bg-white");

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.lastPage && page !== props.currentPage) {
    emit("page-change", page);
  }
};
</script>

<template>
  <div
    v-if="total > (perPage || 10)"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200"
  >
    <!-- Info text (Selalu Muncul) -->
    <div class="text-sm text-gray-600">
      Menampilkan <span class="font-semibold">{{ total === 0 ? 0 : from }}</span> -
      <span class="font-semibold">{{ to }}</span> dari
      <span class="font-semibold">{{ total }}</span> pemesanan
    </div>

    <!-- Pagination buttons (Hanya Muncul jika lebih dari 1 halaman) -->
    <div v-if="lastPage > 1" class="flex items-center gap-1">
      <!-- Previous button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="!canPrevious"
        :class="getPaginationIconButtonClass()"
      >
        <i class="mdi mdi-chevron-left text-lg"></i>
      </button>

      <!-- Page numbers -->
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

      <!-- Next button -->
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
