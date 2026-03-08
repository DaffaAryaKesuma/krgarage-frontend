<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface TopService {
  nama_layanan: string;
  total_pesanan: number;
  total_pendapatan: number;
}

interface Props {
  topServices: TopService[];
}

defineProps<Props>();

const SERVICE_BADGE_COLORS = [
  "bg-gradient-to-br from-yellow-400 to-yellow-500",
  "bg-gradient-to-br from-gray-400 to-gray-500",
  "bg-gradient-to-br from-orange-600 to-orange-700",
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-green-500 to-green-600",
];

const getServiceBadgeColor = (index: number) =>
  SERVICE_BADGE_COLORS[index] || "bg-gradient-to-br from-gray-500 to-gray-600";
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Layanan Paling Laris
    </h2>
    <div class="space-y-4">
      <div
        v-for="(service, index) in topServices"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white"
            :class="getServiceBadgeColor(index)"
          >
            {{ index + 1 }}
          </div>
          <div>
            <p class="font-medium text-gray-900">
              {{ service.nama_layanan }}
            </p>
            <p class="text-sm text-gray-600">
              {{ service.total_pesanan }} pesanan
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold text-gray-900">
            {{ toIDR(service.total_pendapatan) }}
          </p>
          <p class="text-sm text-gray-600">Total Pendapatan</p>
        </div>
      </div>
    </div>
  </div>
</template>
