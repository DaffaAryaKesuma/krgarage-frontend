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
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
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
          <span :class="['font-semibold', stockValueClass]">
            {{ sparepart.jumlah_stok }}
          </span>
          <span
            v-if="hasStockAlert"
            :class="[
              'px-2 py-0.5 text-xs font-semibold rounded-full',
              stockAlertBadgeClass,
            ]"
          >
            {{ stockAlertLabel }}
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
