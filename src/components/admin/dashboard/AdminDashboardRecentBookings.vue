<script setup lang="ts">
import { computed, ref } from "vue";
import { formatDateShort } from "@/utils/date";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import {
  BOOKING_STATUS,
  canAdminAssignAndStart,
  canAdminCancelBooking,
  canAdminCompleteBooking,
  canAdminConfirmBooking,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
import type { Booking, MechanicOption } from "@/types/booking";
import TableShell from "@/components/ui/TableShell.vue";

interface Props {
  bookings: Booking[];
  mechanicOptions: MechanicOption[];
  selectedMechanics: { [bookingId: number]: number };
}

type DashboardActionType = "confirm" | "complete" | "cancel";

interface PendingStatusAction {
  booking: Booking;
  action: DashboardActionType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  statusChange: [booking: Booking, newStatus: string];
  assignAndStart: [booking: Booking];
  "update:selectedMechanics": [value: { [bookingId: number]: number }];
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

const ACTION_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition";

const ICON_ACTION_BUTTON_CLASS =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition";

const DETAIL_LINK_CLASS =
  "inline-flex h-8 shrink-0 items-center rounded-lg border-2 border-indigo-50 bg-white px-3 text-xs font-semibold text-indigo-600 no-underline transition hover:bg-indigo-50 hover:text-indigo-800";

const TABLE_WRAPPER_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

const TABLE_CLASS = "w-full table-fixed divide-y divide-gray-200";

const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6 [&:nth-child(1)]:w-[15%] [&:nth-child(2)]:w-[14%] [&:nth-child(3)]:w-[12%] [&:nth-child(4)]:w-[12%] [&:nth-child(5)]:w-[13%] [&:nth-child(6)]:w-[17%] [&:nth-child(7)]:w-[17%]";

const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

const TABLE_MOBILE_CARDS_CLASS = "space-y-4 bg-gray-50 p-4";

const TABLE_ROW_CLASS = "transition-colors hover:bg-gray-50/80";

const STATUS_ACTION_CONFIG: Record<
  DashboardActionType,
  {
    title: string;
    message: string;
    confirmText: string;
    variant: "danger" | "warning" | "info" | "success";
    newStatus: string;
  }
> = {
  confirm: {
    title: "Konfirmasi Pemesanan",
    message: "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
    confirmText: "Ya, Konfirmasi",
    variant: "info",
    newStatus: BOOKING_STATUS.CONFIRMED,
  },
  complete: {
    title: "Selesaikan Pemesanan",
    message: "Apakah Anda yakin ingin menandai servis ini telah selesai?",
    confirmText: "Ya, Selesaikan",
    variant: "success",
    newStatus: BOOKING_STATUS.COMPLETED,
  },
  cancel: {
    title: "Batalkan Pemesanan",
    message: "Apakah Anda yakin ingin membatalkan pemesanan ini?",
    confirmText: "Ya, Batalkan",
    variant: "danger",
    newStatus: BOOKING_STATUS.CANCELLED,
  },
};

const showStatusConfirmModal = ref(false);
const pendingStatusAction = ref<PendingStatusAction | null>(null);

const hasBookings = computed(() => props.bookings.length > 0);

const activeStatusConfig = computed(() => {
  if (!pendingStatusAction.value) {
    return null;
  }

  return STATUS_ACTION_CONFIG[pendingStatusAction.value.action];
});

const requestStatusConfirmation = (
  booking: Booking,
  action: DashboardActionType,
) => {
  pendingStatusAction.value = { booking, action };
  showStatusConfirmModal.value = true;
};

const closeStatusConfirmModal = () => {
  showStatusConfirmModal.value = false;
  pendingStatusAction.value = null;
};

const applyStatusChange = () => {
  const action = pendingStatusAction.value;
  const config = activeStatusConfig.value;

  if (!action || !config) {
    closeStatusConfirmModal();
    return;
  }

  emit("statusChange", action.booking, config.newStatus);
  closeStatusConfirmModal();
};

const handleConfirm = (booking: Booking) => {
  requestStatusConfirmation(booking, "confirm");
};

const handleComplete = (booking: Booking) => {
  requestStatusConfirmation(booking, "complete");
};

const handleCancel = (booking: Booking) => {
  requestStatusConfirmation(booking, "cancel");
};

const handleMechanicChange = (
  bookingId: number,
  value: string | number | null,
) => {
  if (typeof value === "number") {
    const updated = { ...props.selectedMechanics, [bookingId]: value };
    emit("update:selectedMechanics", updated);
  }
};
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
        Lihat Semua →
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-if="!hasBookings" class="px-6 py-12 text-center">
      <i class="mdi mdi-clipboard-text mx-auto text-gray-400 text-3xl"></i>
      <p class="mt-2 text-sm text-gray-500">Belum ada pemesanan</p>
    </div>

    <!-- Bookings Table -->
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
        <div
          v-for="booking in bookings"
          :key="`mobile-${booking.id}`"
          class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Kode Pemesanan
              </p>
              <p class="text-sm font-semibold text-gray-900">
                {{ booking.kode_pemesanan }}
              </p>
            </div>
            <span :class="getStatusBadgeClass(booking.status)">
              {{ getStatusLabel(booking.status) }}
            </span>
          </div>

          <div class="mt-2 flex items-center justify-between gap-2">
            <p
              class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
            >
              Pembayaran
            </p>
            <span
              :class="getPaymentStatusBadgeClass(booking.status_pembayaran)"
            >
              {{ getPaymentStatusLabel(booking.status_pembayaran) }}
            </span>
          </div>

          <div
            class="mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2"
          >
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Tanggal
              </p>
              <p class="font-medium text-gray-900">
                {{ formatDateShort(booking.tanggal_pemesanan) }}
              </p>
            </div>
            <div>
              <p
                class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
              >
                Pelanggan
              </p>
              <p class="font-medium text-gray-900">
                {{ booking.pengguna.nama }}
              </p>
            </div>
          </div>

          <div class="mt-3">
            <div
              v-if="canAdminAssignAndStart(booking.status)"
              class="space-y-2"
            >
              <p class="text-xs text-blue-700 font-medium">Pilih mekanik</p>
              <CustomSelect
                :model-value="selectedMechanics[booking.id] ?? null"
                @update:model-value="handleMechanicChange(booking.id, $event)"
                :options="mechanicOptions"
                placeholder="Pilih Mekanik"
              />
              <button
                @click="emit('assignAndStart', booking)"
                :disabled="!selectedMechanics[booking.id]"
                class="w-full py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Assign & Mulai Servis
              </button>
            </div>
            <div
              v-else-if="booking.mekanik"
              class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1.5 rounded-md inline-flex items-center gap-1 font-medium border border-gray-200"
            >
              <i class="mdi mdi-account-wrench text-sm text-gray-500"></i>
              {{ booking.mekanik.nama }}
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            <button
              v-if="canAdminConfirmBooking(booking.status)"
              @click="handleConfirm(booking)"
              class="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
              title="Konfirmasi"
            >
              Konfirmasi
            </button>

            <button
              v-if="canAdminCompleteBooking(booking.status)"
              @click="handleComplete(booking)"
              class="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition"
              title="Tandai Selesai"
            >
              Tandai Selesai
            </button>

            <button
              v-if="canAdminCancelBooking(booking.status)"
              @click="handleCancel(booking)"
              class="w-8 h-8 flex shrink-0 items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              title="Batalkan"
            >
              <i class="mdi mdi-close text-base font-bold"></i>
            </button>

            <router-link
              :to="`/admin/pemesanan/${booking.id}`"
              class="text-indigo-600 hover:text-indigo-800 font-semibold no-underline flex shrink-0 items-center bg-white border-2 border-indigo-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
            >
              Detail &rarr;
            </router-link>
          </div>
        </div>
      </template>

      <tr
        v-for="booking in bookings"
        :key="booking.id"
        :class="TABLE_ROW_CLASS"
      >
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-900 sm:px-6">
          <span class="font-semibold text-gray-800">{{
            booking.kode_pemesanan
          }}</span>
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700 sm:px-6">
          {{ formatDateShort(booking.tanggal_pemesanan) }}
        </td>
        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-900 sm:px-6">
          <span class="block truncate" :title="booking.pengguna.nama">
            {{ booking.pengguna.nama }}
          </span>
        </td>
        <td class="whitespace-nowrap px-4 py-4 sm:px-6">
          <span :class="getStatusBadgeClass(booking.status)">
            {{ getStatusLabel(booking.status) }}
          </span>
        </td>
        <td class="whitespace-nowrap px-4 py-4 sm:px-6">
          <span :class="getPaymentStatusBadgeClass(booking.status_pembayaran)">
            {{ getPaymentStatusLabel(booking.status_pembayaran) }}
          </span>
        </td>
        <td class="px-4 py-4 sm:px-6">
          <div
            v-if="canAdminAssignAndStart(booking.status)"
            class="flex items-center gap-2"
          >
            <div class="w-[180px]">
              <CustomSelect
                :model-value="selectedMechanics[booking.id] ?? null"
                @update:model-value="handleMechanicChange(booking.id, $event)"
                :options="mechanicOptions"
                placeholder="Pilih Mekanik"
              />
            </div>
            <button
              @click="emit('assignAndStart', booking)"
              :disabled="!selectedMechanics[booking.id]"
              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
              title="Mulai Servis"
            >
              <i class="mdi mdi-play-circle text-xl"></i>
            </button>
          </div>
          <span
            v-else-if="booking.mekanik"
            class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1.5 rounded-md inline-flex items-center gap-1 font-medium border border-gray-200"
          >
            <i class="mdi mdi-account-wrench text-sm text-gray-500"></i>
            {{ booking.mekanik.nama }}
          </span>
          <span
            v-else
            class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500"
          >
            Belum ditetapkan
          </span>
        </td>
        <td class="px-4 py-4 text-sm font-medium sm:px-6">
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="canAdminConfirmBooking(booking.status)"
              @click="handleConfirm(booking)"
              :class="[
                ACTION_BUTTON_CLASS,
                'bg-blue-50 text-blue-700 hover:bg-blue-100',
              ]"
              title="Konfirmasi"
            >
              Konfirmasi
            </button>

            <button
              v-if="canAdminCompleteBooking(booking.status)"
              @click="handleComplete(booking)"
              :class="[
                ACTION_BUTTON_CLASS,
                'bg-green-50 text-green-700 hover:bg-green-100',
              ]"
              title="Tandai Selesai"
            >
              Tandai Selesai
            </button>

            <button
              v-if="canAdminCancelBooking(booking.status)"
              @click="handleCancel(booking)"
              :class="[
                ICON_ACTION_BUTTON_CLASS,
                'bg-red-50 text-red-600 hover:bg-red-100',
              ]"
              title="Batalkan"
            >
              <i class="mdi mdi-close text-base font-bold"></i>
            </button>

            <router-link
              :to="`/admin/pemesanan/${booking.id}`"
              :class="DETAIL_LINK_CLASS"
            >
              Detail &rarr;
            </router-link>
          </div>
        </td>
      </tr>
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
