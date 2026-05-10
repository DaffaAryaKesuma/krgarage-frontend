<script setup lang="ts">
import PelangganVespaCard from "./PelangganVespaCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import type { VespaDetail } from "@/types/vespa";

interface Props {
  vespas: VespaDetail[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  edit: [vespa: VespaDetail];
  delete: [vespa: VespaDetail];
  addNew: [];
}>();
</script>

<template>
  <section class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"
        >
          <i class="mdi mdi-format-list-bulleted text-xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
          Koleksi Vespa
        </h2>
      </div>
    </div>

    <div class="bg-transparent">
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />
      <div
        v-else-if="vespas.length === 0"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <EmptyState
          icon="mdi mdi-motorbike"
          title="Belum Ada Vespa"
          message="Anda belum menambahkan Vespa. Tambahkan Vespa pertama Anda untuk mulai pemesanan servis!"
          action-text="Tambah Vespa"
          @action="emit('addNew')"
        />
      </div>

      <!-- Vespa Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PelangganVespaCard
          v-for="vespa in vespas"
          :key="vespa.id"
          :vespa="vespa"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />

        <!-- Add New Vespa Card -->
        <button
          @click="emit('addNew')"
          class="bg-transparent border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-red-500 hover:bg-red-50 transition-all duration-300 flex flex-col items-center justify-center min-h-[250px] group cursor-pointer"
        >
          <div
            class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 transition-colors mb-4"
          >
            <i class="mdi mdi-plus text-3xl"></i>
          </div>
          <h3
            class="font-bold text-gray-600 group-hover:text-red-600 transition-colors text-lg"
          >
            Tambah Vespa
          </h3>
          <p
            class="text-sm text-gray-400 group-hover:text-red-400 text-center mt-2"
          >
            Daftarkan Vespa baru Anda
          </p>
        </button>
      </div>
    </div>
  </section>
</template>
