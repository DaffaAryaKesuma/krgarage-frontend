<script setup lang="ts">
import type { InventarisSukuCadang } from "@/types/inventaris";
import { scrollLock } from "@/composables/scrollLock";

interface Props {
  show: boolean;
  selectedSukuCadang: InventarisSukuCadang | null;
  restockQuantity: number;
  loading: boolean;
}

const props = defineProps<Props>();

scrollLock(() => props.show);

const emit = defineEmits<{
  close: [];
  submit: [];
  "update:restockQuantity": [value: number];
}>();

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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <div class="border-b border-gray-200 px-6 py-5">
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

      <form @submit.prevent="emit('submit')" class="space-y-4 p-6">
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

        <div
          v-if="restockQuantity > 0"
          class="rounded-2xl border border-gray-200 bg-gray-50 p-4"
        >
          <p class="text-sm text-gray-700">
            Estimasi stok baru:
            <span class="font-black text-green-600">
              {{ (selectedSukuCadang?.jumlah_stok || 0) + restockQuantity }}
            </span>
          </p>
        </div>

        <div
          class="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end"
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
