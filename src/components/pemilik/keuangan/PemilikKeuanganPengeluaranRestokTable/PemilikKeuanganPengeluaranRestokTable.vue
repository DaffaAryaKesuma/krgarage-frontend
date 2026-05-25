<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import { formatDateShort } from "@/utils/date";
import { formatNama } from "@/utils/format";
import { toIDR } from "@/utils/money";
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
import {
  TABLE_BODY_CLASS,
  TABLE_COMFORTABLE_HEADER_CELL_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/utils/tableVariants";
import {
  TABLE_HEADERS,
  usePemilikKeuanganPengeluaranRestokTable,
  type PemilikKeuanganPengeluaranRestokTableProps,
} from "./usePemilikKeuanganPengeluaranRestokTable";

interface Emits {
  (e: "update:currentPage", value: number): void;
}

const props = defineProps<PemilikKeuanganPengeluaranRestokTableProps>();
const emit = defineEmits<Emits>();

const { totalPages, from, to, paginatedPengeluaran } =
  usePemilikKeuanganPengeluaranRestokTable(props);
</script>

<template>
  <div class="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">
    <div class="mb-6">
      <h2 class="flex items-center gap-2 text-xl font-bold text-gray-900">
        <i class="mdi mdi-package-up text-red-600"></i>
        Pengeluaran Restok
      </h2>
    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="h-16 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <TableShell
      v-else-if="pengeluaran.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      :header-cell-class="TABLE_COMFORTABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <template #mobile>
        <div
          v-for="item in paginatedPengeluaran"
          :key="`mobile-restok-${item.id}`"
          :class="TABLE_MOBILE_CARD_CLASS"
        >
          <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ item.suku_cadang?.nama_suku_cadang || "Suku Cadang" }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDateShort(item.created_at) }}
              </p>
            </div>
            <p class="text-sm font-bold text-red-600">
              {{ toIDR(item.total_pengeluaran) }}
            </p>
          </div>

          <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
            <div>
              <p :class="META_LABEL_CLASS">
                Jumlah
              </p>
              <p class="font-medium text-gray-900">{{ item.jumlah }}</p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Harga/Unit
              </p>
              <p class="font-medium text-gray-900">
                {{ toIDR(item.harga_beli_satuan) }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Stok
              </p>
              <p class="font-medium text-gray-900">
                {{ item.stok_sebelum }} -> {{ item.stok_sesudah }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">
                Admin
              </p>
              <p class="font-medium text-gray-900">
                {{ formatNama(item.admin?.nama || "-") }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="item in paginatedPengeluaran"
        :key="item.id"
        class="transition-colors hover:bg-gray-50"
      >
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ formatDateShort(item.created_at) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ item.suku_cadang?.nama_suku_cadang || "Suku Cadang" }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">{{ item.jumlah }}</td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ toIDR(item.harga_beli_satuan) }}
        </td>
        <td class="px-6 py-4 text-sm font-semibold text-red-600">
          {{ toIDR(item.total_pengeluaran) }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ item.stok_sebelum }} -> {{ item.stok_sesudah }}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          {{ formatNama(item.admin?.nama || "-") }}
        </td>
      </tr>

      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="pengeluaran.length"
            :per-page="itemsPerPage"
            :from="from"
            :to="to"
            @page-change="emit('update:currentPage', $event)"
          />
        </div>
      </template>
    </TableShell>

    <EmptyState
      v-else
      icon="mdi mdi-package-search"
      title="Tidak ada pengeluaran restok"
      :message="`Tidak ada restok dari ${formatDateShort(startDate)} sampai ${formatDateShort(endDate)}.`"
      class="py-12"
    />
  </div>
</template>
