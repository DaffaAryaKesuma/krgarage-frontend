<script setup lang="ts">
import PelangganVespaKartu from "./PelangganVespaKartu.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import {
  ADD_ACTION_ICON_WRAPPER_CLASS,
  ADD_ACTION_SUBTITLE_CLASS,
  ADD_ACTION_TITLE_CLASS,
  getAddActionCardClass,
} from "@/utils/selectionVariants";
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
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3"></div>
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
          aksi-text="Tambah Vespa"
          @aksi="emit('addNew')"
        />
      </div>

      <!-- Vespa Kartu Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PelangganVespaKartu
          v-for="vespa in vespas"
          :key="vespa.id"
          :vespa="vespa"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />

        <!-- Add New Vespa Kartu -->
        <button
          @click="emit('addNew')"
          :class="
            getAddActionCardClass(
              'card',
              'min-h-[250px] rounded-2xl duration-300',
            )
          "
        >
          <div :class="['mb-4 h-14 w-14', ADD_ACTION_ICON_WRAPPER_CLASS]">
            <i class="mdi mdi-plus text-3xl"></i>
          </div>
          <h3 :class="[ADD_ACTION_TITLE_CLASS, 'text-lg font-bold']">
            Tambah Vespa
          </h3>
          <p :class="[ADD_ACTION_SUBTITLE_CLASS, 'mt-2 text-center text-sm']">
            Daftarkan Vespa baru Anda
          </p>
        </button>
      </div>
    </div>
  </section>
</template>
