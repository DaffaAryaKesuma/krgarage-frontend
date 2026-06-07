<script setup lang="ts">
// Helper format tanggal dan status.
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
// Komponen aksi dan cell mekanik dipakai ulang.
import AdminDasborPemesananAksi from "./AdminDasborPemesananAksi.vue";
import AdminDasborPemesananMekanikCell from "./AdminDasborPemesananSelMekanik.vue";
// Class responsive table mobile.
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
import {
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_CARD_SINGLE_GRID_CLASS,
} from "@/utils/tableVariants";

// Props kartu mobile pemesanan dasbor.
interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

// Default selectedMekanikId null.
const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
});

// Event aksi diteruskan ke komponen utama.
const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();
</script>

<template>
  <!-- Kartu mobile untuk satu pemesanan terbaru. -->
  <div :class="TABLE_MOBILE_CARD_CLASS">
    <!-- Header kode pemesanan dan status servis. -->
    <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">
          Kode Pemesanan
        </p>
        <p class="text-sm text-gray-700">
          {{ props.pemesanan.kode_pemesanan }}
        </p>
      </div>
      <span :class="getStatusBadgeClass(props.pemesanan.status)">
        {{ getStatusLabel(props.pemesanan.status) }}
      </span>
    </div>

    <!-- Status pembayaran. -->
    <div class="mt-2 flex items-center justify-between gap-2">
      <p :class="META_LABEL_CLASS">
        Pembayaran
      </p>
      <span
        :class="getPembayaranStatusBadgeClass(props.pemesanan.status_pembayaran)"
      >
        {{ getPembayaranStatusLabel(props.pemesanan.status_pembayaran) }}
      </span>
    </div>

    <!-- Info tanggal dan pelanggan. -->
    <div :class="TABLE_MOBILE_CARD_SINGLE_GRID_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">
          Tanggal
        </p>
        <p class="text-gray-700">
          {{ formatDateShort(props.pemesanan.tanggal_pemesanan) }}
        </p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">
          Pelanggan
        </p>
        <p class="text-gray-700">
          <span class="capitalize">{{ props.pemesanan.pengguna.nama }}</span>
        </p>
      </div>
    </div>

    <!-- Dropdown/nama mekanik. -->
    <div class="mt-3">
      <AdminDasborPemesananMekanikCell
        :pemesanan="props.pemesanan"
        :mekanik-options="props.mekanikOptions"
        :selected-mekanik-id="props.selectedMekanikId"
        variant="mobile"
        @update:selected-mekanik-id="emit('update:selectedMekanikId', $event)"
        @assign-and-start="emit('assignAndStart', props.pemesanan)"
      />
    </div>

    <!-- Tombol aksi mobile. -->
    <AdminDasborPemesananAksi
      :pemesanan="props.pemesanan"
      variant="mobile"
      @confirm="emit('confirm', $event)"
      @complete="emit('complete', $event)"
      @cancel="emit('cancel', $event)"
      @mark-paid="emit('markPaid', $event)"
    />
  </div>
</template>
