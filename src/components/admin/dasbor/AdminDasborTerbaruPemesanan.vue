<script setup lang="ts">
import { toRef } from "vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AdminDasborPemesananKartuMobile from "@/components/admin/dasbor/AdminDasborPemesananKartuMobile.vue";
import AdminDasborPemesananBarisDesktop from "@/components/admin/dasbor/AdminDasborPemesananBarisDesktop.vue";
import { useAdminDasborTerbaruPemesanan } from "@/composables/useAdminDasborTerbaruPemesanan";
interface Props {
  pemesanan: Pemesanan[];
  mekanikOptions: MekanikOption[];
  selectedMekaniks: { [pemesananId: number]: number };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  statusChange: [pemesanan: Pemesanan, newStatus: string, catatan?: string];
  pembayaranStatusChange: [pemesanan: Pemesanan, newStatus: string, catatan?: string];
  assignAndStart: [pemesanan: Pemesanan];
  "update:selectedMekaniks": [value: { [pemesananId: number]: number }];
}>();

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Status",
  "Pembayaran",
  "Mekanik",
  "Aksi",
];

const TABLE_WRAPPER_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "w-full table-fixed divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-900 sm:px-6 [&:nth-child(1)]:w-[15%] [&:nth-child(2)]:w-[15%] [&:nth-child(3)]:w-[13%] [&:nth-child(4)]:w-[12%] [&:nth-child(5)]:w-[13%] [&:nth-child(6)]:w-[15%] [&:nth-child(7)]:w-[17%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_KARTU_CLASS = "space-y-4 bg-gray-50 p-4";

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
  <div :class="TABLE_WRAPPER_CLASS">
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

    <EmptyState
      v-if="!hasPemesanan"
      icon="mdi mdi-clipboard-text"
      title="Belum ada pemesanan"
      message="Pemesanan terbaru akan muncul di sini."
    />

    <TableShell
      v-else
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :table-class="TABLE_CLASS"
      head-class="bg-gray-50"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
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

    <!-- Modal konfirmasi tandai lunas -->
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

