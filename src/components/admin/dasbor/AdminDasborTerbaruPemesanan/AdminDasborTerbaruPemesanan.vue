<script setup lang="ts">
// toRef membuat props bisa dikirim ke composable sebagai Ref.
import { toRef } from "vue";
// Modal konfirmasi status/pembayaran.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
// Tabel reusable dengan mode mobile card.
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Komponen tampilan mobile dan desktop.
import AdminDasborPemesananKartuMobile from "./AdminDasborPemesananKartuMobile.vue";
import AdminDasborPemesananBarisDesktop from "./AdminDasborPemesananBarisDesktop.vue";
// Composable logic modal dan aksi.
import { useAdminDasborTerbaruPemesanan } from "./useAdminDasborTerbaruPemesanan";
import {
  TABLE_BODY_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
  buildTableHeaderCellClass,
} from "@/utils/tableVariants";

// Props data pemesanan, mekanik, dan pilihan mekanik per pemesanan.
interface Props {
  pemesanan: Pemesanan[];
  mekanikOptions: MekanikOption[];
  selectedMekaniks: { [pemesananId: number]: number };
}

const props = defineProps<Props>();

// Event diteruskan ke halaman dasbor admin.
const emit = defineEmits<{
  statusChange: [pemesanan: Pemesanan, newStatus: string, catatan?: string];
  pembayaranStatusChange: [
    pemesanan: Pemesanan,
    newStatus: string,
    catatan?: string,
  ];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekaniks": [value: { [pemesananId: number]: number }];
}>();

// Header tabel desktop.
const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Status",
  "Pembayaran",
  "Mekanik",
  "Aksi",
];

// Lebar kolom tabel desktop.
const TABLE_COLUMN_WIDTHS = ["15%", "16%", "12%", "12%", "12%", "20%", "13%"];

// Class tabel desktop fixed.
const TABLE_CLASS = buildFixedTableClass("min-w-[1200px]");

// Class header cell.
const TABLE_HEADER_CELL_CLASS =
  buildTableHeaderCellClass("text-gray-900 sm:px-4");

// Ambil state dan handler dari composable.
const {
  hasPemesanan,
  showStatusConfirmModal,
  activeStatusConfig,
  showPembayaranConfirmModal,
  handleConfirm,
  handleComplete,
  handleCancel,
  handleMarkPaid,
  handleMekanikChange,
  closeStatusConfirmModal,
  applyStatusChange,
  applyPembayaranChange,
  closePembayaranConfirmModal,
} = useAdminDasborTerbaruPemesanan({
  pemesanan: toRef(props, "pemesanan"),
  selectedMekaniks: toRef(props, "selectedMekaniks"),
  onStatusChange: (pemesanan, newStatus, catatan) =>
    emit("statusChange", pemesanan, newStatus, catatan),
  onPembayaranStatusChange: (pemesanan, newStatus) =>
    emit("pembayaranStatusChange", pemesanan, newStatus),
  onSelectedMekaniksChange: (value) => emit("update:selectedMekaniks", value),
});
</script>

<template>
  <!-- Wrapper tabel pemesanan terbaru. -->
  <div :class="TABLE_WRAPPER_CLASS">
    <!-- Header section dan link lihat semua. -->
    <div
      class="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6"
    >
      <h2 class="text-xl font-bold text-gray-900">
        <i class="mdi mdi-calendar-clock mr-2 text-xl"></i>Pemesanan Terbaru
      </h2>
      <router-link
        to="/admin/pemesanan"
        class="text-red-600 hover:text-red-700 font-medium text-sm no-underline"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>

    <!-- Empty state jika belum ada pemesanan terbaru. -->
    <EmptyState
      v-if="!hasPemesanan"
      icon="mdi mdi-clipboard-text"
      title="Belum ada pemesanan"
      message="Pemesanan terbaru akan muncul di sini."
    />

    <!-- Tabel responsive: mobile pakai card, desktop pakai table. -->
    <TableShell
      v-else
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
      :table-class="TABLE_CLASS"
      :head-class="TABLE_HEAD_CLASS"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <!-- Slot mobile card. -->
      <template #mobile>
        <AdminDasborPemesananKartuMobile
          v-for="item in pemesanan"
          :key="`mobile-${item.id}`"
          :pemesanan="item"
          :mekanik-options="mekanikOptions"
          :selected-mekanik-id="selectedMekaniks[item.id] ?? null"
          @update:selected-mekanik-id="handleMekanikChange(item.id, $event)"
          @assign-and-start="emit('assignAndStart', $event)"
          @confirm="handleConfirm"
          @complete="handleComplete"
          @cancel="handleCancel"
          @mark-paid="handleMarkPaid"
        />
      </template>

      <!-- Baris desktop. -->
      <AdminDasborPemesananBarisDesktop
        v-for="item in pemesanan"
        :key="item.id"
        :pemesanan="item"
        :mekanik-options="mekanikOptions"
        :selected-mekanik-id="selectedMekaniks[item.id] ?? null"
        @update:selected-mekanik-id="handleMekanikChange(item.id, $event)"
        @assign-and-start="emit('assignAndStart', $event)"
        @confirm="handleConfirm"
        @complete="handleComplete"
        @cancel="handleCancel"
        @mark-paid="handleMarkPaid"
      />
    </TableShell>

    <!-- Modal catatan wajib untuk status selesai. -->
    <CatatanInputModal
      v-if="activeStatusConfig?.statusBaru === 'Selesai'"
      :show="showStatusConfirmModal"
      :title="activeStatusConfig?.title || 'Konfirmasi Aksi'"
      message="Tuliskan catatan servis untuk pelanggan"
      :confirm-text="activeStatusConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      required
      @confirm="applyStatusChange"
      @cancel="closeStatusConfirmModal"
    />

    <!-- Modal konfirmasi untuk status selain selesai. -->
    <ConfirmationModal
      v-else
      :show="showStatusConfirmModal"
      :title="activeStatusConfig?.title || 'Konfirmasi Aksi'"
      :message="activeStatusConfig?.message || ''"
      :confirm-text="activeStatusConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      :variant="activeStatusConfig?.variant || 'info'"
      @confirm="applyStatusChange()"
      @cancel="closeStatusConfirmModal"
    />

    <!-- Modal konfirmasi tandai lunas. -->
    <ConfirmationModal
      :show="showPembayaranConfirmModal"
      title="Konfirmasi Pembayaran"
      message="Apakah Anda yakin ingin menandai pemesanan ini sebagai sudah lunas?"
      confirm-text="Ya, Tandai Lunas"
      cancel-text="Batal"
      variant="success"
      @confirm="applyPembayaranChange"
      @cancel="closePembayaranConfirmModal"
    />
  </div>
</template>
