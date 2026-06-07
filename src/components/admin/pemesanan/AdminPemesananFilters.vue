<script setup lang="ts">
import { computed } from "vue";
// Select reusable untuk filter bulan/tahun/status.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Helper opsi bulan dan tahun.
import {
  getMonthOptionsStringWithAll,
  getYearOptionsString,
} from "@/utils/dateFilters";
// Opsi filter status servis.
import {
  PEMESANAN_STATUS_FILTER_OPTIONS,
  type PemesananStatusFilter,
} from "@/utils/statusBadge";
// Opsi filter status pembayaran.
import {
  PEMBAYARAN_STATUS_FILTER_OPTIONS,
  type PembayaranStatusFilter,
} from "@/utils/pembayaranStatus";
// Helper class input dan checkbox.
import {
  getFormCheckboxClass,
  getFormInputWithIconClass,
} from "@/utils/formVariants";

// Props filter berasal dari parent halaman pemesanan admin.
interface Props {
  searchQuery: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: PemesananStatusFilter;
  pembayaranFilter: PembayaranStatusFilter;
  showTodayOnly: boolean;
  totalPemesanan: number;
  filteredCount: number;
}

defineProps<Props>();

// Event v-model untuk setiap filter.
const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:monthFilter": [value: string];
  "update:yearFilter": [value: string];
  "update:statusFilter": [value: PemesananStatusFilter];
  "update:pembayaranFilter": [value: PembayaranStatusFilter];
  "update:showTodayOnly": [value: boolean];
}>();

// Opsi bulan dengan "Semua Bulan".
const MONTH_OPTIONS = getMonthOptionsStringWithAll();
// Opsi tahun dibuat computed agar mengikuti tahun saat ini.
const YEAR_OPTIONS = computed(() => getYearOptionsString(6));

// Ubah bulan lalu kirim ke parent.
const handleMonthChange = (value: string | number | null) => {
  emit("update:monthFilter", String(value || ""));
};

// Ubah tahun lalu kirim ke parent.
const handleYearChange = (value: string | number | null) => {
  emit("update:yearFilter", String(value || ""));
};

// Ubah status servis lalu kirim ke parent.
const handleStatusChange = (value: string | number | null) => {
  emit("update:statusFilter", (value || "all") as PemesananStatusFilter);
};

// Ubah status pembayaran lalu kirim ke parent.
const handlePembayaranChange = (value: string | number | null) => {
  emit("update:pembayaranFilter", (value || "all") as PembayaranStatusFilter);
};
</script>

<template>
  <div>
    <!-- Input pencarian full width. -->
    <div class="relative mb-3">
      <input
        :value="searchQuery"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
        type="text"
        placeholder="Cari pelanggan, vespa, atau plat nomor..."
        :class="getFormInputWithIconClass()"
      />
      <i
        class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400"
      ></i>
    </div>

    <!-- Grid filter: 2 kolom di mobile, sejajar di desktop. -->
    <div class="grid grid-cols-2 gap-2 md:flex md:gap-4 mb-3">
      <CustomSelect
        :model-value="monthFilter"
        @update:model-value="handleMonthChange"
        :options="MONTH_OPTIONS"
        placeholder="Semua Bulan"
      />
      <CustomSelect
        :model-value="yearFilter"
        @update:model-value="handleYearChange"
        :options="YEAR_OPTIONS"
        placeholder="Pilih tahun"
      />
      <CustomSelect
        :model-value="statusFilter"
        @update:model-value="handleStatusChange"
        :options="PEMESANAN_STATUS_FILTER_OPTIONS"
        placeholder="Semua Status"
      />
      <CustomSelect
        :model-value="pembayaranFilter"
        @update:model-value="handlePembayaranChange"
        :options="PEMBAYARAN_STATUS_FILTER_OPTIONS"
        placeholder="Semua Pembayaran"
      />
    </div>

    <!-- Checkbox filter pemesanan hari ini. -->
    <div class="mb-3">
      <label class="inline-flex items-center gap-2">
        <input
          type="checkbox"
          :checked="showTodayOnly"
          @change="
            emit(
              'update:showTodayOnly',
              ($event.target as HTMLInputElement).checked,
            )
          "
          :class="getFormCheckboxClass()"
        />
        <span class="text-sm text-gray-700">Tampilkan Pemesanan Hari Ini</span>
      </label>
    </div>
  </div>
</template>
