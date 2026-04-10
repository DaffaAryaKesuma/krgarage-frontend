<script setup lang="ts">
import { toIDR } from "@/utils/money";
import type { Booking } from "@/types/booking";

interface Props {
  services: Booking["layanan"];
}

defineProps<Props>();
</script>

<template>
  <div>
    <h3
      class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"
    >
      Layanan
    </h3>
    <div class="space-y-2">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
      >
        <div class="flex items-center gap-3">
          <span class="font-medium text-gray-900">{{
            service.nama_layanan
          }}</span>
        </div>
        <span class="font-bold text-gray-900">{{ toIDR(service.harga) }}</span>
      </div>
    </div>
  </div>
</template>
