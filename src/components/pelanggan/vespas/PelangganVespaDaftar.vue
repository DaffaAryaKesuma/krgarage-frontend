<script setup lang="ts">
// Kartu untuk menampilkan satu Vespa milik pelanggan.
import PelangganVespaKartu from "./PelangganVespaKartu.vue";
// Komponen umum untuk kondisi loading dan data kosong.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Class kartu tambah Vespa diambil dari helper agar konsisten.
import {
  ADD_ACTION_ICON_WRAPPER_CLASS,
  ADD_ACTION_SUBTITLE_CLASS,
  ADD_ACTION_TITLE_CLASS,
  getAddActionCardClass,
} from "@/utils/selectionVariants";
// Tipe data Vespa dari folder types.
import type { VespaDetail } from "@/types/vespa";

// Props berisi daftar Vespa dan status loading dari halaman induk.
interface Props {
  vespas: VespaDetail[];
  isLoading?: boolean;
}

// Default loading false supaya komponen tetap aman meskipun parent tidak mengirim isLoading.
withDefaults(defineProps<Props>(), {
  isLoading: false,
});

// Event dikirim ke parent untuk edit, hapus, dan tambah Vespa.
const emit = defineEmits<{
  edit: [vespa: VespaDetail];
  delete: [vespa: VespaDetail];
  addNew: [];
}>();
</script>

<template>
  <!-- Section pembungkus daftar Vespa. -->
  <section class="mb-8">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3"></div>
    </div>

    <div class="bg-transparent">
      <!-- Tampilkan spinner saat data sedang dimuat. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />
      <!-- Jika pelanggan belum punya Vespa, tampilkan empty state. -->
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

      <!-- Grid daftar Vespa yang sudah terdaftar. -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PelangganVespaKartu
          v-for="vespa in vespas"
          :key="vespa.id"
          :vespa="vespa"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />

        <!-- Kartu tambah Vespa dibuat satu grid dengan kartu lain. -->
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
