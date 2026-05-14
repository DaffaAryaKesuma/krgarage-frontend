<script setup lang="ts">
import { toRef } from "vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NoteInputModal from "@/components/ui/NoteInputModal.vue";
import type { Booking, MekanikOption } from "@/types/booking";
import TableShell from "@/components/ui/TableShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AdminDashboardBookingMobileCard from "@/components/admin/dashboard/AdminDashboardBookingMobileCard.vue";
import AdminDashboardBookingDesktopRow from "@/components/admin/dashboard/AdminDashboardBookingDesktopRow.vue";
import { useAdminDashboardRecentBookings } from "@/composables/useAdminDashboardRecentBookings";
interface Props {
  bookings: Booking[];
  mekanikOptions: MekanikOption[];
  selectedMekaniks: { [bookingId: number]: number };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  statusChange: [booking: Booking, newStatus: string, catatan?: string];
  paymentStatusChange: [booking: Booking, newStatus: string, catatan?: string];
  assignAndStart: [booking: Booking];
  "update:selectedMekaniks": [value: { [bookingId: number]: number }];
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
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-900 sm:px-6 [&:nth-child(1)]:w-[14%] [&:nth-child(2)]:w-[13%] [&:nth-child(3)]:w-[12%] [&:nth-child(4)]:w-[11%] [&:nth-child(5)]:w-[12%] [&:nth-child(6)]:w-[22%] [&:nth-child(7)]:w-[16%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_CARDS_CLASS = "space-y-4 bg-gray-50 p-4";

const {
  hasBookings,
  showStatusConfirmModal,
  activeStatusConfig,
  showPaymentConfirmModal,
  handleConfirm,
  handleComplete,
  handleCancel,
  handleMarkPaid,
  handleMekanikChange,
  closeStatusConfirmModal,
  applyStatusChange,
  applyPaymentChange,
  closePaymentConfirmModal,
} = useAdminDashboardRecentBookings({
  bookings: toRef(props, "bookings"),
  selectedMekaniks: toRef(props, "selectedMekaniks"),
  onStatusChange: (booking, newStatus, catatan) =>
    emit("statusChange", booking, newStatus, catatan),
  onPaymentStatusChange: (booking, newStatus) =>
    emit("paymentStatusChange", booking, newStatus),
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
      v-if="!hasBookings"
      icon="mdi mdi-clipboard-text"
      title="Belum ada pemesanan"
      message="Pemesanan terbaru akan muncul di sini."
    />

    <TableShell
      v-else
      :headers="TABLE_HEADERS"
      :responsive-cards="true"
      desktop-breakpoint="lg"
      :mobile-cards-class="TABLE_MOBILE_CARDS_CLASS"
      :table-class="TABLE_CLASS"
      head-class="bg-gray-50"
      :header-cell-class="TABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
    >
      <template #mobile>
        <AdminDashboardBookingMobileCard
          v-for="booking in bookings"
          :key="`mobile-${booking.id}`"
          :booking="booking"
          :mekanik-options="mekanikOptions"
          :selected-mekanik-id="selectedMekaniks[booking.id] ?? null"
          @update:selected-mekanik-id="handleMekanikChange(booking.id, $event)"
          @assign-and-start="emit('assignAndStart', $event)"
          @confirm="handleConfirm"
          @complete="handleComplete"
          @cancel="handleCancel"
          @mark-paid="handleMarkPaid"
        />
      </template>

      <AdminDashboardBookingDesktopRow
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
        :mekanik-options="mekanikOptions"
        :selected-mekanik-id="selectedMekaniks[booking.id] ?? null"
        @update:selected-mekanik-id="handleMekanikChange(booking.id, $event)"
        @assign-and-start="emit('assignAndStart', $event)"
        @confirm="handleConfirm"
        @complete="handleComplete"
        @cancel="handleCancel"
        @mark-paid="handleMarkPaid"
      />
    </TableShell>

        <NoteInputModal
      v-if="activeStatusConfig?.newStatus === 'Selesai'"
      :show="showStatusConfirmModal"
      :title="activeStatusConfig?.title || 'Konfirmasi Aksi'"
      message="Tambahkan catatan servis (Wajib diisi):"
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
      :show="showPaymentConfirmModal"
      title="Konfirmasi Pembayaran"
      message="Apakah Anda yakin ingin menandai pemesanan ini sebagai sudah lunas?"
      confirm-text="Ya, Tandai Lunas"
      cancel-text="Batal"
      variant="success"
      @confirm="applyPaymentChange"
      @cancel="closePaymentConfirmModal"
    />
  </div>
</template>

