<script setup lang="ts">
import { computed } from "vue";
import { formatDateShort } from "@/utils/date";
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Booking {
  id: number;
  kode_pemesanan: string;
  pengguna: { nama: string };
  tanggal_pemesanan: string;
  status: string;
  id_mekanik: number | null;
  mekanik?: { id: number; nama: string } | null;
}

interface MechanicOption {
  value: number;
  label: string;
}

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

const STATUS_OPTIONS = [
  {
    value: "Pending",
    label: "Menunggu",
    icon: "clock-outline",
    color: "yellow",
  },
  {
    value: "Confirmed",
    label: "Dikonfirmasi",
    icon: "check-circle",
    color: "blue",
  },
  {
    value: "In Progress",
    label: "Dikerjakan",
    icon: "hammer-wrench",
    color: "purple",
  },
  { value: "Completed", label: "Selesai", icon: "check-all", color: "green" },
  { value: "Cancelled", label: "Batal", icon: "close-circle", color: "red" },
];

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Status",
  "Mekanik",
  "Aksi",
];

const hasBookings = computed(() => props.bookings.length > 0);

const handleStatusChange = (
  booking: Booking,
  value: string | number | null,
) => {
  if (typeof value === "string") {
    emit("statusChange", booking, value);
  }
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
        to="/admin/bookings"
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
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in TABLE_HEADERS"
              :key="header"
              class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="booking in bookings"
            :key="booking.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ booking.kode_pemesanan }}
            </td>
            <td
              class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ formatDateShort(booking.tanggal_pemesanan) }}
            </td>
            <td
              class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ booking.pengguna.nama }}
            </td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
              <div class="min-w-[120px]">
                <CustomSelect
                  :model-value="booking.status"
                  :options="STATUS_OPTIONS"
                  @update:model-value="
                    (value) => handleStatusChange(booking, value)
                  "
                />
              </div>
            </td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
              <!-- Show mechanic dropdown for Confirmed status -->
              <div
                v-if="booking.status === 'Confirmed'"
                class="flex items-center gap-2"
              >
                <div class="min-w-[120px]">
                  <CustomSelect
                    :model-value="selectedMechanics[booking.id] ?? null"
                    @update:model-value="
                      (value) => handleMechanicChange(booking.id, value)
                    "
                    :options="mechanicOptions"
                    placeholder="Pilih Mekanik"
                  />
                </div>
                <button
                  @click="emit('assignAndStart', booking)"
                  :disabled="!selectedMechanics[booking.id]"
                  class="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                  title="Assign & Mulai"
                >
                  <i class="mdi mdi-play-circle"></i>
                </button>
              </div>
              <!-- Show mechanic name if already assigned -->
              <span
                v-else-if="booking.mekanik"
                class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                <i class="mdi mdi-account-wrench"></i>
                {{ booking.mekanik.nama }}
              </span>
              <span v-else class="text-xs text-gray-400">-</span>
            </td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
              <router-link
                :to="`/admin/bookings/${booking.id}`"
                class="text-blue-600 hover:text-blue-800 font-semibold no-underline"
              >
                Detail →
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
