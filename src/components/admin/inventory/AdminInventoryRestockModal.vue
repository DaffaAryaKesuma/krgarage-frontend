<script setup lang="ts">
interface Sparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

interface Props {
  show: boolean;
  selectedSparepart: Sparepart | null;
  restockQuantity: number;
  loading: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [];
  "update:restockQuantity": [value: number];
}>();
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-xl max-w-md w-full">
      <div class="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <h2 class="text-2xl font-bold">Tambah Stok Suku Cadang</h2>
      </div>

      <form @submit.prevent="emit('submit')" class="p-6 space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Suku Cadang:</p>
          <p class="text-lg font-bold text-gray-900">
            {{ selectedSparepart?.nama_suku_cadang }}
          </p>
          <p class="text-sm text-gray-600 mt-3">
            Stok Saat Ini:
            <span
              :class="[
                'font-bold',
                selectedSparepart?.stok_menipis
                  ? 'text-red-600'
                  : 'text-gray-900',
              ]"
            >
              {{ selectedSparepart?.jumlah_stok }}
            </span>
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Tambahan *
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Masukkan jumlah"
          />
        </div>

        <div
          v-if="restockQuantity > 0"
          class="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-sm text-gray-700">
            Stok Baru:
            <span class="font-bold text-green-600">
              {{ (selectedSparepart?.jumlah_stok || 0) + restockQuantity }}
            </span>
          </p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "Memproses..." : "Tambah Stok" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
