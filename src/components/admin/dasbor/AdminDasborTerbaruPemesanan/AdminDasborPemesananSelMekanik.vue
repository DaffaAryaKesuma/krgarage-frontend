<script setup lang="ts">
import { computed } from "vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import { canAdminAssignAndStart } from "@/utils/statusBadge";
import { META_LABEL_CLASS, getChipBadgeClass } from "@/utils/badgeVariants";
import { getFullWidthButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
  variant?: "mobile" | "desktop";
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
  variant: "desktop",
});

const emit = defineEmits<{
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

const isMobileVariant = computed(() => props.variant === "mobile");

const showDesktopFallback = computed(
  () =>
    !isMobileVariant.value &&
    !canAdminAssignAndStart(props.pemesanan.status) &&
    !props.pemesanan.mekanik,
);

const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};
</script>

<template>
  <div
    v-if="canAdminAssignAndStart(props.pemesanan.status)"
    :class="isMobileVariant ? 'space-y-2' : 'flex min-w-0 items-center gap-1.5'"
  >
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

  <span
    v-else-if="props.pemesanan.mekanik"
    :class="[getChipBadgeClass('neutral'), 'gap-1']"
  >
    <i class="mdi mdi-account-wrench text-sm text-gray-500"></i>
    <span class="capitalize">{{ props.pemesanan.mekanik.nama }}</span>
  </span>

  <span
    v-else-if="showDesktopFallback"
    :class="getChipBadgeClass('neutral')"
  >
    Belum ditetapkan
  </span>
</template>
