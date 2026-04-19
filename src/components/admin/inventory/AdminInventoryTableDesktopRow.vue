<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { InventorySparepart } from "@/types/inventory";

interface Props {
  sparepart: InventorySparepart;
  hasStockAlert: boolean;
  stockValueClass: string;
  stockAlertLabel: string;
  stockAlertBadgeClass: string;
}

defineProps<Props>();

const emit = defineEmits<{
  restock: [sparepart: InventorySparepart];
  edit: [sparepart: InventorySparepart];
  delete: [id: number];
}>();
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50/80">
    <td class="px-6 py-4">
      <div class="text-sm font-medium text-gray-900">
        {{ sparepart.nama_suku_cadang }}
      </div>
      <div class="truncate text-xs text-gray-500" :title="sparepart.deskripsi">
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
        <span :class="['text-sm', stockValueClass]">
          {{ sparepart.jumlah_stok }}
        </span>
        <span
          v-if="hasStockAlert"
          :class="[
            'px-2 py-1 text-xs font-semibold rounded-full',
            stockAlertBadgeClass,
          ]"
        >
          {{ stockAlertLabel }}
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
</template>
