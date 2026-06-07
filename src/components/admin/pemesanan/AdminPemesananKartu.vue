<script setup lang="ts">
// Helper format tanggal, tanggal+jam, dan jam.
import { formatDateShort, formatDateTimeShort, formatTimeShort } from "@/utils/date";
// Helper status servis.
import {
  getStatusBadgeClass,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/statusBadge";
// Helper status pembayaran.
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
// Helper class badge/chip.
import { META_LABEL_CLASS, getChipBadgeClass } from "@/utils/badgeVariants";
// Format plat nomor menjadi uppercase.
import { formatPlatNomor } from "@/utils/format";
// Panel aksi dipisah agar kartu tidak terlalu penuh.
import AdminPemesananAksiPanel from "./AdminPemesananAksiPanel.vue";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";

// Props kartu pemesanan admin.
interface Props {
  pemesanan: Pemesanan;
  mekanikOptions: MekanikOption[];
  selectedMekanikId?: number | null;
}

defineProps<Props>();

// Event dari panel aksi diteruskan ke parent halaman.
const emit = defineEmits<{
  confirm: [pemesanan: Pemesanan];
  cancel: [pemesanan: Pemesanan];
  complete: [pemesanan: Pemesanan];
  markPaid: [pemesanan: Pemesanan];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekanikId": [mekanikId: number | null];
}>();

// Ambil inisial nama pelanggan untuk avatar.
const getUserInitial = (name?: string) => name?.charAt(0).toUpperCase() || "?";
</script>

<template>
  <!-- Kartu satu pemesanan admin. -->
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
  >
    <!-- Header pelanggan dan kode pemesanan. -->

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


    <!-- Grid informasi vespa dan jadwal. -->
    <div class="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
      <!-- Info Vespa. -->
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
          {{ formatPlatNomor(pemesanan.vespa?.plat_nomor) }}
        </p>
      </div>

      <!-- Info jadwal servis. -->
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

    <!-- Daftar layanan yang dipilih pada pemesanan. -->
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

    <!-- Status servis dan pembayaran. -->
    <div
      class="mb-4 rounded-xl border border-gray-100 bg-slate-50 p-4 shadow-inner"
    >
      <div
        class="flex flex-row items-center justify-between gap-3 sm:justify-between"
      >
        <!-- Status servis dan completed_at jika ada. -->
        <div class="min-w-0">
          <p :class="[META_LABEL_CLASS, 'mb-1.5']">
            Status Servis
          </p>
          <div class="flex items-center gap-2">
            <span :class="getStatusBadgeClass(pemesanan.status)">
              <i :class="['mdi mr-1', getStatusIcon(pemesanan.status)]"></i>
              {{ getStatusLabel(pemesanan.status) }}
            </span>
          </div>
          <p v-if="pemesanan.completed_at" class="mt-1.5 text-xs text-gray-600">
            {{ formatDateTimeShort(pemesanan.completed_at) }}
          </p>
        </div>

        <div class="w-px h-8 bg-slate-200"></div>

        <!-- Status pembayaran dan paid_at jika ada. -->
        <div class="min-w-0 text-right">
          <p :class="[META_LABEL_CLASS, 'mb-1.5']">
            Pembayaran
          </p>
          <span
            :class="getPembayaranStatusBadgeClass(pemesanan.status_pembayaran)"
          >
            <i class="mdi mdi-cash-check mr-1"></i>
            {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
          </span>
          <p v-if="pemesanan.paid_at" class="mt-1.5 text-xs text-gray-600">
            {{ formatDateTimeShort(pemesanan.paid_at) }}
          </p>
        </div>
      </div>

      <!-- Mekanik yang ditugaskan. -->
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

    <!-- Panel tombol aksi pemesanan. -->
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
