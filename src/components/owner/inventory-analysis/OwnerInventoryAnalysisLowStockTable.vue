<script setup lang="ts">
import { toIDR } from "@/utils/money";
import TableShell from "@/components/ui/TableShell.vue";

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
};

const getStockStatus = (stock: number, _minStock: number) => {
  if (stock === 0) return STOCK_STATUS.habis;
  return STOCK_STATUS.kritis;
};

const TABLE_HEADERS = ["Nama Barang", "Stok", "Min", "Harga Beli", "Status"];
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
          <h2 class="text-xl font-bold text-gray-900">Stok Menipis</h2>
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

    <TableShell
      v-else-if="items.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="lg"
      mobile-cards-class="space-y-4 p-4"
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
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                getStockStatus(item.jumlah_stok, item.minimum_stok).class,
              ]"
            >
              {{ getStockStatus(item.jumlah_stok, item.minimum_stok).label }}
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
                  item.jumlah_stok === 0 ? 'text-red-600' : 'text-orange-600',
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
    </TableShell>

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
