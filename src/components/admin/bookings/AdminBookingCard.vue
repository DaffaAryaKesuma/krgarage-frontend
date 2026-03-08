<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import {
  getStatusBadge,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/statusBadge";
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  total_harga: number | null;
  id_mekanik: number | null;
  pengguna: { nama: string; email: string };
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
  mekanik?: { id: number; nama: string } | null;
}

interface MechanicOption {
  value: number;
  label: string;
}

interface Props {
  booking: Booking;
  mechanicOptions: MechanicOption[];
  selectedMechanicId?: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [booking: Booking];
  cancel: [booking: Booking];
  complete: [booking: Booking];
  assignAndStart: [booking: Booking];
  "update:selectedMechanicId": [mechanicId: number | null];
}>();

const getUserInitial = (name?: string) => name?.charAt(0).toUpperCase() || "?";

const getServicesList = (layanan: Booking["layanan"]) =>
  layanan.map((s) => s.nama_layanan).join(", ");

const CANCEL_BUTTON_CLASS =
  "w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition";

const handleMechanicChange = (value: string | number | null) => {
  emit("update:selectedMechanicId", typeof value === "number" ? value : null);
};
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between mb-4 pb-4 border-b border-gray-100"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg"
        >
          {{ getUserInitial(booking.pengguna?.nama) }}
        </div>
        <div>
          <p class="font-bold text-gray-900">
            {{ booking.pengguna?.nama || "N/A" }}
          </p>
        </div>
      </div>
      <span
        class="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded"
      >
        {{ booking.kode_pemesanan }}
      </span>
    </div>

    <!-- Vespa & Date Info -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="flex items-start gap-2">
        <i class="mdi mdi-motorbike text-2xl text-gray-600 flex-shrink-0"></i>
        <div>
          <p class="text-xs text-gray-500">Vespa</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ booking.vespa?.model || "N/A" }}
          </p>
          <p class="text-xs text-gray-600">
            {{ booking.vespa?.plat_nomor || "N/A" }}
          </p>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <i class="mdi mdi-calendar text-2xl text-gray-600 flex-shrink-0"></i>
        <div>
          <p class="text-xs text-gray-500">Tanggal Pemesanan</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ formatDateShort(booking.tanggal_pemesanan) }}
          </p>
          <p class="text-xs text-gray-600 mt-0.5">
            <i class="mdi mdi-clock-outline mr-1"></i
            >{{ booking.jam_pemesanan || "-" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Services -->
    <div class="mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-start gap-2">
        <i class="mdi mdi-wrench text-xl text-gray-600 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="text-xs text-gray-500 mb-1">Layanan</p>
          <p class="text-sm font-medium text-gray-900">
            {{ getServicesList(booking.layanan) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Status Display -->
    <div class="mb-4">
      <p class="text-xs text-gray-500 mb-2">Status Pemesanan:</p>
      <div class="flex items-center gap-2">
        <span
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-semibold',
            getStatusBadge(booking.status),
          ]"
        >
          <i :class="['mdi mr-1', getStatusIcon(booking.status)]"></i>
          {{ getStatusLabel(booking.status) }}
        </span>
        <span
          v-if="booking.mekanik"
          class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
        >
          <i class="mdi mdi-account-wrench"></i>
          {{ booking.mekanik.nama }}
        </span>
      </div>
    </div>

    <!-- Action Buttons Based on Status -->
    <div class="space-y-2">
      <!-- PENDING: Show Confirm Button -->
      <div v-if="booking.status === 'Pending'" class="space-y-2">
        <button
          @click="emit('confirm', booking)"
          class="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <i class="mdi mdi-check-circle"></i>
          Konfirmasi Pemesanan
        </button>
        <button @click="emit('cancel', booking)" :class="CANCEL_BUTTON_CLASS">
          Batalkan
        </button>
      </div>

      <!-- CONFIRMED: Show Assign Mechanic & Start Service -->
      <div v-else-if="booking.status === 'Confirmed'" class="space-y-2">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-xs text-blue-800 mb-2 font-medium">
            <i class="mdi mdi-information"></i>
            Pilih mekanik untuk mulai servis
          </p>
          <CustomSelect
            :model-value="selectedMechanicId ?? null"
            @update:model-value="handleMechanicChange"
            :options="mechanicOptions"
            placeholder="Pilih Mekanik"
            class="mb-2"
          />
          <button
            @click="emit('assignAndStart', booking)"
            :disabled="!selectedMechanicId"
            class="w-full py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <i class="mdi mdi-play-circle"></i>
            Assign & Mulai Servis
          </button>
        </div>
        <button @click="emit('cancel', booking)" :class="CANCEL_BUTTON_CLASS">
          Batalkan
        </button>
      </div>

      <!-- IN PROGRESS: Show Complete Button -->
      <div v-else-if="booking.status === 'In Progress'" class="space-y-2">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2">
          <p class="text-xs text-purple-800">
            <i class="mdi mdi-cog animate-spin"></i>
            Sedang dikerjakan oleh:
            <strong>{{ booking.mekanik?.nama || "Belum ditentukan" }}</strong>
          </p>
        </div>
        <button
          @click="emit('complete', booking)"
          class="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <i class="mdi mdi-check-all"></i>
          Tandai Selesai
        </button>
      </div>

      <!-- COMPLETED or CANCELLED: Show View Details Only -->
      <div v-else>
        <div
          v-if="booking.status === 'Completed'"
          class="bg-green-50 border border-green-200 rounded-lg p-2 mb-2"
        >
          <p class="text-xs text-green-800">
            <i class="mdi mdi-check-all"></i>
            Servis telah selesai
          </p>
        </div>
      </div>

      <!-- Detail Button (Always Show) -->
      <router-link
        :to="`/admin/bookings/${booking.id}`"
        class="block w-full py-2.5 text-center bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        <i class="mdi mdi-eye"></i>
        Lihat Detail Lengkap
      </router-link>
    </div>
  </div>
</template>
