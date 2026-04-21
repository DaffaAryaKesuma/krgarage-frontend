<script setup lang="ts">
import { toRef } from "vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import type { Booking, MekanikOption } from "@/types/booking";
import TableShell from "@/components/ui/TableShell.vue";
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
  statusChange: [booking: Booking, newStatus: string];
  paymentStatusChange: [booking: Booking, newStatus: string];
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
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6 [&:nth-child(1)]:w-[14%] [&:nth-child(2)]:w-[13%] [&:nth-child(3)]:w-[12%] [&:nth-child(4)]:w-[11%] [&:nth-child(5)]:w-[12%] [&:nth-child(6)]:w-[22%] [&:nth-child(7)]:w-[16%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_CARDS_CLASS = "space-y-4 bg-gray-50 p-4";

const {
  hasBookings,
  showStatusConfirmModal,
  activeStatusConfig,
  handleConfirm,
  handleComplete,
  handleCancel,
  handleMarkPaid,
  handleMekanikChange,
  closeStatusConfirmModal,
  applyStatusChange,
} = useAdminDashboardRecentBookings({
  bookings: toRef(props, "bookings"),
  selectedMekaniks: toRef(props, "selectedMekaniks"),
  onStatusChange: (booking, newStatus) =>
    emit("statusChange", booking, newStatus),
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

    <div v-if="!hasBookings" class="px-6 py-12 text-center">
      <i class="mdi mdi-clipboard-text mx-auto text-gray-400 text-3xl"></i>
      <p class="mt-2 text-sm text-gray-500">Belum ada pemesanan</p>
    </div>

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

    <ConfirmationModal
      :show="showStatusConfirmModal"
      :title="activeStatusConfig?.title || 'Konfirmasi Aksi'"
      :message="activeStatusConfig?.message || ''"
      :confirm-text="activeStatusConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      :variant="activeStatusConfig?.variant || 'info'"
      @confirm="applyStatusChange"
      @cancel="closeStatusConfirmModal"
    />
  </div>
</template>
