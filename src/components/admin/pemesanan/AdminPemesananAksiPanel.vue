<script setup lang="ts">
// Select mekanik dipakai saat admin mau mulai servis.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Helper aturan status menentukan tombol mana yang boleh muncul.
import {
  canAdminAssignAndStart,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusSelesai,
} from "@/utils/statusBadge";
// Helper status pembayaran.
import { isUnpaidStatus } from "@/utils/pembayaranStatus";
// Helper class alert dan tombol.
import { getAlertBoxClass } from "@/utils/badgeVariants";
import { getFullWidthButtonClass } from "@/utils/buttonVariants";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

// Props berisi data pemesanan, opsi mekanik, dan mekanik terpilih.
interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

// selectedMekanikId default null jika parent belum memilih mekanik.
const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
});

// Semua aksi dikirim ke parent agar parent yang mengubah API/state.
const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

// Tombol tandai lunas hanya muncul jika servis selesai dan pembayaran belum lunas.
const canShowMarkPaidAksi = (pemesanan: Pemesanan): boolean =>
  isStatusSelesai(pemesanan.status) &&
  isUnpaidStatus(pemesanan.status_pembayaran);

// Saat dropdown mekanik berubah, update v-model parent.
const handleMekanikChange = (value: string | number | null) => {
  emit("update:selectedMekanikId", typeof value === "number" ? value : null);
};

// Class tombol dipusatkan agar template tidak terlalu panjang.
const BTN_DETAIL =
  getFullWidthButtonClass("neutralOutline", "sm", "gap-1.5 no-underline");
const BTN_CANCEL = getFullWidthButtonClass("dangerOutline", "sm", "gap-1.5");
const BTN_INFO = getFullWidthButtonClass("infoOutline", "sm", "text-sm");
const BTN_SUCCESS = getFullWidthButtonClass("successOutline", "sm", "gap-1.5");
</script>

<template>
  <!-- Panel aksi di bagian bawah kartu pemesanan. -->
  <div class="space-y-2 mt-2">
    <!-- Jika masih Menunggu, admin bisa konfirmasi atau batalkan. -->
    <div v-if="canAdminConfirmPemesanan(props.pemesanan.status)" class="space-y-2">
      <button
        @click="emit('confirm', props.pemesanan)"
        :class="BTN_INFO"
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

    <!-- Jika sudah dikonfirmasi, admin pilih mekanik lalu mulai servis. -->
    <div v-else-if="canAdminAssignAndStart(props.pemesanan.status)" class="space-y-2">
      <div :class="[getAlertBoxClass('info'), 'p-3 shadow-none']">
        <p class="mb-2 text-xs font-medium">
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
          :class="BTN_INFO"
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

    <!-- Jika sedang dikerjakan, admin bisa tandai selesai. -->
    <div v-else-if="canAdminCompletePemesanan(props.pemesanan.status)" class="space-y-2">
      <div :class="[getAlertBoxClass('warning'), 'p-2 shadow-none']">
        <p class="text-xs">
          <i class="mdi mdi-wrench-cog"></i>
          Dikerjakan: <strong class="capitalize">{{ props.pemesanan.mekanik?.nama || "Belum ditentukan" }}</strong>
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="emit('complete', props.pemesanan)"
          :class="BTN_SUCCESS"
        >
          <i class="mdi mdi-check-all"></i> Selesai
        </button>
        <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
          <i class="mdi mdi-eye"></i> Detail
        </router-link>
      </div>
    </div>

    <!-- Jika selesai tapi belum lunas, admin bisa tandai lunas. -->
    <div v-else-if="canShowMarkPaidAksi(props.pemesanan)" class="grid grid-cols-2 gap-2">
      <button
        @click="emit('markPaid', props.pemesanan)"
        :class="BTN_SUCCESS"
      >
        <i class="mdi mdi-cash-check"></i> Tandai Lunas
      </button>
      <router-link :to="`/admin/pemesanan/${props.pemesanan.id}`" :class="BTN_DETAIL">
        <i class="mdi mdi-eye"></i> Detail
      </router-link>
    </div>

    <!-- Selain kondisi di atas, hanya tampilkan tombol detail. -->
    <div v-else>
      <router-link
        :to="`/admin/pemesanan/${props.pemesanan.id}`"
        :class="getFullWidthButtonClass('neutralOutline', 'sm', 'no-underline')"
      >
        <i class="mdi mdi-eye mr-1"></i> Lihat Detail
      </router-link>
    </div>
  </div>
</template>
