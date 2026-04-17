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
      class="font-semibold text-gray-900 tracking-wide mb-3"
    >
    <i class="mdi mdi-wrench text-purple-600 text-xl"></i>
      Layanan
    </h3>
    <div class="space-y-2">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex items-center justify-between py-3 px-4 bg-gray-100 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <span class="font-medium text-gray-900">{{
            service.nama_layanan
          }}</span>
        </div>
        <span class="font-medium text-gray-900">{{ toIDR(service.harga) }}</span>
      </div>
    </div>
  </div>
</template>
