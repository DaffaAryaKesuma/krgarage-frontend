<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
import { formatDateShort } from "@/utils/date";
import { formatNama } from "@/utils/format";
import {
  TABLE_BODY_CLASS,
  TABLE_COMFORTABLE_HEADER_CELL_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS,
  TABLE_MOBILE_CARD_STACK_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_ROW_HOVER_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
} from "@/utils/tableVariants";
import {
  AUDIT_TABLE_CELL_CLASS,
  AUDIT_TABLE_COLUMN_WIDTHS,
  AUDIT_TABLE_HEADERS,
  AUDIT_TABLE_MUTED_CELL_CLASS,
  formatAuditValue,
  formatFieldLabel,
  getAuditActionClass,
  getAuditActorName,
  getAuditActorRole,
  getAuditActorRoleClass,
  getAuditModuleClass,
  getAuditValueClass,
  getSingleAuditValue,
  getVisibleChangedFields,
  shouldShowAuditArrow,
  usePemilikAuditAktivitasTable,
  type PemilikAuditAktivitasTableProps,
} from "./usePemilikAuditAktivitasTable";

const props = withDefaults(defineProps<PemilikAuditAktivitasTableProps>(), {
  title: "Log Aktivitas Sistem",
  emptyMessage: "Aktivitas penting akan muncul di sini.",
  currentPage: 1,
  itemsPerPage: 10,
});

const emit = defineEmits<{
  (event: "update:currentPage", value: number): void;
}>();

const { totalPages, from, to, paginatedLogs } =
  usePemilikAuditAktivitasTable(props);
</script>

