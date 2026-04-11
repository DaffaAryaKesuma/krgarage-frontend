<script setup lang="ts">
import { computed } from "vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  getMonthOptionsStringWithAll,
  getYearOptionsString,
} from "@/utils/dateFilters";
import {
  BOOKING_STATUS_FILTER_OPTIONS,
  type BookingStatusFilter,
} from "@/utils/statusBadge";

interface Props {
  searchQuery: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: BookingStatusFilter;
  showTodayOnly: boolean;
  totalBookings: number;
  filteredCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:monthFilter": [value: string];
  "update:yearFilter": [value: string];
  "update:statusFilter": [value: BookingStatusFilter];
  "update:showTodayOnly": [value: boolean];
}>();

const MONTH_OPTIONS = getMonthOptionsStringWithAll();
const YEAR_OPTIONS = computed(() => getYearOptionsString(6));

const handleMonthChange = (value: string | number | null) => {
  emit("update:monthFilter", String(value || ""));
};

const handleYearChange = (value: string | number | null) => {
  emit("update:yearFilter", String(value || ""));
};

const handleStatusChange = (value: string | number | null) => {
  emit("update:statusFilter", (value || "all") as BookingStatusFilter);
};
</script>

<template>
  <div>
    <!-- Search & Filter Bar -->
    <div class="mb-6 space-y-3 md:space-y-0 md:flex md:gap-4">
      <!-- Search Input -->
      <div class="flex-1">
        <div class="relative">
          <input
            :value="searchQuery"
            @input="
              emit(
                'update:searchQuery',
                ($event.target as HTMLInputElement).value,
              )
            "
            type="text"
            placeholder="Cari pelanggan, vespa, atau plat nomor..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <i
            class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400"
          ></i>
        </div>
      </div>

      <!-- Month Filter -->
      <div class="md:w-40">
        <CustomSelect
          :model-value="monthFilter"
          @update:model-value="handleMonthChange"
          :options="MONTH_OPTIONS"
          placeholder="Semua Bulan"
        />
      </div>

      <!-- Year Filter -->
      <div class="md:w-40">
        <CustomSelect
          :model-value="yearFilter"
          @update:model-value="handleYearChange"
          :options="YEAR_OPTIONS"
          placeholder="Pilih tahun"
        />
      </div>

      <!-- Status Filter -->
      <div class="md:w-48">
        <CustomSelect
          :model-value="statusFilter"
          @update:model-value="handleStatusChange"
          :options="BOOKING_STATUS_FILTER_OPTIONS"
          placeholder="Semua Status"
        />
      </div>
    </div>

    <!-- Show Today Only Checkbox -->
    <div class="mb-4">
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
          class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <span class="text-sm text-gray-700">Tampilkan Pemesanan Hari Ini</span>
      </label>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-600">
      Menampilkan {{ filteredCount }} dari {{ totalBookings }} pemesanan
    </div>
  </div>
</template>
