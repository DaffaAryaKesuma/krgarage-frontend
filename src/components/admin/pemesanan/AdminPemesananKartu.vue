<script setup lang="ts">
import { formatDateShort, formatTimeShort } from "@/utils/date";
import {
  getStatusBadgeClass,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
import { META_LABEL_CLASS, getChipBadgeClass } from "@/utils/badgeVariants";
import AdminPemesananAksiPanel from "./AdminPemesananAksiPanel.vue";
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
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
  >
    <!-- Header -->

    <div class="mb-4 flex items-center gap-4">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-lg font-bold text-white shadow-md ring-2 ring-red-50"
      >
        {{ getUserInitial(pemesanan.pengguna?.nama) }}
      </div>
      <div>
        <p class="text-base font-bold text-gray-900 capitalize">
          {{ pemesanan.pengguna?.nama || "N/A" }}
        </p>
        <p class="text-xs text-gray-500 mt-0.5 tracking-wide">
          {{ pemesanan.kode_pemesanan }}
        </p>
      </div>
    </div>


    <!-- Info Grid -->
    <div class="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
      <!-- Vespa -->
      <div
        class="rounded-xl bg-gray-50/80 p-3 sm:p-4 border border-gray-100 shadow-sm transition hover:bg-gray-100"
      >
        <div class="flex items-center gap-2 mb-2">
          <i class="mdi mdi-motorbike text-lg text-gray-500"></i>
          <p :class="META_LABEL_CLASS">
            Vespa
          </p>
        </div>
        <p class="text-sm font-bold text-gray-900 truncate">
          {{ pemesanan.vespa?.model || "N/A" }}
        </p>
        <p
          :class="[getChipBadgeClass('neutral'), 'mt-1']"
        >
          {{ pemesanan.vespa?.plat_nomor || "N/A" }}
        </p>
      </div>

      <!-- Jadwal -->
      <div
        class="rounded-xl bg-gray-50/80 p-3 sm:p-4 border border-gray-100 shadow-sm transition hover:bg-gray-100"
      >
        <div class="flex items-center gap-2 mb-2">
          <i class="mdi mdi-calendar-clock text-lg text-gray-500"></i>
          <p :class="META_LABEL_CLASS">
            Jadwal
          </p>
        </div>
        <p class="text-sm font-bold text-gray-900">
          {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
        </p>
        <p class="text-xs text-gray-600 mt-1 flex items-center font-medium">
          <i class="mdi mdi-clock-outline mr-1 text-gray-400"></i>
          {{ formatTimeShort(pemesanan.jam_pemesanan) }}
        </p>
      </div>
    </div>

    <!-- Layanan -->
    <div class="mb-4">
      <p
        :class="[META_LABEL_CLASS, 'mb-2 flex items-center gap-1.5']"
      >
        <i class="mdi mdi-wrench text-gray-400 text-sm"></i> Layanan
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(layanan, idx) in pemesanan.layanan"
          :key="idx"
          :class="getChipBadgeClass('neutral')"
        >
          {{
            layanan.pivot?.nama_layanan_saat_ini ||
            layanan.nama_layanan ||
            "Layanan Dihapus"
          }}
        </span>
      </div>
    </div>

    <!-- Status Display -->
    <div
      class="mb-4 rounded-xl border border-gray-100 bg-slate-50 p-4 shadow-inner"
    >
      <div
        class="flex flex-row items-center justify-between gap-3 sm:justify-between"
      >
        <!-- Status Servis -->
        <div>
          <p :class="[META_LABEL_CLASS, 'mb-1.5']">
            Status Servis
          </p>
          <div class="flex items-center gap-2">
            <span :class="getStatusBadgeClass(pemesanan.status)">
              <i :class="['mdi mr-1', getStatusIcon(pemesanan.status)]"></i>
              {{ getStatusLabel(pemesanan.status) }}
            </span>
          </div>
        </div>

        <div class="w-px h-8 bg-slate-200"></div>

        <!-- Status Pembayaran -->
        <div>
          <p :class="[META_LABEL_CLASS, 'mb-1.5']">
            Pembayaran
          </p>
          <span
            :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)"
          >
            <i class="mdi mdi-cash-check mr-1"></i>
            {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
          </span>
        </div>
      </div>

      <!-- Mekanik Info -->
      <div
        v-if="pemesanan.mekanik"
        class="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2"
      >
        <p :class="META_LABEL_CLASS">
          Mekanik
        </p>
        <span
          :class="[getChipBadgeClass('neutral'), 'gap-1.5 text-sm font-bold']"
        >
          <i class="mdi mdi-account-wrench text-gray-400"></i>
          <span class="capitalize">{{ pemesanan.mekanik.nama }}</span>
        </span>
      </div>
    </div>

    <AdminPemesananAksiPanel
      class="mt-auto"
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
