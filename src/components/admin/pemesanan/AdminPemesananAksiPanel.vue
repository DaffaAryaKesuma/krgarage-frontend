<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  canAdminAssignAndStart,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusSelesai,
} from "@/utils/statusBadge";
import { isUnpaidStatus } from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
});

const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

const canShowMarkPaidAksi = (pemesanan: Pemesanan): boolean =>
  isStatusSelesai(pemesanan.status) &&
  isUnpaidStatus(pemesanan.status_pembayaran);

const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};

const BTN_DETAIL =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50";
const BTN_CANCEL =
  "w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-400 bg-white py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50";
</script>

<template>
  <div class="space-y-2 mt-2">
    <!-- Konfirmasi -->
    <div v-if="canAdminConfirmPemesanan(props.pemesanan.status)" class="space-y-2">
      <button
        @click="emit('confirm', props.pemesanan)"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-blue-700 border border-blue-700 transition hover:bg-blue-50"
      >
        <i class="mdi mdi-check-circle"></i> Konfirmasi
      </button>
      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('cancel', props.pemesanan)" :class="BTN_CANCEL">
          <i class="mdi mdi-close-circle"></i> Batalkan
        </button>
        <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Assign Mekanik -->
    <div v-else-if="canAdminAssignAndStart(props.pemesanan.status)" class="space-y-2">
      <div class="rounded-lg border border-blue-200  p-3">
        <p class="mb-2 text-xs font-medium text-blue-700">
          <i class="mdi mdi-information"></i> Pilih mekanik untuk mulai servis
        </p>
        <CustomSelect
          :model-value="props.selectedMekanikId"
          @update:model-value="handleMekanikChange"
          :options="props.mekanikOptions"
          placeholder="Pilih Mekanik"
          class="mb-2"
        />
        <button
          @click="emit('assignAndStart', props.pemesanan)"
          :disabled="!props.selectedMekanikId"
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-blue-700 border border-blue-700 transition hover:bg-blue-50 disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <i class="mdi mdi-play-circle"></i> Mulai Servis
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('cancel', props.pemesanan)" :class="BTN_CANCEL">
          <i class="mdi mdi-close-circle"></i> Batalkan
        </button>
        <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Tandai Selesai -->
    <div v-else-if="canAdminCompletePemesanan(props.pemesanan.status)" class="space-y-2">
      <div class="rounded-lg border border-amber-100 bg-amber-50 p-2">
        <p class="text-xs text-amber-700">
          <i class="mdi mdi-wrench-cog"></i>
          Dikerjakan: <strong class="capitalize">{{ props.pemesanan.mekanik?.nama || "Belum ditentukan" }}</strong>
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('complete', props.pemesanan)"
          class="w-full flex items-center justify-center gap-1.5 rounded-lg border border-green-600 bg-white py-2 text-xs font-semibold text-green-600 transition hover:bg-green-50"
        >
          <i class="mdi mdi-check-all"></i> Selesai
        </button>
        <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Tandai Lunas -->
    <div v-else-if="canShowMarkPaidAksi(props.pemesanan)" class="grid grid-cols-2 gap-2">
      <button
        @click="emit('markPaid', props.pemesanan)"
        class="w-full flex items-center justify-center gap-1.5 rounded-lg border border-green-600 bg-white py-2 text-xs font-semibold text-green-600 transition hover:bg-green-50"
      >
        <i class="mdi mdi-cash-check"></i> Tandai Lunas
      </button>
      <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
        <i class="mdi mdi-eye"></i> Detail
      </router-link>
    </div>

    <!-- Hanya Detail -->
    <div v-else>
      <router-link
        :to="`/admin/pemesanan/${props.pemesanan.id}`"
        class="block w-full rounded-lg border border-gray-700 bg-white py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <i class="mdi mdi-eye mr-1"></i> Lihat Detail
      </router-link>
    </div>
  </div>
</template>
