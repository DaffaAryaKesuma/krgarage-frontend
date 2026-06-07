<script setup lang="ts">
// Format harga ke Rupiah.
import { toIDR } from "@/utils/money";
import type { InventarisSukuCadang } from "@/types/inventaris";
// Helper chip kategori dan tombol icon.
import { getChipBadgeClass } from "@/utils/badgeVariants";
import { getIconButtonClass } from "@/utils/buttonVariants";

// Props baris desktop inventaris.
interface Props {
  sukucadang: InventarisSukuCadang;
  hasStockAlert: boolean;
  stockValueClass: string;
  stockAlertLabel: string;
  stockAlertBadgeClass: string;
}

defineProps<Props>();

// Event aksi restock/edit/delete ke parent tabel.
const emit = defineEmits<{
  restock: [sukucadang: InventarisSukuCadang];
  edit: [sukucadang: InventarisSukuCadang];
  delete: [id: number];
}>();
</script>

<template>
  <!-- Baris desktop untuk satu suku cadang. -->
  <tr class="transition-colors hover:bg-gray-50/80">
    <!-- Nama dan deskripsi. -->
    <td class="px-6 py-4">
      <div class="text-sm font-medium text-gray-900">
        {{ sukucadang.nama_suku_cadang }}
      </div>
      <div class="truncate text-xs text-gray-500" :title="sukucadang.deskripsi">
        {{ sukucadang.deskripsi }}
      </div>
    </td>
    <!-- Kategori. -->
    <td class="px-6 py-4 whitespace-nowrap">
      <span
        :class="getChipBadgeClass('neutral')"
      >
        {{ sukucadang.kategori }}
      </span>
    </td>
    <!-- Jumlah stok dan badge alert. -->
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
    <!-- Harga beli. -->
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ toIDR(sukucadang.harga_beli) }}
    </td>
    <!-- Harga jual. -->
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ toIDR(sukucadang.harga_jual) }}
    </td>
    <!-- Tombol aksi. -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="-ml-2 flex items-center gap-2">
        <button
          @click="emit('restock', sukucadang)"
          :class="getIconButtonClass('success')"
          title="Tambah Stok"
        >
          <i class="mdi mdi-plus text-xl"></i>
        </button>
        <button
          @click="emit('edit', sukucadang)"
          :class="getIconButtonClass('info')"
          title="Ubah"
        >
          <i class="mdi mdi-pencil"></i>
        </button>
        <button
          @click="emit('delete', sukucadang.id)"
          :class="getIconButtonClass('danger')"
          title="Hapus"
        >
          <i class="mdi mdi-delete"></i>
        </button>
      </div>
    </td>
  </tr>
</template>
