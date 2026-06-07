<script setup lang="ts">
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper format tanggal pendek.
import { formatDateShort } from "@/utils/date";
// Helper status servis.
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
// Helper format nama pelanggan.
import { formatNama } from "@/utils/format";
// Tipe aktivitas terbaru pemilik.
import type { PemilikTerbaruPemesananActivity } from "@/types/pemesanan";
// Helper status pembayaran.
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
} from "@/utils/pembayaranStatus";
// Class label kecil.
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
// Helper class kartu mobile tabel.
import {
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
} from "@/utils/tableVariants";

// Props menerima satu aktivitas pemesanan.
interface Props {
  pemesanan: PemilikTerbaruPemesananActivity;
}

defineProps<Props>();
</script>

<template>
  <!-- Kartu aktivitas terbaru versi mobile. -->
  <div :class="TABLE_MOBILE_CARD_CLASS">
    <!-- Header kartu berisi kode dan status servis. -->
    <div :class="TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">Kode Pemesanan</p>
        <p class="font-bold text-gray-900">{{ pemesanan.kode_pemesanan }}</p>
      </div>
      <div class="text-right">
        <span :class="getStatusBadgeClass(pemesanan.status)">
          {{ getStatusLabel(pemesanan.status) }}
        </span>
      </div>
    </div>
    
    <!-- Detail pemesanan dalam grid mobile. -->
    <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
      <div>
        <p :class="META_LABEL_CLASS">Pelanggan</p>
        <p class="text-gray-700">
          {{ formatNama(pemesanan.nama_pelanggan) }}
        </p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Tanggal</p>
        <p class="text-gray-700">
          {{ formatDateShort(pemesanan.tanggal_pemesanan) }}
        </p>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Layanan</p>
        <div class="space-y-0.5">
          <!-- Nama layanan dari API dipisah berdasarkan koma. -->
          <p
            v-for="(layanan, i) in pemesanan.nama_layanan.split(', ')"
            :key="i"
            class="text-gray-700 leading-snug"
          >
            {{ layanan }}
          </p>
        </div>
      </div>
      <div>
        <p :class="META_LABEL_CLASS">Pembayaran</p>
        <p
          :class="[
            getPembayaranStatusBadgeClass(pemesanan.status_pembayaran),
            'mt-0.5',
          ]"
        >
          {{ getPembayaranStatusLabel(pemesanan.status_pembayaran) }}
        </p>
      </div>
      <!-- Total diletakkan di bawah agar lebih menonjol di mobile. -->
      <div
        class="col-span-2 mt-2 flex items-center justify-between border-t border-gray-100 pt-3"
      >
        <p :class="META_LABEL_CLASS">Total</p>
        <p class="text-base font-bold text-gray-900">
          {{ toIDR(pemesanan.total_harga) }}
        </p>
      </div>
    </div>
  </div>
</template>
