<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
import AdminDasborPemesananAksi from "./AdminDasborPemesananAksi.vue";
import AdminDasborPemesananMekanikCell from "./AdminDasborPemesananSelMekanik.vue";
import { META_LABEL_CLASS } from "@/utils/badgeVariants";

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
  complete: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
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

    <div class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2">
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
