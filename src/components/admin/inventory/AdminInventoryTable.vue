<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import AdminInventoryTableMobileCard from "@/components/admin/inventory/AdminInventoryTableMobileCard.vue";
import AdminInventoryTableDesktopRow from "@/components/admin/inventory/AdminInventoryTableDesktopRow.vue";
import type { InventorySparepart } from "@/types/inventory";

interface Props {
  spareparts: InventorySparepart[];
}

defineProps<Props>();

const emit = defineEmits<{
  restock: [sparepart: InventorySparepart];
  edit: [sparepart: InventorySparepart];
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

const hasStockAlert = (sparepart: InventorySparepart) => sparepart.stok_menipis;

const isOutOfStock = (sparepart: InventorySparepart) =>
  sparepart.jumlah_stok === 0;

const getStockValueClass = (sparepart: InventorySparepart) => {
  if (!hasStockAlert(sparepart)) {
    return "text-gray-900";
  }

  return isOutOfStock(sparepart)
    ? "text-red-600 font-bold"
    : "text-orange-600 font-bold";
};

const getStockAlertLabel = (sparepart: InventorySparepart) =>
  isOutOfStock(sparepart) ? "Habis" : "Kritis";

const getStockAlertBadgeClass = (sparepart: InventorySparepart) =>
  isOutOfStock(sparepart)
    ? "bg-red-100 text-red-800"
    : "bg-orange-100 text-orange-800";

const TABLE_WRAPPER_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "w-full table-fixed divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6 [&:nth-child(1)]:w-[38%] [&:nth-child(2)]:w-[14%] [&:nth-child(3)]:w-[10%] [&:nth-child(4)]:w-[14%] [&:nth-child(5)]:w-[14%] [&:nth-child(6)]:w-[10%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_CARDS_CLASS = "space-y-4 bg-gray-50 p-4";
</script>

<template>
  <div :class="TABLE_WRAPPER_CLASS">
    <TableShell
      v-if="spareparts.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="xl"
      :mobile-cards-class="TABLE_MOBILE_CARDS_CLASS"
      :table-class="TABLE_CLASS"
      head-class="bg-gray-50"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <template #mobile>
        <AdminInventoryTableMobileCard
          v-for="sparepart in spareparts"
          :key="`mobile-${sparepart.id}`"
          :sparepart="sparepart"
          :has-stock-alert="hasStockAlert(sparepart)"
          :stock-value-class="getStockValueClass(sparepart)"
          :stock-alert-label="getStockAlertLabel(sparepart)"
          :stock-alert-badge-class="getStockAlertBadgeClass(sparepart)"
          @restock="emit('restock', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>

      <AdminInventoryTableDesktopRow
        v-for="sparepart in spareparts"
        :key="sparepart.id"
        :sparepart="sparepart"
        :has-stock-alert="hasStockAlert(sparepart)"
        :stock-value-class="getStockValueClass(sparepart)"
        :stock-alert-label="getStockAlertLabel(sparepart)"
        :stock-alert-badge-class="getStockAlertBadgeClass(sparepart)"
        @restock="emit('restock', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </TableShell>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="mdi mdi-package-variant text-4xl text-gray-400 mb-2"></i>
      <p class="text-gray-600">Tidak ada suku cadang ditemukan</p>
    </div>
  </div>
</template>
