<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import { toIDR } from "@/utils/money";
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getInventoryBadgeClass,
} from "@/utils/badgeVariants";

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
  habis: { label: "Habis", class: getInventoryBadgeClass("habis") },
  kritis: { label: "Kritis", class: getInventoryBadgeClass("kritis") },
};

const getStockStatus = (stock: number, _minStock: number) => {
  if (stock === 0) return STOCK_STATUS.habis;
  return STOCK_STATUS.kritis;
};

const TABLE_HEADERS = [
  "Nama Barang",
  "Stok Saat Ini",
  "Stok Minimal",
  "Harga Beli",
  "Status",
];
</script>

<template>
  <div class="rounded-2xl bg-white p-6 shadow-lg mb-8 border-l-4 border-red-500">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-red-100 p-2">
          <i
            :class="['mdi mdi-alert-circle text-3xl', getAlertIconClass('error')]"
          ></i>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">Stok Menipis</h2>
          <p class="text-xs text-gray-600">
            Barang yang perlu dibelanjakan ulang
          </p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <TableShell
      v-else-if="items.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      mobile-kartu-class="space-y-4 p-4"
      table-class="w-full text-sm"
      header-row-class="border-b text-left text-gray-600"
      header-cell-class="pb-3 font-semibold"
      body-class="divide-y"
    >
      <template #mobile>
        <div
          v-for="item in items"
          :key="`mobile-${item.id}`"
          class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">{{ item.nama_barang }}</p>
              <p class="text-xs text-gray-500">{{ item.kategori }}</p>
            </div>
            <span
              :class="[
                getStockStatus(item.jumlah_stok, item.minimum_stok).class,
              ]"
            >
              {{ getStockStatus(item.jumlah_stok, item.minimum_stok).label }}
            </span>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p :class="META_LABEL_CLASS">
                Stok Saat Ini
              </p>
              <p
                :class="[
                  'font-medium',
                item.jumlah_stok === 0 ? 'text-red-600' : 'text-amber-600',
                ]"
              >
                {{ item.jumlah_stok }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Minimum
              </p>
              <p class="font-medium text-gray-900">{{ item.minimum_stok }}</p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Harga Beli
              </p>
              <p class="font-medium text-gray-900">
                {{ toIDR(item.harga_beli) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="item in items"
        :key="item.id"
        class="hover:bg-red-50 transition-colors"
      >
        <td class="py-3 pl-2">
          <div class="font-bold text-gray-900">{{ item.nama_barang }}</div>
          <div class="text-xs text-gray-600">{{ item.kategori }}</div>
        </td>
        <td class="py-3 px-8">
          <span
            :class="[
              'font-bold',
              item.jumlah_stok === 0 ? 'text-red-600' : 'text-amber-600',
            ]"
          >
            {{ item.jumlah_stok }}
          </span>
        </td>
        <td class="py-3 px-8 font-bold">{{ item.minimum_stok }}</td>
        <td class="py-3 font-semibold">{{ toIDR(item.harga_beli) }}</td>
        <td class="py-3">
          <span
            :class="[
              getStockStatus(item.jumlah_stok, item.minimum_stok).class,
            ]"
          >
            {{ getStockStatus(item.jumlah_stok, item.minimum_stok).label }}
          </span>
        </td>
      </tr>
    </TableShell>

    <div v-else :class="[getAlertBoxClass('success'), 'py-8 text-center']">
      <i
        :class="['mdi mdi-check-circle text-5xl', getAlertIconClass('success')]"
      ></i>
      <p class="mt-1 text-lg font-bold">Semua Stok Aman</p>
      <p class="text-sm">
        Tidak ada barang yang perlu dibelanjakan ulang saat ini
      </p>
    </div>
  </div>
</template>
