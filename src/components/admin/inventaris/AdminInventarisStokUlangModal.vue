<script setup lang="ts">
import { computed } from "vue";
import type { InventarisSukuCadang } from "@/types/inventaris";
import { scrollLock } from "@/composables/scrollLock";
import { toIDR } from "@/utils/money";

interface Props {
  show: boolean;
  selectedSukuCadang: InventarisSukuCadang | null;
  restockQuantity: number;
  restockUnitPrice: number;
  restockUpdateMasterPrice: boolean;
  restockNote: string;
  loading: boolean;
}

const props = defineProps<Props>();

scrollLock(() => props.show);

const emit = defineEmits<{
  close: [];
  submit: [];
  "update:restockQuantity": [value: number];
  "update:restockUnitPrice": [value: number];
  "update:restockUpdateMasterPrice": [value: boolean];
  "update:restockNote": [value: string];
}>();

const totalPengeluaran = computed(
  () => props.restockQuantity * props.restockUnitPrice,
);

const modalKartuClass = "rounded-2xl border border-gray-200 bg-gray-50 p-4";
const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 ";
const buttonBaseClass =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const buttonPrimaryClass = `${buttonBaseClass} bg-green-600 text-white hover:bg-green-700`;
const buttonSecondaryClass = `${buttonBaseClass} border border-gray-300 text-gray-700 hover:bg-gray-100`;
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center"
    @click.self="emit('close')"
  >
    <div
      class="my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 sm:my-0"
    >
      <div class="shrink-0 border-b border-gray-200 px-6 py-5">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600"
          >
            <i class="mdi mdi-package-variant-closed text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Tambah Stok Suku Cadang
            </h2>
          </div>
        </div>
      </div>

      <form
        @submit.prevent="emit('submit')"
        class="flex min-h-0 flex-1 flex-col"
      >
        <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        <div :class="modalKartuClass">
          <p class="mt-1 text-lg font-bold text-gray-900">
            {{ selectedSukuCadang?.nama_suku_cadang }}
          </p>
          <div
            class="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <p class="text-sm font-medium text-gray-600">Stok Saat Ini</p>
            </div>
            <span
              :class="[
                'rounded-lg px-3 py-1 text-sm font-bold',
                selectedSukuCadang?.stok_menipis
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600',
              ]"
            >
              {{ selectedSukuCadang?.jumlah_stok }}
            </span>
          </div>
        </div>

        <div :class="modalKartuClass">
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Jumlah Tambahan
          </label>
          <input
            :value="restockQuantity"
            @input="
              emit(
                'update:restockQuantity',
                Number(($event.target as HTMLInputElement).value),
              )
            "
            type="number"
            min="1"
            required
            placeholder="Masukkan jumlah tambahan"
            :class="inputClass"
          />
        </div>

        <div :class="modalKartuClass">
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Harga Beli per Unit
          </label>
          <input
            :value="restockUnitPrice"
            @input="
              emit(
                'update:restockUnitPrice',
                Number(($event.target as HTMLInputElement).value),
              )
            "
            type="number"
            min="0"
            required
            placeholder="Masukkan harga beli per unit"
            :class="inputClass"
          />
          <p class="mt-2 text-xs text-gray-500">
            Harga master saat ini:
            <span class="font-semibold text-gray-700">
              {{ toIDR(selectedSukuCadang?.harga_beli || 0) }}
            </span>
          </p>
        </div>

        <label
          class="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700"
        >
          <input
            :checked="restockUpdateMasterPrice"
            @change="
              emit(
                'update:restockUpdateMasterPrice',
                ($event.target as HTMLInputElement).checked,
              )
            "
            type="checkbox"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span>
            <span class="block font-semibold text-gray-900">
              Update harga beli master
            </span>
            <span class="block text-xs text-gray-500">
              Centang jika harga beli terbaru ini ingin dipakai sebagai harga aktif.
            </span>
          </span>
        </label>

        <div :class="modalKartuClass">
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Catatan
          </label>
          <textarea
            :value="restockNote"
            @input="
              emit(
                'update:restockNote',
                ($event.target as HTMLTextAreaElement).value,
              )
            "
            rows="2"
            placeholder="Opsional"
            :class="inputClass"
          ></textarea>
        </div>

        <div
          v-if="restockQuantity > 0"
          class="rounded-2xl border border-gray-200 bg-gray-50 p-4"
        >
          <div class="space-y-2 text-sm text-gray-700">
            <p>
              Estimasi stok baru:
              <span class="font-black text-green-600">
                {{ (selectedSukuCadang?.jumlah_stok || 0) + restockQuantity }}
              </span>
            </p>
            <p>
              Total pengeluaran:
              <span class="font-black text-red-600">
                {{ toIDR(totalPengeluaran) }}
              </span>
            </p>
          </div>
        </div>
        </div>

        <div
          class="grid shrink-0 grid-cols-2 gap-3 border-t border-gray-200 bg-white p-5 sm:flex-row sm:justify-end sm:p-6"
        >
          <button
            type="button"
            @click="emit('close')"
            :class="buttonSecondaryClass"
          >
            Batal
          </button>
          <button type="submit" :class="buttonPrimaryClass" :disabled="loading">
            <i v-if="loading" class="mdi mdi-loading mdi-spin mr-2"></i>
            {{ loading ? "Memproses..." : "Tambah Stok" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
