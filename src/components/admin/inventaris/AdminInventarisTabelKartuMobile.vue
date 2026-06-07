<script setup lang="ts">
// Format harga ke Rupiah.
import { toIDR } from "@/utils/money";
import type { InventarisSukuCadang } from "@/types/inventaris";
// Helper class label, chip, dan tombol.
import { META_LABEL_CLASS, getChipBadgeClass } from "@/utils/badgeVariants";
import {
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_FOOTER_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
} from "@/utils/tableVariants";
import { getIconButtonClass } from "@/utils/buttonVariants";

// Props kartu mobile inventaris.
interface Props {
  sukucadang: InventarisSukuCadang;
  hasStockAlert: boolean;
  stockValueClass: string;
  stockAlertLabel: string;
  stockAlertBadgeClass: string;
}

defineProps<Props>();

// Event aksi diteruskan ke tabel utama.
const emit = defineEmits<{
  restock: [sukucadang: InventarisSukuCadang];
  edit: [sukucadang: InventarisSukuCadang];
  delete: [id: number];
}>();
</script>

<template>
  <!-- Kartu mobile untuk satu suku cadang. -->
  <div :class="TABLE_MOBILE_CARD_CLASS">
    <!-- Header nama, deskripsi, dan kategori. -->
    <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
      <div>
        <p class="text-sm font-semibold text-gray-900">
          {{ sukucadang.nama_suku_cadang }}
        </p>
        <p class="text-xs text-gray-500">{{ sukucadang.deskripsi }}</p>
      </div>
      <span
        :class="[getChipBadgeClass('neutral'), 'shrink-0']"
      >
        {{ sukucadang.kategori }}
      </span>
    </div>

    <!-- Grid stok dan harga. -->
    <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">
          Stok
        </p>
        <div class="flex items-center gap-2">
          <span :class="['font-semibold', stockValueClass]">
            {{ sukucadang.jumlah_stok }}
          </span>
          <span
            v-if="hasStockAlert"
            :class="stockAlertBadgeClass"
          >
            {{ stockAlertLabel }}
          </span>
        </div>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">
          Harga Beli
        </p>
        <p class="font-medium text-gray-900">
          {{ toIDR(sukucadang.harga_beli) }}
        </p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">
          Harga Jual
        </p>
        <p class="font-medium text-gray-900">
          {{ toIDR(sukucadang.harga_jual) }}
        </p>
      </div>
    </div>

    <!-- Tombol aksi restock, edit, hapus. -->
    <div :class="[TABLE_MOBILE_CARD_FOOTER_CLASS, 'flex flex-wrap gap-2']">
      <button
        @click="emit('restock', sukucadang)"
        :class="getIconButtonClass('success')"
        title="Tambah Stok"
      >
        <i class="mdi mdi-plus"></i>
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
  </div>
</template>
