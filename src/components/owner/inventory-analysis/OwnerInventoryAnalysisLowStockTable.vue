<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";

interface LowStockItem {
  id: number;
  nama_barang: string;
  kategori: string;
  jumlah_stok: number;
  minimum_stok: number;
  harga_beli: number;
}

interface Props {
  items: LowStockItem[];
  loading: boolean;
}

const props = defineProps<Props>();

const STOCK_STATUS = {
  habis: { label: "Habis", class: "bg-red-100 text-red-800" },
  kritis: { label: "Kritis", class: "bg-orange-100 text-orange-800" },
  rendah: { label: "Rendah", class: "bg-yellow-100 text-yellow-800" },
};

const getStockStatus = (stock: number, minStock: number) => {
  if (stock === 0) return STOCK_STATUS.habis;
  if (stock <= minStock) return STOCK_STATUS.kritis;
  return STOCK_STATUS.rendah;
};

const totalRestockCost = computed(() =>
  props.items.reduce(
    (sum, item) =>
      sum + (item.minimum_stok - item.jumlah_stok + 10) * item.harga_beli,
    0,
  ),
);
</script>

<template>
  <div
    class="rounded-2xl bg-white p-6 shadow-lg mb-8 border-l-4 border-red-500"
  >
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-red-100 p-3">
          <i class="mdi mdi-alert-circle text-2xl text-red-600"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            Stok Menipis
          </h2>
          <p class="text-sm text-gray-600">
            Barang yang perlu segera dibelanjakan ulang saat ini
          </p>
        </div>
      </div>
      <div
        v-if="items.length > 0"
        class="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 flex-shrink-0"
      >
        <div class="h-2 w-2 animate-pulse rounded-full bg-red-600"></div>
        <span class="text-sm font-bold text-red-700"
          >{{ items.length }} Item</span
        >
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <div v-else-if="items.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-gray-600">
            <th class="pb-3 font-semibold pl-2">Nama Barang</th>
            <th class="pb-3 font-semibold">Stok</th>
            <th class="pb-3 font-semibold">Min</th>
            <th class="pb-3 font-semibold">Harga Beli</th>
            <th class="pb-3 font-semibold">Est. Pembelian</th>
            <th class="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-red-50 transition-colors"
          >
            <td class="py-3 pl-2">
              <div class="font-bold text-gray-900">
                {{ item.nama_barang }}
              </div>
              <div class="text-xs text-gray-600">{{ item.kategori }}</div>
            </td>
            <td class="py-3">
              <span
                :class="[
                  'text-lg font-bold',
                  item.jumlah_stok === 0 ? 'text-red-600' : 'text-orange-600',
                ]"
              >
                {{ item.jumlah_stok }}
              </span>
            </td>
            <td class="py-3 text-gray-700">{{ item.minimum_stok }}</td>
            <td class="py-3 font-semibold">
              {{ toIDR(item.harga_beli) }}
            </td>
            <td class="py-3">
              <div class="font-bold text-red-600">
                {{
                  toIDR(
                    (item.minimum_stok - item.jumlah_stok + 10) *
                      item.harga_beli,
                  )
                }}
              </div>
              <div class="text-xs text-gray-600">
                ~{{ item.minimum_stok - item.jumlah_stok + 10 }} unit
              </div>
            </td>
            <td class="py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  getStockStatus(item.jumlah_stok, item.minimum_stok).class,
                ]"
              >
                {{ getStockStatus(item.jumlah_stok, item.minimum_stok).label }}
              </span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-gray-300 bg-gray-50">
            <td
              colspan="4"
              class="py-3 font-bold text-gray-900 text-right pr-4"
            >
              Total Estimasi Biaya Restock:
            </td>
            <td class="py-3 text-lg font-bold text-red-600">
              {{ toIDR(totalRestockCost) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div
      v-else
      class="rounded-xl bg-green-50 py-8 text-center border border-green-100"
    >
      <i class="mdi mdi-check-circle text-5xl text-green-500"></i>
      <p class="mt-3 text-lg font-bold text-green-700">Semua Stok Aman! 🎉</p>
      <p class="mt-1 text-sm text-green-600">
        Tidak ada barang yang perlu di-restock saat ini
      </p>
    </div>
  </div>
</template>
