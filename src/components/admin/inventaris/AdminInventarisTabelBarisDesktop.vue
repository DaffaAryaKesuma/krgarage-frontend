<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { InventarisSukuCadang } from "@/types/inventaris";
import { getChipBadgeClass } from "@/utils/badgeVariants";

interface Props {
  sukucadang: InventarisSukuCadang;
  hasStockAlert: boolean;
  stockValueClass: string;
  stockAlertLabel: string;
  stockAlertBadgeClass: string;
}

defineProps<Props>();

const emit = defineEmits<{
  restock: [sukucadang: InventarisSukuCadang];
  edit: [sukucadang: InventarisSukuCadang];
  delete: [id: number];
}>();
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50/80">
    <td class="px-6 py-4">
      <div class="text-sm font-medium text-gray-900">
        {{ sukucadang.nama_suku_cadang }}
      </div>
      <div class="truncate text-xs text-gray-500" :title="sukucadang.deskripsi">
        {{ sukucadang.deskripsi }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span
        :class="getChipBadgeClass('neutral')"
      >
        {{ sukucadang.kategori }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center gap-2">
        <span :class="['text-sm', stockValueClass]">
          {{ sukucadang.jumlah_stok }}
        </span>
        <span
          v-if="hasStockAlert"
          :class="stockAlertBadgeClass"
        >
          {{ stockAlertLabel }}
        </span>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ toIDR(sukucadang.harga_beli) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ toIDR(sukucadang.harga_jual) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="-ml-2 flex items-center gap-2">
        <button
          @click="emit('restock', sukucadang)"
          class="inline-flex h-9 w-9 items-center justify-center cursor-pointer text-gray-600 transition hover:text-green-600"
          title="Tambah Stok"
        >
          <i class="mdi mdi-plus text-xl"></i>
        </button>
        <button
          @click="emit('edit', sukucadang)"
          class="inline-flex h-9 w-9 items-center justify-center cursor-pointer text-gray-600 transition hover:text-blue-600"
          title="Ubah"
        >
          <i class="mdi mdi-pencil"></i>
        </button>
        <button
          @click="emit('delete', sukucadang.id)"
          class="inline-flex h-9 w-9 items-center justify-center cursor-pointer text-gray-600 transition hover:text-red-600"
          title="Hapus"
        >
          <i class="mdi mdi-delete"></i>
        </button>
      </div>
    </td>
  </tr>
</template>
