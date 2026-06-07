<script setup lang="ts">
// Composable Chart.js untuk grafik keuangan.
import { useAdminKeuanganGrafik } from "@/components/admin/keuangan/AdminKeuanganGrafik/useAdminKeuanganGrafik";

// Props data grafik dan tahun terpilih.
const props = defineProps<{
  monthlyData: Array<{ bulan: number; pendapatan: string }>;
  selectedYear: number;
}>();

// Ref canvas dihubungkan ke Chart.js.
const { kanvasGrafik } = useAdminKeuanganGrafik(() => props.monthlyData);
</script>

<template>
  <!-- Card grafik pendapatan bulanan. -->
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Pendapatan Bulanan {{ selectedYear }}
    </h2>
    <!-- Canvas tempat Chart.js menggambar. -->
    <canvas ref="kanvasGrafik" class="w-full max-h-[400px]"></canvas>
  </div>
</template>
