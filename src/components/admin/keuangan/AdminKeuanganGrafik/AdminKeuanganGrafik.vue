<script setup lang="ts">
import { useAdminKeuanganGrafik } from "@/components/admin/keuangan/AdminKeuanganGrafik/useAdminKeuanganGrafik";

const props = defineProps<{
  monthlyData: Array<{ bulan: number; pendapatan: string }>;
  selectedYear: number;
}>();

const { kanvasGrafik } = useAdminKeuanganGrafik(() => props.monthlyData);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Pendapatan Bulanan {{ selectedYear }}
    </h2>
    <canvas ref="kanvasGrafik" class="w-full max-h-[400px]"></canvas>
  </div>
</template>