<template>
  <div class="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
    <div class="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2">
        <i class="mdi mdi-history text-xl text-red-600"></i>
        <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
      </div>
      
    </div>

    <LoadingSpinner v-if="loading" message="Memuat log aktivitas..." />

    <EmptyState
      v-else-if="logs.length === 0"
      icon="mdi mdi-clipboard-text-clock-outline"
      title="Belum ada log aktivitas"
      :message="emptyMessage"
      class="py-12"
    />

    <TableShell
      v-else
      :headers="AUDIT_TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :table-class="buildFixedTableClass('text-sm')"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      :header-cell-class="TABLE_COMFORTABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
      :column-widths="AUDIT_TABLE_COLUMN_WIDTHS"
    >
      <template #mobile>
        <div
          v-for="log in paginatedLogs"
          :key="`mobile-audit-${log.id}`"
          :class="TABLE_MOBILE_CARD_CLASS"
        >
          <div :class="TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  :class="[
                    'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                    getAuditActionClass(log.aksi),
                  ]"
                >
                  {{ log.aksi }}
                </span>
                <span
                  :class="[
                    'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                    getAuditModuleClass(log.modul),
                  ]"
                >
                  {{ log.modul }}
                </span>
              </div>
              <p class="mt-2 truncate font-semibold text-gray-900">
                {{ log.target_label || log.target_tipe || "Aktivitas Sistem" }}
              </p>
            </div>
            <div class="shrink-0 text-right text-xs text-gray-500">
              <p>{{ formatDateShort(log.created_at) }}</p>
              <p>{{ formatNama(getAuditActorName(log)) }}</p>
              <span
                :class="[
                  'mt-1 text-[10px] font-bold uppercase',
                  getAuditActorRoleClass(getAuditActorRole(log)),
                ]"
              >
                {{ getAuditActorRole(log) }}
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-700">
            {{ log.deskripsi || "Aktivitas sistem diperbarui." }}
          </p>

          <div
            v-if="getVisibleChangedFields(log).length > 0"
            :class="TABLE_MOBILE_CARD_STACK_CLASS"
          >
            <div
              v-for="field in getVisibleChangedFields(log).slice(0, 1)"
              :key="`${log.id}-mobile-${field}`"
              class="rounded-lg bg-gray-50 px-3 py-2"
            >
              <p class="text-[11px] font-semibold uppercase text-gray-500">
                {{ formatFieldLabel(field) }}
              </p>
              <p class="mt-1 text-sm text-gray-700">
                <template v-if="shouldShowAuditArrow(log, field)">
                  <span
                    :class="getAuditValueClass(field, log.data_sebelum?.[field]) || 'text-red-600'"
                  >
                    {{ formatAuditValue(field, log.data_sebelum?.[field]) }}
                  </span>
                  <span class="mx-1 text-gray-400">-></span>
                  <span
                    :class="getAuditValueClass(field, log.data_sesudah?.[field]) || 'font-semibold text-green-700'"
                  >
                    {{ formatAuditValue(field, log.data_sesudah?.[field]) }}
                  </span>
                </template>
                <span
                  v-else
                  :class="getAuditValueClass(field, log.data_sesudah?.[field] ?? log.data_sebelum?.[field]) || 'font-semibold text-gray-900'"
                >
                  {{ getSingleAuditValue(log, field) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </template>

      <tr
        v-for="log in paginatedLogs"
        :key="log.id"
        :class="TABLE_ROW_HOVER_CLASS"
      >
        <td :class="AUDIT_TABLE_MUTED_CELL_CLASS">
          <div class="font-medium text-gray-700">
            {{ formatDateShort(log.created_at) }}
          </div>
        </td>
        <td :class="AUDIT_TABLE_CELL_CLASS">
          <div class="font-semibold text-gray-900">
            {{ formatNama(getAuditActorName(log)) }}
          </div>
          <span
            :class="[
              'mt-2 text-[11px] font-bold uppercase',
              getAuditActorRoleClass(getAuditActorRole(log)),
            ]"
          >
            {{ getAuditActorRole(log) }}
          </span>
        </td>
        <td :class="AUDIT_TABLE_CELL_CLASS">
          <div class="flex flex-wrap gap-2">
            <span
              :class="[
                'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                getAuditActionClass(log.aksi),
              ]"
            >
              {{ log.aksi }}
            </span>
            <span
              :class="[
                'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                getAuditModuleClass(log.modul),
              ]"
            >
              {{ log.modul }}
            </span>
          </div>
        </td>
        <td :class="AUDIT_TABLE_CELL_CLASS">
          <p class="font-semibold text-gray-900">
            {{ log.target_label || log.target_tipe || "-" }}
          </p>
          <p v-if="log.target_tipe" class="mt-1 text-xs text-gray-500">
            {{ formatFieldLabel(log.target_tipe) }}
          </p>
        </td>
        <td :class="AUDIT_TABLE_CELL_CLASS">
          <p class="text-gray-700">
            {{ log.deskripsi || "Aktivitas sistem diperbarui." }}
          </p>
        </td>
        <td :class="AUDIT_TABLE_CELL_CLASS">
          <div v-if="getVisibleChangedFields(log).length > 0" class="space-y-2">
            <div
              v-for="field in getVisibleChangedFields(log).slice(0, 1)"
              :key="`${log.id}-desktop-${field}`"
              class="rounded-lg bg-gray-50 px-3 py-2"
            >
              <p class="text-[11px] font-semibold uppercase text-gray-500">
                {{ formatFieldLabel(field) }}
              </p>
              <p class="mt-1 text-xs text-gray-700">
                <template v-if="shouldShowAuditArrow(log, field)">
                  <span
                    :class="getAuditValueClass(field, log.data_sebelum?.[field]) || 'text-red-600'"
                  >
                    {{ formatAuditValue(field, log.data_sebelum?.[field]) }}
                  </span>
                  <span class="mx-1 text-gray-400">-></span>
                  <span
                    :class="getAuditValueClass(field, log.data_sesudah?.[field]) || 'font-semibold text-green-700'"
                  >
                    {{ formatAuditValue(field, log.data_sesudah?.[field]) }}
                  </span>
                </template>
                <span
                  v-else
                  :class="getAuditValueClass(field, log.data_sesudah?.[field] ?? log.data_sebelum?.[field]) || 'font-semibold text-gray-900'"
                >
                  {{ getSingleAuditValue(log, field) }}
                </span>
              </p>
            </div>
          </div>
          <span v-else class="text-gray-400">-</span>
        </td>
      </tr>

      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="logs.length"
            :per-page="itemsPerPage"
            :from="from"
            :to="to"
            item-label="aktivitas"
            @page-change="emit('update:currentPage', $event)"
          />
        </div>
      </template>
    </TableShell>
  </div>
</template>
