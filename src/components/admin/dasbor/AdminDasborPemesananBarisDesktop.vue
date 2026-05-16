<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
import AdminDasborPemesananAksi from "@/components/admin/dasbor/AdminDasborPemesananAksi.vue";
import AdminDasborPemesananMekanikCell from "@/components/admin/dasbor/AdminDasborPemesananSelMekanik.vue";

interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
  rowClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMekanikId: null,
  rowClass: "transition-colors hover:bg-gray-50/80",
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
  <tr :class="props.rowClass">
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span class="text-gray-700">{{
        props.pemesanan.kode_pemesanan
      }}</span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      {{ formatDateShort(props.pemesanan.tanggal_pemesanan) }}
    </td>
    <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
      <span class="block truncate" :title="props.pemesanan.pengguna.nama">
        <span class="capitalize">{{ props.pemesanan.pengguna.nama }}</span>
      </span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 sm:px-6">
      <span :class="getStatusBadgeClass(props.pemesanan.status)">
        {{ getStatusLabel(props.pemesanan.status) }}
      </span>
    </td>
    <td class="whitespace-nowrap px-4 py-4 sm:px-6">
      <span
        :class="getPembayaranStatusBadgeClass(props.pemesanan.status_pembayaran)"
      >
        {{ getPembayaranStatusLabel(props.pemesanan.status_pembayaran) }}
      </span>
    </td>
    <td class="px-4 py-4 sm:px-6">
      <AdminDasborPemesananMekanikCell
        :pemesanan="props.pemesanan"
        :mekanik-options="props.mekanikOptions"
        :selected-mekanik-id="props.selectedMekanikId"
        variant="desktop"
        @update:selected-mekanik-id="emit('update:selectedMekanikId', $event)"
        @assign-and-start="emit('assignAndStart', props.pemesanan)"
      />
    </td>
    <td class="px-4 py-4 text-sm font-medium sm:px-6">
      <AdminDasborPemesananAksi
        :pemesanan="props.pemesanan"
        variant="desktop"
        @confirm="emit('confirm', $event)"
        @complete="emit('complete', $event)"
        @cancel="emit('cancel', $event)"
        @mark-paid="emit('markPaid', $event)"
      />
    </td>
  </tr>
</template>
