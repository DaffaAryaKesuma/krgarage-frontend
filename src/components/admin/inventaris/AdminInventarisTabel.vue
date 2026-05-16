<script setup lang="ts">
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AdminInventarisTabelKartuMobile from "@/components/admin/inventaris/AdminInventarisTabelKartuMobile.vue";
import AdminInventarisTabelBarisDesktop from "@/components/admin/inventaris/AdminInventarisTabelBarisDesktop.vue";
import type { InventarisSukuCadang } from "@/types/inventaris";

interface Props {
  sukucadang: InventarisSukuCadang[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  restock: [sukucadang: InventarisSukuCadang];
  edit: [sukucadang: InventarisSukuCadang];
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

const hasStockAlert = (sukucadang: InventarisSukuCadang) => sukucadang.stok_menipis;

const isOutOfStock = (sukucadang: InventarisSukuCadang) =>
  sukucadang.jumlah_stok === 0;

const getStockValueClass = (sukucadang: InventarisSukuCadang) => {
  if (!hasStockAlert(sukucadang)) {
    return "text-gray-900";
  }

  return isOutOfStock(sukucadang)
    ? "text-red-600 font-bold"
    : "text-orange-600 font-bold";
};

const getStockAlertLabel = (sukucadang: InventarisSukuCadang) =>
  isOutOfStock(sukucadang) ? "Habis" : "Kritis";

const getStockAlertBadgeClass = (sukucadang: InventarisSukuCadang) =>
  isOutOfStock(sukucadang)
    ? "bg-red-100 text-red-800"
    : "bg-orange-100 text-orange-800";

const TABLE_WRAPPER_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "w-full table-fixed divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6 [&:nth-child(1)]:w-[38%] [&:nth-child(2)]:w-[14%] [&:nth-child(3)]:w-[10%] [&:nth-child(4)]:w-[14%] [&:nth-child(5)]:w-[14%] [&:nth-child(6)]:w-[10%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_KARTU_CLASS = "space-y-4 bg-gray-50 p-4";
</script>

<template>
  <div :class="TABLE_WRAPPER_CLASS">
    <TableShell
      v-if="sukucadang.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="xl"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :table-class="TABLE_CLASS"
      head-class="bg-gray-50"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
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

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="mdi mdi-package-variant"
      title="Suku Cadang Tidak Ditemukan"
      message="Tidak ada data suku cadang yang tersedia di inventaris saat ini."
    />
  </div>
</template>
