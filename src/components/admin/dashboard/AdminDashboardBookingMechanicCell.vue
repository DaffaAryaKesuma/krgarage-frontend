<script setup lang="ts">
import { computed } from "vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import { canAdminAssignAndStart } from "@/utils/statusBadge";
import type { Booking, MekanikOption } from "@/types/booking";

interface Props {
  booking: Booking;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
  variant?: "mobile" | "desktop";
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
  variant: "desktop",
});

const emit = defineEmits<{
  assignAndStart: [booking: Booking];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

const isMobileVariant = computed(() => props.variant === "mobile");

const showDesktopFallback = computed(
  () =>
    !isMobileVariant.value &&
    !canAdminAssignAndStart(props.booking.status) &&
    !props.booking.mekanik,
);

const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};
</script>

<template>
  <div
    v-if="canAdminAssignAndStart(props.booking.status)"
    :class="isMobileVariant ? 'space-y-2' : 'flex min-w-0 items-center gap-1.5'"
  >
    <template v-if="isMobileVariant">
      <p class="text-xs font-medium text-blue-700">Pilih mekanik</p>
      <CustomSelect
        :model-value="props.selectedMekanikId"
        @update:model-value="handleMekanikChange"
        :options="props.mekanikOptions"
        placeholder="Pilih Mekanik"
      />
      <button
        @click="emit('assignAndStart', props.booking)"
        :disabled="!props.selectedMekanikId"
        class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Assign & Mulai Servis
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
        @click="emit('assignAndStart', props.booking)"
        :disabled="!props.selectedMekanikId"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
        title="Mulai Servis"
      >
        <i class="mdi mdi-play-circle text-xl"></i>
      </button>
    </template>
  </div>

  <span
    v-else-if="props.booking.mekanik"
    class="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700"
  >
    <i class="mdi mdi-account-wrench text-sm text-gray-500"></i>
    {{ props.booking.mekanik.nama }}
  </span>

  <span
    v-else-if="showDesktopFallback"
    class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500"
  >
    Belum ditetapkan
  </span>
</template>
