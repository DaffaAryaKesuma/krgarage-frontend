<script setup lang="ts">
import { toIDR } from "@/utils/money";
import TableShell from "@/components/ui/TableShell.vue";
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

const TABLE_ROW_CLASS = "transition-colors hover:bg-gray-50/80";
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
        <div
          v-for="sparepart in spareparts"
          :key="`mobile-${sparepart.id}`"
          class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ sparepart.nama_suku_cadang }}
              </p>
              <p class="text-xs text-gray-500">{{ sparepart.deskripsi }}</p>
            </div>
            <span
              class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {{ sparepart.kategori }}
            </span>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Stok
              </p>
              <div class="flex items-center gap-2">
                <span :class="['font-semibold', getStockValueClass(sparepart)]">
                  {{ sparepart.jumlah_stok }}
                </span>
                <span
                  v-if="hasStockAlert(sparepart)"
                  :class="[
                    'px-2 py-0.5 text-xs font-semibold rounded-full',
                    getStockAlertBadgeClass(sparepart),
                  ]"
                >
                  {{ getStockAlertLabel(sparepart) }}
                </span>
              </div>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Harga Beli
              </p>
              <p class="font-medium text-gray-900">
                {{ toIDR(sparepart.harga_beli) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Harga Jual
              </p>
              <p class="font-medium text-gray-900">
                {{ toIDR(sparepart.harga_jual) }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            <button
              @click="emit('restock', sparepart)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-100"
              title="Tambah Stok"
            >
              <i class="mdi mdi-plus"></i>
            </button>
            <button
              @click="emit('edit', sparepart)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-100"
              title="Ubah"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              @click="emit('delete', sparepart.id)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-100"
              title="Hapus"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
      </template>

      <tr
        v-for="sparepart in spareparts"
        :key="sparepart.id"
        :class="TABLE_ROW_CLASS"
      >
        <td class="px-6 py-4">
          <div class="text-sm font-medium text-gray-900">
            {{ sparepart.nama_suku_cadang }}
          </div>
          <div
            class="truncate text-xs text-gray-500"
            :title="sparepart.deskripsi"
          >
            {{ sparepart.deskripsi }}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span
            class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
          >
            {{ sparepart.kategori }}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center gap-2">
            <span :class="['text-sm', getStockValueClass(sparepart)]">
              {{ sparepart.jumlah_stok }}
            </span>
            <span
              v-if="hasStockAlert(sparepart)"
              :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                getStockAlertBadgeClass(sparepart),
              ]"
            >
              {{ getStockAlertLabel(sparepart) }}
            </span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ toIDR(sparepart.harga_beli) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ toIDR(sparepart.harga_jual) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="-ml-2 flex items-center gap-2">
            <button
              @click="emit('restock', sparepart)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-100"
              title="Tambah Stok"
            >
              <i class="mdi mdi-plus"></i>
            </button>
            <button
              @click="emit('edit', sparepart)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-100"
              title="Ubah"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              @click="emit('delete', sparepart.id)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-100"
              title="Hapus"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </td>
      </tr>
    </TableShell>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="mdi mdi-package-variant text-4xl text-gray-400 mb-2"></i>
      <p class="text-gray-600">Tidak ada suku cadang ditemukan</p>
    </div>
  </div>
</template>
