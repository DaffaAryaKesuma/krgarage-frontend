<script setup lang="ts">
// Loading spinner dan tabel responsif reusable.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import TableShell from "@/components/ui/TableShell.vue";
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper class badge, alert, ikon, dan warna teks.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getIconToneClass,
  getToneTextClass,
  getInventoryBadgeClass,
} from "@/utils/badgeVariants";
// Helper class tabel.
import {
  TABLE_BODY_CLASS,
  TABLE_DANGER_ROW_HOVER_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_HEADER_CELL_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  buildFixedTableClass,
} from "@/utils/tableVariants";

// Bentuk item stok menipis dari API analisa inventaris.
interface LowStockItem {
  id: number;
  nama_barang: string;
  kategori: string;
  jumlah_stok: number;
  minimum_stok: number;
  harga_beli: number;
}

// Props menerima item dan loading.
interface Props {
  items: LowStockItem[];
  loading: boolean;
}

defineProps<Props>();

// Mapping status stok ke label dan class badge.
const STOCK_STATUS = {
  habis: { label: "Habis", class: getInventoryBadgeClass("habis") },
  kritis: { label: "Kritis", class: getInventoryBadgeClass("kritis") },
};

// Status habis jika stok 0, selain itu kritis.
const getStockStatus = (stock: number, _minStock: number) => {
  if (stock === 0) return STOCK_STATUS.habis;
  return STOCK_STATUS.kritis;
};

// Warna teks stok mengikuti status bahaya.
const getStockTextClass = (stock: number) =>
  stock === 0 ? getToneTextClass("danger") : getToneTextClass("warning");

// Header tabel stok menipis.
const TABLE_HEADERS = [
  "Nama Barang",
  "Stok Saat Ini",
  "Stok Minimal",
  "Harga Beli",
  "Status",
];

// Lebar kolom desktop.
const TABLE_COLUMN_WIDTHS = ["28%", "16%", "16%", "22%", "18%"];

// Class cell tabel.
const TABLE_CELL_CLASS = "px-4 py-4 align-middle sm:px-6";
const TABLE_NUMBER_CELL_CLASS = `${TABLE_CELL_CLASS} font-bold`;
const TABLE_PRICE_CELL_CLASS = `${TABLE_CELL_CLASS} font-semibold text-gray-900`;
</script>

<template>
  <!-- Kartu daftar stok menipis. -->
  <div class="rounded-2xl bg-white p-6 shadow-lg mb-8 border border-gray-100">
    <!-- Header section. -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div :class="[getIconToneClass('danger'), 'rounded-full p-2']">
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

    <!-- Loading saat data stok menipis diambil. -->
    <LoadingSpinner v-if="loading" message="Memuat stok menipis..." />

    <!-- Tabel/kartu tampil jika ada item stok menipis. -->
    <TableShell
      v-else-if="items.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :table-class="buildFixedTableClass('text-sm')"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="border-b"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
    >
      <!-- Tampilan mobile. -->
      <template #mobile>
        <div
          v-for="item in items"
          :key="`mobile-${item.id}`"
          :class="TABLE_MOBILE_CARD_CLASS"
        >
          <!-- Header kartu mobile: nama barang, kategori, dan status stok. -->
          <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
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

          <!-- Detail stok mobile. -->
          <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
            <div>
              <p :class="META_LABEL_CLASS">
                Stok Saat Ini
              </p>
              <p
                :class="[
                  'font-medium',
                  getStockTextClass(item.jumlah_stok),
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

      <!-- Tampilan desktop. -->
      <tr
        v-for="item in items"
        :key="item.id"
        :class="TABLE_DANGER_ROW_HOVER_CLASS"
      >
        <td :class="TABLE_CELL_CLASS">
          <div class="font-bold text-gray-900">{{ item.nama_barang }}</div>
          <div class="text-xs text-gray-600">{{ item.kategori }}</div>
        </td>
        <td :class="TABLE_NUMBER_CELL_CLASS">
          <span
            :class="[
              'font-bold',
              getStockTextClass(item.jumlah_stok),
            ]"
          >
            {{ item.jumlah_stok }}
          </span>
        </td>
        <td :class="TABLE_NUMBER_CELL_CLASS">{{ item.minimum_stok }}</td>
        <td :class="TABLE_PRICE_CELL_CLASS">{{ toIDR(item.harga_beli) }}</td>
        <td :class="TABLE_CELL_CLASS">
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

    <!-- Jika tidak ada stok menipis, tampilkan kondisi aman. -->
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
