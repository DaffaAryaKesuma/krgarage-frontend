<script setup lang="ts">
// TableShell menyediakan mode table desktop dan kartu mobile.
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Komponen baris mobile dan desktop.
import AdminInventarisTabelKartuMobile from "@/components/admin/inventaris/AdminInventarisTabelKartuMobile.vue";
import AdminInventarisTabelBarisDesktop from "@/components/admin/inventaris/AdminInventarisTabelBarisDesktop.vue";
import type { InventarisSukuCadang } from "@/types/inventaris";
// Helper badge stok.
import { getInventoryBadgeClass, getToneTextClass } from "@/utils/badgeVariants";
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
  buildTableHeaderCellClass,
} from "@/utils/tableVariants";

// Props daftar suku cadang yang sudah difilter.
interface Props {
  sukucadang: InventarisSukuCadang[];
}

const props = defineProps<Props>();

// Event aksi diteruskan ke halaman inventaris.
const emit = defineEmits<{
  restock: [sukucadang: InventarisSukuCadang];
  edit: [sukucadang: InventarisSukuCadang];
  delete: [id: number];
}>();

// Header tabel desktop.
const TABLE_HEADERS = [
  "Suku Cadang",
  "Kategori",
  "Stok",
  "Harga Beli",
  "Harga Jual",
  "Aksi",
];

// Lebar kolom tabel desktop.
const TABLE_COLUMN_WIDTHS = ["38%", "14%", "10%", "14%", "14%", "10%"];

// Stok alert true jika item stok menipis/habis.
const hasStockAlert = (sukucadang: InventarisSukuCadang) => sukucadang.stok_menipis;

// Habis jika stok 0.
const isOutOfStock = (sukucadang: InventarisSukuCadang) =>
  sukucadang.jumlah_stok === 0;

// Class angka stok berubah jika stok kritis/habis.
const getStockValueClass = (sukucadang: InventarisSukuCadang) => {
  if (!hasStockAlert(sukucadang)) {
    return "text-gray-900";
  }

  return isOutOfStock(sukucadang)
    ? "text-red-600 font-bold"
    : `${getToneTextClass("warning")} font-bold`;
};

// Label badge stok.
const getStockAlertLabel = (sukucadang: InventarisSukuCadang) =>
  isOutOfStock(sukucadang) ? "Habis" : "Kritis";

// Class badge stok.
const getStockAlertBadgeClass = (sukucadang: InventarisSukuCadang) =>
  isOutOfStock(sukucadang)
    ? getInventoryBadgeClass("habis")
    : getInventoryBadgeClass("kritis");

// Class tabel desktop.
const TABLE_CLASS = buildFixedTableClass();

// Class header cell.
const TABLE_HEADER_CELL_CLASS = buildTableHeaderCellClass();
</script>

<template>
  <!-- Wrapper tabel inventaris. -->
  <div :class="TABLE_WRAPPER_CLASS">
    <!-- Tabel responsive jika ada data. -->
    <TableShell
      v-if="sukucadang.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="xl"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
      :table-class="TABLE_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <!-- Slot kartu mobile. -->
      <template #mobile>
        <AdminInventarisTabelKartuMobile
          v-for="item in sukucadang"
          :key="`mobile-${item.id}`"
          :sukucadang="item"
          :has-stock-alert="hasStockAlert(item)"
          :stock-value-class="getStockValueClass(item)"
          :stock-alert-label="getStockAlertLabel(item)"
          :stock-alert-badge-class="getStockAlertBadgeClass(item)"
          @restock="emit('restock', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>

      <!-- Baris desktop. -->
      <AdminInventarisTabelBarisDesktop
        v-for="item in sukucadang"
        :key="item.id"
        :sukucadang="item"
        :has-stock-alert="hasStockAlert(item)"
        :stock-value-class="getStockValueClass(item)"
        :stock-alert-label="getStockAlertLabel(item)"
        :stock-alert-badge-class="getStockAlertBadgeClass(item)"
        @restock="emit('restock', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </TableShell>

    <!-- Empty state jika daftar suku cadang kosong. -->
    <EmptyState
      v-else
      icon="mdi mdi-package-variant"
      title="Suku Cadang Tidak Ditemukan"
      message="Tidak ada data suku cadang yang tersedia di inventaris saat ini."
    />
  </div>
</template>
