<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import PemilikInventarisAnalisaLowStockMobileKartu from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaLowStockMobileKartu.vue";
import PemilikInventarisAnalisaLowStockDesktopRow from "@/components/pemilik/inventaris-analisa/PemilikInventarisAnalisaLowStockDesktopRow.vue";

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

const TABLE_HEADERS = ["Nama Barang", "Stok Saat Ini", "Stok Minimal", "Harga Beli", "Status"];
</script>

<template>
  <div
    class="rounded-2xl bg-white p-6 shadow-lg mb-8 border-l-4 border-red-500"
  >
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-red-100 p-2">
          <i class="mdi mdi-alert-circle text-3xl text-red-600"></i>
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
        <PemilikInventarisAnalisaLowStockMobileKartu
          v-for="item in items"
          :key="`mobile-${item.id}`"
          :item="item"
          :stock-status-label="
            getStockStatus(item.jumlah_stok, item.minimum_stok).label
          "
          :stock-status-class="
            getStockStatus(item.jumlah_stok, item.minimum_stok).class
          "
          :out-of-stock="item.jumlah_stok === 0"
        />
      </template>

      <PemilikInventarisAnalisaLowStockDesktopRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        :stock-status-label="
          getStockStatus(item.jumlah_stok, item.minimum_stok).label
        "
        :stock-status-class="
          getStockStatus(item.jumlah_stok, item.minimum_stok).class
        "
        :out-of-stock="item.jumlah_stok === 0"
      />
    </TableShell>

    <div
      v-else
      class="rounded-xl bg-green-50 py-8 text-center border border-green-100"
    >
      <i class="mdi mdi-check-circle text-5xl text-green-500"></i>
      <p class="mt-3 text-lg font-bold text-green-700">Semua Stok Aman! 🎉</p>
      <p class="mt-1 text-sm text-green-600">
        Tidak ada barang yang perlu dibelanjakan ulang saat ini
      </p>
    </div>
  </div>
</template>
