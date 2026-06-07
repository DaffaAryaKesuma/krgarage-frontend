<script setup lang="ts">
// Helper warna teks icon.
import { getToneTextClass } from "@/utils/badgeVariants";

// Props angka statistik pelanggan.
interface Props {
  vespaCount: number;
  totalPemesanan: number;
  activePemesanan: number;
}

defineProps<Props>();
</script>

<template>
  <!-- Grid statistik ringkas dashboard pelanggan. -->
  <section
    class="grid grid-cols-3 gap-2 sm:gap-4 xl:grid-cols-3"
  >
    <!-- Jumlah Vespa milik pelanggan. -->
    <div
      class="rounded-lg border-l-4 border-red-500 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:p-6"
    >
      <div class="flex items-center justify-between gap-2">
        <div>
          <h4 class="mb-0.5 text-[10px] font-medium leading-tight text-gray-500 sm:mb-1 sm:text-sm">
            Vespa Terdaftar
          </h4>
          <p class="text-xl font-bold text-gray-900 sm:text-3xl">
            {{ vespaCount }}
          </p>
        </div>
        <i
          :class="[
            getToneTextClass('primary'),
            'mdi mdi-motorbike hidden text-4xl opacity-20 min-[420px]:block sm:text-5xl',
          ]"
        ></i>
      </div>
    </div>
    <!-- Total servis yang pernah dibuat pelanggan. -->
    <div
      class="rounded-lg border-l-4 border-green-500 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:p-6"
    >
      <div class="flex items-center justify-between gap-2">
        <div>
          <h4 class="mb-0.5 text-[10px] font-medium leading-tight text-gray-500 sm:mb-1 sm:text-sm">
            Total Servis
          </h4>
          <p class="text-xl font-bold text-gray-900 sm:text-3xl">
            {{ totalPemesanan }}
          </p>
        </div>
        <i
          :class="[
            getToneTextClass('success'),
            'mdi mdi-clipboard-list hidden text-4xl opacity-20 min-[420px]:block sm:text-5xl',
          ]"
        ></i>
      </div>
    </div>
    <!-- Pemesanan yang masih aktif. -->
    <div
      class="rounded-lg border-l-4 border-purple-500 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:p-6"
    >
      <div class="flex items-center justify-between gap-2">
        <div>
          <h4 class="mb-0.5 text-[10px] font-medium leading-tight text-gray-500 sm:mb-1 sm:text-sm">
            Pemesanan Aktif
          </h4>
          <p class="text-xl font-bold text-gray-900 sm:text-3xl">
            {{ activePemesanan }}
          </p>
        </div>
        <i
          :class="[
            getToneTextClass('owner'),
            'mdi mdi-clock-outline hidden text-4xl opacity-20 min-[420px]:block sm:text-5xl',
          ]"
        ></i>
      </div>
    </div>
  </section>
</template>
