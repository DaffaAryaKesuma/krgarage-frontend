<script setup lang="ts">
// Komponen umum untuk loading dan data kosong.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Helper class badge, alert, chip, dan ikon.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getAlertIconClass,
  getChipBadgeClass,
  getIconToneClass,
} from "@/utils/badgeVariants";
// Default props dan helper grid pekerjaan.
import {
  MEKANIK_PEKERJAAN_GRID_DEFAULTS,
  useMekanikPekerjaanGrid,
  type MekanikPekerjaanGridProps,
} from "./useMekanikPekerjaanGrid";
// Helper class tombol.
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";

// Props dengan default untuk empty/loading state.
withDefaults(
  defineProps<MekanikPekerjaanGridProps>(),
  MEKANIK_PEKERJAAN_GRID_DEFAULTS,
);

// Event aksi pekerjaan dikirim ke halaman mekanik.
const emit = defineEmits<{
  updateStatus: [pemesananId: number];
  addSukuCadang: [pemesananId: number];
  deleteSukuCadang: [pemesananId: number, itemId: number];
}>();

// Helper status, format tanggal, dan permission aksi diambil dari composable.
const {
  formatDateShort,
  formatDateTimeShort,
  formatTimeShort,
  canMekanikAddSukuCadang,
  canMekanikUpdateStatus,
  getMekanikAksiButtonText,
  getStatusBadgeClass,
  getStatusLabel,
  isStatusSelesai,
} = useMekanikPekerjaanGrid();
</script>

