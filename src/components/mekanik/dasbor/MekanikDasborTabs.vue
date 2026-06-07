<script setup lang="ts">
import { getButtonClass } from "@/utils/buttonVariants";

// Tab dashboard mekanik hanya punya dua mode.
interface Props {
  activeTab: "active" | "riwayat";
}

const props = defineProps<Props>();

// update:activeTab mengubah tab aktif, riwayatClick dipakai parent untuk fetch riwayat.
const emit = defineEmits<{
  "update:activeTab": [value: "active" | "riwayat"];
  riwayatClick: [];
}>();

const getTabButtonClass = (tab: "active" | "riwayat") =>
  getButtonClass(
    "ghost",
    "md",
    [
      "shrink-0 rounded-none border-b-2 !bg-transparent px-4 py-2 text-sm font-semibold shadow-none whitespace-nowrap hover:!bg-white/10 sm:px-6 sm:py-3 sm:text-base",
      props.activeTab === tab
        ? "border-white !text-white hover:!bg-transparent"
        : "border-transparent !text-red-100 hover:!text-white",
    ].join(" "),
  );
</script>

<template>
  <!-- Header dashboard mekanik sekaligus tab navigasi. -->
  <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
        Dasbor Mekanik
      </h1>

      <!-- Tab pekerjaan aktif dan riwayat. -->
      <div
        class="flex space-x-1 sm:space-x-2 border-b border-red-400 overflow-x-auto"
      >
        <!-- Tab pekerjaan aktif. -->
        <button
          @click="emit('update:activeTab', 'active')"
          :class="getTabButtonClass('active')"
        >
          Pekerjaan Aktif
        </button>
        <!-- Tab riwayat sekaligus memicu parent untuk memuat data riwayat. -->
        <button
          @click="
            emit('update:activeTab', 'riwayat');
            emit('riwayatClick');
          "
          :class="getTabButtonClass('riwayat')"
        >
          Riwayat
        </button>
      </div>
    </div>
  </div>
</template>
