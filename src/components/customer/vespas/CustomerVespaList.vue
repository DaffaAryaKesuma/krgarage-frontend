<script setup lang="ts">
import CustomerVespaCard from "./CustomerVespaCard.vue";
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
  <section class="bg-white rounded-xl shadow-md overflow-hidden">
    <div
      class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white"
    >
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <i class="mdi mdi-format-list-bulleted text-red-600"></i>
        Daftar Vespa Anda
      </h2>
    </div>
    <div class="p-6">
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />
      <EmptyState
        v-else-if="vespas.length === 0"
        icon="mdi mdi-motorbike"
        title="Belum Ada Vespa"
        message="Anda belum menambahkan Vespa. Tambahkan Vespa pertama Anda untuk mulai pemesanan servis!"
        action-text="Tambah Vespa"
        @action="emit('addNew')"
      />

      <!-- Vespa Cards Grid -->
      <div
        v-else
        class="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <CustomerVespaCard
          v-for="vespa in vespas"
          :key="vespa.id"
          :vespa="vespa"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>
  </section>
</template>
