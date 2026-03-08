<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface Sparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  is_low_stock: boolean;
}

interface Props {
  spareparts: Sparepart[];
}

defineProps<Props>();

const emit = defineEmits<{
  restock: [sparepart: Sparepart];
  edit: [sparepart: Sparepart];
  delete: [id: number];
}>();

const TABLE_HEADERS = [
  "Suku Cadang",
  "Kategori",
  "Stok",
  "Harga Beli",
  "Harga Jual",
  "Aksi",
];
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in TABLE_HEADERS"
              :key="header"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="sparepart in spareparts"
            :key="sparepart.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ sparepart.nama_suku_cadang }}
              </div>
              <div class="text-xs text-gray-500">
                {{ sparepart.deskripsi }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold">
                {{ sparepart.kategori }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-sm',
                    sparepart.is_low_stock
                      ? 'text-red-600 font-bold'
                      : 'text-gray-900',
                  ]"
                >
                  {{ sparepart.jumlah_stok }}
                </span>
                <span
                  v-if="sparepart.is_low_stock"
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                >
                  Rendah
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ toIDR(sparepart.harga_beli) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ toIDR(sparepart.harga_jual) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2">
                <button
                  @click="emit('restock', sparepart)"
                  class="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                  title="Tambah Stok"
                >
                  <i class="mdi mdi-plus"></i>
                </button>
                <button
                  @click="emit('edit', sparepart)"
                  class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  title="Ubah"
                >
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button
                  @click="emit('delete', sparepart.id)"
                  class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Hapus"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="spareparts.length === 0" class="text-center py-12">
      <i class="mdi mdi-package-variant text-4xl text-gray-400 mb-2"></i>
      <p class="text-gray-600">Tidak ada suku cadang ditemukan</p>
    </div>
  </div>
</template>
