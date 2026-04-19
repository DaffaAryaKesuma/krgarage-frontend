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
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="font-semibold text-gray-900">{{ item.nama_barang }}</p>
        <p class="text-xs text-gray-500">{{ item.kategori }}</p>
      </div>
      <span
        :class="[
          'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
          stockStatusClass,
        ]"
      >
        {{ stockStatusLabel }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Stok
        </p>
        <p
          :class="[
            'font-bold',
            outOfStock ? 'text-red-600' : 'text-orange-600',
          ]"
        >
          {{ item.jumlah_stok }}
        </p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Minimum
        </p>
        <p class="font-medium text-gray-900">{{ item.minimum_stok }}</p>
      </div>
      <div>
        <p
          class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
        >
          Harga Beli
        </p>
        <p class="font-medium text-gray-900">
          {{ toIDR(item.harga_beli) }}
        </p>
      </div>
    </div>
  </div>
</template>
