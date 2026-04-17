<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  show: boolean;
  loading?: boolean;
  bookingCode?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", note: string): void;
}>();

const note = ref("");

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      note.value = "";
    }
  },
);

const closeModal = () => {
  emit("close");
};

const submit = () => {
  const trimmedNote = note.value.trim();
  if (!trimmedNote) {
    return;
  }

  emit("confirm", trimmedNote);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full">
      <div
        class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-xl"
      >
        <h3 class="text-xl font-bold text-white">Selesaikan Pekerjaan</h3>
        <p class="text-green-50 text-sm mt-1" v-if="bookingCode">
          Kode Pemesanan: {{ bookingCode }}
        </p>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-sm text-gray-700">
          Tuliskan catatan mekanik untuk pelanggan. Catatan ini akan disimpan
          saat pekerjaan diselesaikan.
        </p>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Mekanik
          </label>
          <textarea
            v-model="note"
            rows="4"
            maxlength="1000"
            placeholder="Contoh: Keluhan bunyi kasar pada mesin sudah diatasi, oli mesin dan filter udara sudah diganti."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
          <div class="mt-1 text-right text-xs text-gray-500">
            {{ note.length }}/1000
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="closeModal"
            :disabled="loading"
            class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
          >
            Batal
          </button>
          <button
            @click="submit"
            :disabled="loading || !note.trim()"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Selesaikan Pekerjaan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
