<script setup lang="ts">
import { computed } from "vue";
// Helper warna icon dan teks.
import { getIconToneClass, getToneTextClass } from "@/utils/badgeVariants";
import type { IconToneKey } from "@/utils/badgeVariants";

// Bentuk statistik dari endpoint dasbor admin.
interface Statistik {
  pemesanan_hari_ini: number;
  sedang_dikerjakan: number;
  selesai_hari_ini: number;
}

// Bentuk konfigurasi satu kartu statistik.
interface StatKartu {
  label: string;
  key: keyof Statistik | "lowStock";
  color: IconToneKey;
  border: string;
  icon: string;
  route: string;
  suffix?: (value: number) => string;
}

// Props berisi statistik dan jumlah stok menipis/habis.
interface Props {
  statistik: Statistik;
  lowStockCount: number;
}

const props = defineProps<Props>();

// Konfigurasi semua kartu dibuat computed karena kartu stok tergantung lowStockCount.
const STAT_KARTU = computed<StatKartu[]>(() => [
  {
    label: "Pemesanan Hari Ini",
    key: "pemesanan_hari_ini",
    color: "info",
    border: "border-blue-500",
    icon: "mdi mdi-calendar-today",
    route: "/admin/pemesanan",
    suffix: () => "pemesanan",
  },
  {
    label: "Dikerjakan",
    key: "sedang_dikerjakan",
    color: "warning",
    border: "border-amber-500",
    icon: "mdi mdi-wrench-cog",
    route: "/admin/pemesanan",
    suffix: () => "vespa",
  },
  {
    label: "Selesai Hari Ini",
    key: "selesai_hari_ini",
    color: "success",
    border: "border-green-500",
    icon: "mdi mdi-check-circle",
    route: "/admin/pemesanan",
    suffix: () => "pemesanan",
  },
  {
    label: "Stok Kritis/Habis",
    key: "lowStock",
    color: props.lowStockCount > 0 ? "danger" : "success",
    border: props.lowStockCount > 0 ? "border-red-500" : "border-green-500",
    icon: props.lowStockCount > 0 ? "mdi mdi-alert-circle" : "mdi mdi-check-circle",
    route: "/admin/inventaris",
    suffix: (value) => (value > 0 ? "item perlu stok ulang" : "semua aman"),
  },
]);

// Mengambil nilai kartu berdasarkan key.
const getStatValue = (key: StatKartu["key"]) => {
  return key === "lowStock" ? props.lowStockCount : props.statistik[key];
};
</script>

<template>
  <!-- Grid kartu statistik admin. -->
  <div class="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
    <!-- Setiap kartu bisa diklik ke halaman terkait. -->
    <router-link
      v-for="card in STAT_KARTU"
      :key="card.key"
      :to="card.route"
      class="rounded-xl border-l-4 bg-white p-3 shadow-md transition-shadow hover:shadow-lg sm:p-6"
      :class="card.border"
    >
      <div class="flex items-center justify-between">
        <div>
          <!-- Label statistik. -->
          <p class="text-xs leading-tight text-gray-600 font-medium sm:text-sm">
            {{ card.label }}
          </p>
          <!-- Nilai statistik. -->
          <h3 class="mt-1 text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
            {{ getStatValue(card.key) }}
          </h3>
          <!-- Suffix/keterangan kecil. -->
          <p
            class="mt-1 text-[11px] sm:text-xs"
            :class="
              card.key === 'lowStock'
                ? getStatValue(card.key) > 0
                  ? `${getToneTextClass('danger')} font-medium`
                  : `${getToneTextClass('success')} font-medium`
                : 'text-gray-500'
            "
          >
            {{ card.suffix ? card.suffix(getStatValue(card.key)) : "" }}
          </p>
        </div>
        <!-- Icon sesuai jenis statistik. -->
        <div
          class="rounded-full p-2 sm:p-3"
          :class="getIconToneClass(card.color)"
        >
          <i :class="[card.icon, 'text-2xl sm:text-4xl']"></i>
        </div>
      </div>
    </router-link>
  </div>
</template>
