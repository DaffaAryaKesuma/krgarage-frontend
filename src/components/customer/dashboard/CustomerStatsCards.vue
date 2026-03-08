<script setup lang="ts">
interface Props {
  vespaCount: number;
  totalBookings: number;
  activeBookings: number;
}

const props = defineProps<Props>();
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    <div
      class="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-gray-500 font-medium text-xs sm:text-sm mb-1">
            Vespa Terdaftar
          </h4>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ vespaCount }}
          </p>
        </div>
        <i
          class="mdi mdi-motorbike text-4xl sm:text-5xl text-red-500 opacity-20"
        ></i>
      </div>
    </div>
    <div
      class="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-gray-500 font-medium text-xs sm:text-sm mb-1">
            Total Servis
          </h4>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ totalBookings }}
          </p>
        </div>
        <i
          class="mdi mdi-clipboard-list text-4xl sm:text-5xl text-green-500 opacity-20"
        ></i>
      </div>
    </div>
    <div
      class="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-gray-500 font-medium text-xs sm:text-sm mb-1">
            Pemesanan Aktif
          </h4>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ activeBookings }}
          </p>
        </div>
        <i
          class="mdi mdi-clock-outline text-4xl sm:text-5xl text-purple-500 opacity-20"
        ></i>
      </div>
    </div>
  </section>
</template>
