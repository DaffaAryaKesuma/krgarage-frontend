<script setup lang="ts">
import { computed } from "vue";
import { formatDateShort } from "@/utils/date";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import type { Booking, MechanicOption } from "@/types/booking";
import TableShell from "@/components/ui/TableShell.vue";

interface Props {
  bookings: Booking[];
  mechanicOptions: MechanicOption[];
  selectedMechanics: { [bookingId: number]: number };
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
  "Mekanik",
  "Aksi",
];

const ACTION_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition";

const ICON_ACTION_BUTTON_CLASS =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition";

const DETAIL_LINK_CLASS =
  "inline-flex h-8 shrink-0 items-center rounded-lg border-2 border-indigo-50 bg-white px-3 text-xs font-semibold text-indigo-600 no-underline transition hover:bg-indigo-50 hover:text-indigo-800";

const hasBookings = computed(() => props.bookings.length > 0);

const handleConfirm = (booking: Booking) => {
  const result = window.confirm(
    "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
  );
  if (result) emit("statusChange", booking, "Confirmed");
};

const handleComplete = (booking: Booking) => {
  const result = window.confirm(
    "Apakah Anda yakin ingin menandai servis ini telah selesai?",
  );
  if (result) emit("statusChange", booking, "Completed");
};

const handleCancel = (booking: Booking) => {
  const result = window.confirm(
    "Apakah Anda yakin ingin membatalkan pemesanan ini?",
  );
  if (result) emit("statusChange", booking, "Cancelled");
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
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <div
      class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
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
      mobile-cards-class="space-y-4 p-4"
      table-class="min-w-full divide-y divide-gray-200"
      head-class="bg-gray-50"
      header-cell-class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      body-class="bg-white divide-y divide-gray-200"
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

          <div class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
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
            <div v-if="booking.status === 'Confirmed'" class="space-y-2">
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
              v-if="booking.status === 'Pending'"
              @click="handleConfirm(booking)"
              class="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
              title="Konfirmasi"
            >
              Konfirmasi
            </button>

            <button
              v-if="booking.status === 'In Progress'"
              @click="handleComplete(booking)"
              class="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition"
              title="Tandai Selesai"
            >
              Tandai Selesai
            </button>

            <button
              v-if="
                booking.status === 'Pending' || booking.status === 'Confirmed'
              "
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
        class="hover:bg-gray-50 transition-colors"
      >
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <span class="font-semibold text-gray-800">{{
            booking.kode_pemesanan
          }}</span>
        </td>
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {{ formatDateShort(booking.tanggal_pemesanan) }}
        </td>
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ booking.pengguna.nama }}
        </td>
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
          <span :class="getStatusBadgeClass(booking.status)">
            {{ getStatusLabel(booking.status) }}
          </span>
        </td>
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
          <div
            v-if="booking.status === 'Confirmed'"
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
        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="booking.status === 'Pending'"
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
              v-if="booking.status === 'In Progress'"
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
              v-if="
                booking.status === 'Pending' || booking.status === 'Confirmed'
              "
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
  </div>
</template>
