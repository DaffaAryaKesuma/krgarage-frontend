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
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200"
  >
    <!-- Header -->
    <div
      class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-lg font-bold text-white shadow-md ring-2 ring-red-50"
        >
          {{ getUserInitial(pemesanan.pengguna?.nama) }}
        </div>
        <div>
          <p class="text-base font-bold text-gray-900 capitalize">
            {{ pemesanan.pengguna?.nama || "N/A" }}
          </p>
          <p class="text-xs text-gray-500 font-mono mt-0.5 tracking-wide">
            {{ pemesanan.kode_pemesanan }}
          </p>
        </div>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="mb-5 grid grid-cols-2 gap-3 sm:gap-4">
      <!-- Vespa -->
      <div
        class="rounded-xl bg-gray-50/80 p-3 sm:p-4 border border-gray-100 shadow-sm transition hover:bg-gray-100"
      >
        <div class="flex items-center gap-2 mb-2">
          <i class="mdi mdi-motorbike text-lg text-gray-500"></i>
          <p
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Vespa
          </p>
        </div>
        <p class="text-sm font-bold text-gray-900 truncate">
          {{ pemesanan.vespa?.model || "N/A" }}
        </p>
        <p
          class="text-xs text-gray-600 mt-1 font-semibold bg-white inline-block px-1.5 py-0.5 rounded border border-gray-200"
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
          <p
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Jadwal
          </p>
        </div>
        <p class="text-sm font-bold text-gray-900">
          {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
        </p>
        <p class="text-xs text-gray-600 mt-1 flex items-center font-medium">
          <i class="mdi mdi-clock-outline mr-1 text-gray-400"></i>
          {{ pemesanan.jam_pemesanan || "-" }}
        </p>
      </div>
    </div>

    <!-- Layanan -->
    <div class="mb-5">
      <p
        class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"
      >
        <i class="mdi mdi-wrench text-gray-400 text-sm"></i> Layanan
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(layanan, idx) in pemesanan.layanan"
          :key="idx"
          class="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200"
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
      class="mb-5 rounded-xl border border-gray-100 bg-slate-50 p-4 shadow-inner"
    >
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- Status Servis -->
        <div>
          <p
            class="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
          >
            Status Servis
          </p>
          <div class="flex items-center gap-2">
            <span :class="getStatusBadgeClass(pemesanan.status)">
              <i :class="['mdi mr-1', getStatusIcon(pemesanan.status)]"></i>
              {{ getStatusLabel(pemesanan.status) }}
            </span>
          </div>
        </div>

        <div class="hidden sm:block w-px h-8 bg-slate-200"></div>

        <!-- Status Pembayaran -->
        <div>
          <p
            class="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
          >
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
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Mekanik:
        </p>
        <span
          class="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-white px-2.5 py-1 rounded-md border border-gray-200"
        >
          <i class="mdi mdi-account-wrench text-gray-400"></i>
          <span class="capitalize">{{ pemesanan.mekanik.nama }}</span>
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