<template>
  <!-- Loading saat data pekerjaan diambil dari API. -->
  <LoadingSpinner v-if="loading" :message="loadingMessage" />

  <!-- Empty state saat tidak ada pekerjaan sesuai tab/filter. -->
  <EmptyState
    v-else-if="pemesanan.length === 0"
    :icon="emptyIcon"
    :title="emptyTitle"
    :message="emptyMessage"
  />

  <!-- Grid kartu pekerjaan mekanik. -->
  <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-2">
    <div
      v-for="item in pemesanan"
      :key="item.id"
      class="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <!-- Header kartu: kode pemesanan dan status servis. -->
      <div class="bg-white px-5 pt-4 pb-4 flex items-start justify-between">
        <div>
          <p :class="META_LABEL_CLASS">
            Kode Pemesanan
          </p>
          <p class="text-base font-bold text-gray-900 tracking-tight">
            {{ item.kode_pemesanan }}
          </p>
        </div>
        <span :class="getStatusBadgeClass(item.status)" class="mt-0.5">
          {{ getStatusLabel(item.status) }}
        </span>
      </div>

      <!-- Body kartu berisi informasi pekerjaan. -->
      <div class="flex-grow flex flex-col px-5 py-4 space-y-3">
        <!-- Info utama dibuat 2 kolom. -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <!-- Nama pelanggan. -->
          <div class="flex items-center gap-2.5">
            <div
              :class="[
                getIconToneClass('neutral'),
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              ]"
            >
              <i class="mdi mdi-account text-base"></i>
            </div>
            <div class="min-w-0">
              <p :class="[META_LABEL_CLASS, 'mb-0.5 leading-none']">
                Pelanggan
              </p>
              <p class="text-sm font-semibold text-gray-900 truncate">
                <span class="capitalize">{{ item.pengguna.nama }}</span>
              </p>
            </div>
          </div>

          <!-- Informasi Vespa dan plat nomor. -->
          <div class="flex items-center gap-2.5">
            <div
              :class="[
                getIconToneClass('neutral'),
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              ]"
            >
              <i class="mdi mdi-motorbike text-base"></i>
            </div>
            <div class="min-w-0">
              <p :class="[META_LABEL_CLASS, 'mb-0.5 leading-none']">
                Vespa
              </p>
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ item.vespa.model }}
              </p>
              <span
                v-if="item.vespa.plat_nomor"
                :class="[getChipBadgeClass('neutral'), 'px-1.5 py-0.5 text-[10px] font-bold uppercase']"
              >
                {{ item.vespa.plat_nomor }}
              </span>
            </div>
          </div>

          <!-- Tanggal servis. -->
          <div class="flex items-center gap-2.5">
            <div
              :class="[
                getIconToneClass('neutral'),
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              ]"
            >
              <i class="mdi mdi-calendar text-base"></i>
            </div>
            <div class="min-w-0">
              <p :class="[META_LABEL_CLASS, 'mb-0.5 leading-none']">
                Tanggal
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ formatDateShort(item.tanggal_pemesanan) }}
              </p>
            </div>
          </div>

          <!-- Jam servis. -->
          <div class="flex items-center gap-2.5">
            <div
              :class="[
                getIconToneClass('neutral'),
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              ]"
            >
              <i class="mdi mdi-clock-outline text-base"></i>
            </div>
            <div class="min-w-0">
              <p :class="[META_LABEL_CLASS, 'mb-0.5 leading-none']">
                Jam
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ formatTimeShort(item.jam_pemesanan) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Daftar layanan yang dikerjakan mekanik. -->
        <div class="flex items-start gap-2.5">
          <div
            :class="[
              getIconToneClass('neutral'),
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
            ]"
          >
            <i class="mdi mdi-wrench text-base"></i>
          </div>
          <div class="min-w-0">
            <p :class="[META_LABEL_CLASS, 'mb-1 leading-none']">
              Layanan
            </p>
            <template v-if="item.layanan?.length">
              <p
                v-for="(layananItem, index) in item.layanan"
                :key="index"
                class="text-sm font-semibold text-gray-900 leading-snug"
              >
                {{ layananItem.nama_layanan }}
              </p>
            </template>
            <p v-else class="text-sm font-semibold text-gray-400 italic">
              Layanan tidak tersedia
            </p>
          </div>
        </div>

        <!-- Catatan pelanggan tampil jika pelanggan mengisi catatan saat booking. -->
        <div
          v-if="item.catatan_pelanggan"
          :class="[getAlertBoxClass('neutral'), 'flex items-start gap-2.5 p-3 shadow-none']"
        >
          <i
            :class="[
              getAlertIconClass('neutral'),
              'mdi mdi-note-text-outline mt-0.5 shrink-0 text-base',
            ]"
          ></i>
          <div>
            <p :class="[META_LABEL_CLASS, 'mb-0.5']">
              Catatan Pelanggan
            </p>
            <p class="text-xs text-gray-600">{{ item.catatan_pelanggan }}</p>
          </div>
        </div>

        <!-- Daftar suku cadang yang sudah dipakai pada pekerjaan ini. -->
        <details
          v-if="item.item_pemesanan?.length"
          class="group bg-gray-50/60 border border-gray-100 rounded-xl"
          :open="item.item_pemesanan.length <= 0"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-[10px] font-semibold text-gray-700 marker:hidden"
          >
            <span class="flex min-w-0 items-center gap-1.5">
              <i class="mdi mdi-cog text-gray-600"></i>
              Suku Cadang Digunakan
              <span :class="[getChipBadgeClass('neutral'), 'px-2 py-0.5 text-[10px] font-bold']">
                {{ item.item_pemesanan.length }}
              </span>
            </span>
            <i
              class="mdi mdi-chevron-down text-base text-gray-500 transition-transform group-open:rotate-180"
            ></i>
          </summary>

          <!-- Item suku cadang dapat dihapus jika status masih mengizinkan tambah suku cadang. -->
          <div class="space-y-1.5 border-t border-gray-100 px-3 pb-3 pt-2">
            <div
              v-for="subItem in item.item_pemesanan"
              :key="subItem.id"
              class="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-blue-100/60"
            >
              <span class="text-xs font-medium text-gray-700">{{
                subItem.nama_suku_cadang_saat_ini ||
                subItem.suku_cadang?.nama_suku_cadang ||
                "Suku Cadang Tidak Ditemukan"
              }}</span>
              <div class="flex items-center gap-2">
                <span
                  :class="[getChipBadgeClass('neutral'), 'px-2 py-0.5 text-xs font-bold']"
                  >{{ subItem.jumlah }}x</span
                >
                <button
                  v-if="canMekanikAddSukuCadang(item.status)"
                  @click="emit('deleteSukuCadang', item.id, subItem.id)"
                  :class="getIconButtonClass('subtle', 'sm')"
                  title="Hapus Suku Cadang"
                >
                  <i class="mdi mdi-close-circle text-base"></i>
                </button>
              </div>
            </div>
          </div>
        </details>

        <!-- Area bawah kartu dibuat mt-auto agar posisi aksi sejajar. -->
        <div class="mt-auto space-y-3 pt-1">
          <!-- Catatan mekanik ditampilkan dekat status selesai/aksi pekerjaan. -->
          <div
            v-if="item.catatan_mekanik"
            :class="[getAlertBoxClass('success'), 'flex items-start gap-2.5 p-3 shadow-none']"
          >
            <i
              :class="[
                getAlertIconClass('success'),
                'mdi mdi-wrench-check mt-0.5 shrink-0 text-base',
              ]"
            ></i>
            <div>
              <p :class="[META_LABEL_CLASS, 'mb-0.5']">
                Catatan Mekanik
              </p>
              <p class="whitespace-pre-line text-xs">
                {{ item.catatan_mekanik }}
              </p>
            </div>
          </div>

          <!-- Tombol aksi pekerjaan aktif. -->
          <div
            v-if="
              canMekanikUpdateStatus(item.status) ||
              canMekanikAddSukuCadang(item.status)
            "
            class="grid grid-cols-2 gap-2"
          >
            <!-- Tombol update status hanya muncul jika status masih bisa dinaikkan oleh mekanik. -->
            <button
              v-if="canMekanikUpdateStatus(item.status)"
              @click="emit('updateStatus', item.id)"
              :class="getButtonClass('success', 'md', 'rounded-xl active:scale-[0.97]')"
            >
              {{ getMekanikAksiButtonText(item.status) }}
            </button>

            <!-- Tombol tambah suku cadang hanya muncul pada status yang diizinkan. -->
            <button
              v-if="canMekanikAddSukuCadang(item.status)"
              @click="emit('addSukuCadang', item.id)"
              :class="getButtonClass('primary', 'md', 'rounded-xl active:scale-[0.97]')"
            >
              Tambah Suku Cadang
            </button>
          </div>

          <!-- Status selesai dan waktu completed_at. -->
          <div
            v-if="isStatusSelesai(item.status)"
            :class="[getAlertBoxClass('success'), 'flex items-start gap-2.5 p-3 text-left shadow-none']"
          >
            <i :class="[getAlertIconClass('success'), 'mdi mdi-check mt-0.5 shrink-0 text-base']"></i>
            <div>
              <p class="text-sm font-semibold">
                Pekerjaan Selesai
              </p>
              <p v-if="item.completed_at" class="mt-0.5 text-xs">
                {{ formatDateTimeShort(item.completed_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
