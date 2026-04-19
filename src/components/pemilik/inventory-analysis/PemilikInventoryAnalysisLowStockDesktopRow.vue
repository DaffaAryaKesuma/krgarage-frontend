<script setup lang="ts">
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
  item: LowStockItem;
  stockStatusLabel: string;
  stockStatusClass: string;
  outOfStock: boolean;
}

defineProps<Props>();
</script>

<template>
  <tr class="hover:bg-red-50 transition-colors">
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
          outOfStock ? 'text-red-600' : 'text-orange-600',
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
      <span
        :class="[
          'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
          stockStatusClass,
        ]"
      >
        {{ stockStatusLabel }}
      </span>
    </td>
  </tr>
</template>
