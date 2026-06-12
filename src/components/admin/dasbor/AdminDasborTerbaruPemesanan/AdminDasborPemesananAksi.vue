<script setup lang="ts">
import { computed } from "vue";
// Helper aturan status untuk menentukan tombol yang muncul.
import {
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusSelesai,
} from "@/utils/statusBadge";
// Helper status pembayaran.
import { isUnpaidStatus } from "@/utils/pembayaranStatus";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";
import type { Pemesanan } from "@/types/pemesanan";

// Props aksi pemesanan di baris/card dasbor.
interface Props {
  pemesanan: Pemesanan;
  variant?: "mobile" | "desktop";
}

// variant mobile/desktop memengaruhi layout tombol.
const props = withDefaults(defineProps<Props>(), {
  variant: "desktop",
});

// Event aksi dikirim ke parent.
const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
}>();

// true jika dipakai di kartu mobile.
const isMobileVariant = computed(() => props.variant === "mobile");
// Batal tampil selama aturan status mengizinkan.
const canShowCancelAksi = computed(() =>
  canAdminCancelPemesanan(props.pemesanan.status),
);
// Tandai lunas tampil jika selesai dan belum lunas.
const canShowMarkPaidAksi = computed(
  () =>
    isStatusSelesai(props.pemesanan.status) &&
    isUnpaidStatus(props.pemesanan.status_pembayaran),
);
const visibleActionCount = computed(
  () =>
    Number(canAdminConfirmPemesanan(props.pemesanan.status)) +
    Number(canAdminCompletePemesanan(props.pemesanan.status)) +
    Number(canShowCancelAksi.value) +
    Number(canShowMarkPaidAksi.value),
);
// Layout wrapper beda antara mobile dan desktop.
const wrapperClass = computed(() =>
  isMobileVariant.value
    ? "mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3"
    : "flex flex-col items-start gap-2",
);

// Tinggi tombol aksi beda per variant.
const aksiButtonClass = computed(() =>
  isMobileVariant.value
    ? "h-9"
    : "h-8",
);

// Class tombol detail dibuat melebar penuh di mobile agar mudah ditekan.
const detailClass = computed(() =>
  isMobileVariant.value
    ? getButtonClass(
        "infoOutline",
        "xs",
        visibleActionCount.value === 1
          ? "h-9 no-underline"
          : "col-span-2 h-9 no-underline",
      )
    : getButtonClass("infoOutline", "xs", "h-8 shrink-0 no-underline"),
);
</script>

<template>
  <!-- Kumpulan tombol aksi untuk satu pemesanan. -->
  <div :class="wrapperClass">
    <button
      v-if="canAdminConfirmPemesanan(props.pemesanan.status)"
      @click="emit('confirm', props.pemesanan)"
      :class="getButtonClass('infoOutline', 'xs', aksiButtonClass)"
      title="Konfirmasi"
    >
      Konfirmasi
    </button>

    <button
      v-if="canAdminCompletePemesanan(props.pemesanan.status)"
      @click="emit('complete', props.pemesanan)"
      :class="getButtonClass('successOutline', 'xs', aksiButtonClass)"
      title="Tandai Selesai"
    >
      Tandai Selesai
    </button>

    <button
      v-if="canShowCancelAksi"
      @click="emit('cancel', props.pemesanan)"
      :class="getButtonClass('dangerOutline', 'xs', aksiButtonClass)"
      title="Batalkan"
    >
      Batalkan
    </button>

    <button
      v-if="canShowMarkPaidAksi"
      @click="emit('markPaid', props.pemesanan)"
      :class="getButtonClass('successOutline', 'xs', aksiButtonClass)"
      title="Tandai Lunas"
    >
      Tandai Lunas
    </button>

    <router-link
      :to="`/admin/pemesanan/${props.pemesanan.id}`"
      :class="detailClass"
    >
      Detail &rarr;
    </router-link>
  </div>
</template>
