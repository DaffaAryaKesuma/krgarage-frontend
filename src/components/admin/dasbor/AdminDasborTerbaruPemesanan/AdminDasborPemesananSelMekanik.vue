<script setup lang="ts">
import { computed } from "vue";
// Select mekanik untuk status yang siap dimulai.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Aturan status untuk menentukan apakah assign mekanik boleh muncul.
import { canAdminAssignAndStart } from "@/utils/statusBadge";
// Helper class label, chip, dan tombol.
import { META_LABEL_CLASS, getChipBadgeClass } from "@/utils/badgeVariants";
import { getFullWidthButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

// Props cell mekanik.
interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
  variant?: "mobile" | "desktop";
}

// Default selectedMekanikId null dan variant desktop.
const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
  variant: "desktop",
});

// Event assign dan update v-model mekanik.
const emit = defineEmits<{
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

// true jika cell dipakai di card mobile.
const isMobileVariant = computed(() => props.variant === "mobile");

// Desktop fallback tampil jika tidak bisa assign dan belum ada mekanik.
const showDesktopFallback = computed(
  () =>
    !isMobileVariant.value &&
    !canAdminAssignAndStart(props.pemesanan.status) &&
    !props.pemesanan.mekanik,
);

// Update pilihan mekanik ke parent.
const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};
</script>

<template>
  <!-- Jika status bisa assign, tampilkan dropdown mekanik dan tombol mulai. -->
  <div
    v-if="canAdminAssignAndStart(props.pemesanan.status)"
    :class="isMobileVariant ? 'space-y-2' : 'flex min-w-0 items-center gap-1.5'"
  >
    <!-- Layout mobile dibuat vertikal. -->
    <template v-if="isMobileVariant">
      <p :class="META_LABEL_CLASS">Pilih mekanik</p>
      <CustomSelect
        :model-value="props.selectedMekanikId"
        @update:model-value="handleMekanikChange"
        :options="props.mekanikOptions"
        placeholder="Pilih Mekanik"
      />
      <button
        @click="emit('assignAndStart', props.pemesanan)"
        :disabled="!props.selectedMekanikId"
        :class="getFullWidthButtonClass('infoOutline', 'md')"
      >
        Mulai Servis
      </button>
    </template>

    <!-- Layout desktop dibuat ringkas dalam satu baris. -->
    <template v-else>
      <div class="w-[170px] shrink-0">
        <CustomSelect
          :model-value="props.selectedMekanikId"
          @update:model-value="handleMekanikChange"
          :options="props.mekanikOptions"
          placeholder="Pilih mekanik"
          :truncate-selected-label="false"
          class="h-9 px-3 py-1.5 text-sm"
        />
      </div>
      <button
        @click="emit('assignAndStart', props.pemesanan)"
        :disabled="!props.selectedMekanikId"
        :class="getIconButtonClass('info', 'md', 'shrink-0')"
        title="Mulai Servis"
      >
        <i class="mdi mdi-play-circle text-xl"></i>
      </button>
    </template>
  </div>

  <!-- Jika mekanik sudah ada, tampilkan nama mekanik. -->
  <span
    v-else-if="props.pemesanan.mekanik"
    :class="[getChipBadgeClass('neutral'), 'gap-1']"
  >
    <i class="mdi mdi-account-wrench text-sm text-gray-500"></i>
    <span class="capitalize">{{ props.pemesanan.mekanik.nama }}</span>
  </span>

  <!-- Fallback desktop jika belum ditetapkan. -->
  <span
    v-else-if="showDesktopFallback"
    :class="getChipBadgeClass('neutral')"
  >
    Belum ditetapkan
  </span>
</template>
