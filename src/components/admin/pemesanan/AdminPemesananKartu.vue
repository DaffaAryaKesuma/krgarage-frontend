<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import {
  getStatusBadgeClass,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import AdminPemesananAksiPanel from "@/components/admin/pemesanan/AdminPemesananAksiPanel.vue";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

defineProps<Props>();

const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

const getUserInitial = (name?: string) => name?.charAt(0).toUpperCase() || "?";

const getLayananDaftar = (layanan: Pemesanan["layanan"]) =>
  layanan.map((s) => s.nama_layanan).join(", ");
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200"
  >
    <!-- Header -->
    <div
      class="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg"
        >
          {{ getUserInitial(pemesanan.pengguna?.nama) }}
        </div>
        <div>
          <p class="font-bold text-gray-900">
            <span class="capitalize">{{ pemesanan.pengguna?.nama || "N/A" }}</span>
          </p>
        </div>
      </div>
      <span
        class="shrink-0 rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500"
      >
        {{ pemesanan.kode_pemesanan }}
      </span>
    </div>

    <!-- Vespa & Date Info -->
    <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex items-start gap-2">
        <i class="mdi mdi-motorbike text-2xl text-gray-600 flex-shrink-0"></i>
        <div>
          <p class="text-xs text-gray-500">Vespa</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ pemesanan.vespa?.model || "N/A" }}
          </p>
          <p class="text-xs text-gray-600">
            {{ pemesanan.vespa?.plat_nomor || "N/A" }}
          </p>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <i class="mdi mdi-calendar text-2xl text-gray-600 flex-shrink-0"></i>
        <div>
          <p class="text-xs text-gray-500">Tanggal Pemesanan</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
          </p>
          <p class="text-xs text-gray-600 mt-0.5">
            <i class="mdi mdi-clock-outline mr-1"></i
            >{{ pemesanan.jam_pemesanan || "-" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Layanan -->
    <div class="mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-start gap-2">
        <i class="mdi mdi-wrench text-xl text-gray-600 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="text-xs text-gray-500 mb-1">Layanan</p>
          <p class="text-sm font-medium text-gray-900">
            {{ getLayananDaftar(pemesanan.layanan) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Status Display -->
    <div class="mb-4">
      <p class="text-xs text-gray-500 mb-2">Status Pemesanan:</p>
      <div class="flex flex-wrap items-center gap-2">
        <span :class="getStatusBadgeClass(pemesanan.status)">
          <i :class="['mdi mr-1', getStatusIcon(pemesanan.status)]"></i>
          {{ getStatusLabel(pemesanan.status) }}
        </span>
        <span
          v-if="pemesanan.mekanik"
          class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
        >
          <i class="mdi mdi-account-wrench"></i>
          <span class="capitalize">{{ pemesanan.mekanik.nama }}</span>
        </span>
      </div>

      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-xs text-gray-500">Status Pembayaran:</p>
        <span :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)">
          <i class="mdi mdi-cash-check mr-1"></i>
          {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
        </span>
      </div>
    </div>

    <AdminPemesananAksiPanel
      :pemesanan="pemesanan"
      :mekanik-options="mekanikOptions"
      :selected-mekanik-id="selectedMekanikId ?? null"
      @confirm="emit('confirm', $event)"
      @cancel="emit('cancel', $event)"
      @complete="emit('complete', $event)"
      @mark-paid="emit('markPaid', $event)"
      @assign-and-start="emit('assignAndStart', $event)"
      @update:selected-mekanik-id="emit('update:selectedMekanikId', $event)"
    />
  </div>
</template>
