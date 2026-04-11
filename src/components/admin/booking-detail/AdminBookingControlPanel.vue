<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/utils/useToast";
import {
  BOOKING_STATUS,
  canAdminAssignAndStart,
  canAdminCancelBooking,
  canAdminCompleteBooking,
  canAdminConfirmBooking,
  isCancelledStatus,
  isCompletedStatus,
} from "@/utils/statusBadge";
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Mechanic {
  id: number;
  nama: string;
  email: string;
}

const props = defineProps<{
  bookingId: number;
  currentStatus: string;
  currentMechanicId: number | null;
  currentMechanicName?: string;
}>();

const emit = defineEmits(["refresh"]);
const toast = useToast();

const availableMechanics = ref<Mechanic[]>([]);
const isProcessing = ref(false);
const selectedMechanicId = ref<number | null>(props.currentMechanicId);

const mechanicOptionsList = computed(() => {
  return availableMechanics.value.map((mech) => ({
    value: mech.id,
    label: mech.nama,
  }));
});

const canConfirm = computed(() => canAdminConfirmBooking(props.currentStatus));
const canAssignAndStart = computed(() =>
  canAdminAssignAndStart(props.currentStatus),
);
const canComplete = computed(() =>
  canAdminCompleteBooking(props.currentStatus),
);
const canCancel = computed(() => canAdminCancelBooking(props.currentStatus));
const isCompleted = computed(() => isCompletedStatus(props.currentStatus));
const isCancelled = computed(() => isCancelledStatus(props.currentStatus));

const CANCEL_BUTTON_CLASS =
  "w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition font-semibold";

async function fetchMechanics() {
  try {
    const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
      headers: getAuthHeaders(),
    });
    availableMechanics.value = data.data || [];
  } catch (err) {
    console.error("Gagal mengambil daftar mekanik:", err);
  }
}

async function updateStatus(newStatus: string, successMessage: string) {
  isProcessing.value = true;
  try {
    await axios.patch(
      `${API_URL}/admin/pemesanan/${props.bookingId}/status`,
      { status: newStatus },
      { headers: getAuthHeaders() },
    );
    toast.success(successMessage);
    emit("refresh");
  } catch (err: any) {
    console.error(`Gagal memperbarui status ke ${newStatus}:`, err);
    toast.error(err.response?.data?.message || "Gagal memperbarui status");
  } finally {
    isProcessing.value = false;
  }
}

async function assignMechanicAndStart() {
  if (!selectedMechanicId.value) {
    toast.error("Silakan pilih mekanik terlebih dahulu");
    return;
  }
  isProcessing.value = true;
  try {
    // 1. Assign mechanic
    await axios.post(
      `${API_URL}/admin/pemesanan/${props.bookingId}/tugaskan-mekanik`,
      { id_mekanik: selectedMechanicId.value },
      { headers: getAuthHeaders() },
    );

    // 2. Update status to In Progress
    await axios.patch(
      `${API_URL}/admin/pemesanan/${props.bookingId}/status`,
      { status: BOOKING_STATUS.IN_PROGRESS },
      { headers: getAuthHeaders() },
    );

    toast.success("Mekanik ditugaskan dan servis dimulai!");
    emit("refresh");
  } catch (err: any) {
    console.error("Gagal menugaskan mekanik dan memulai servis:", err);
    toast.error(err.response?.data?.message || "Gagal memulai servis");
  } finally {
    isProcessing.value = false;
  }
}

const handleConfirm = () => {
  const result = window.confirm(
    "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
  );
  if (result) {
    updateStatus(BOOKING_STATUS.CONFIRMED, "Pemesanan berhasil dikonfirmasi!");
  }
};

const handleComplete = () => {
  const result = window.confirm(
    "Apakah Anda yakin ingin menandai servis ini telah selesai?",
  );
  if (result) {
    updateStatus(BOOKING_STATUS.COMPLETED, "Pemesanan berhasil diselesaikan!");
  }
};

const handleCancel = () => {
  const result = window.confirm(
    "Apakah Anda yakin ingin membatalkan pemesanan ini?",
  );
  if (result) {
    updateStatus(BOOKING_STATUS.CANCELLED, "Pemesanan berhasil dibatalkan!");
  }
};

onMounted(() => {
  fetchMechanics();
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full"
  >
    <h3 class="text-sm font-bold text-gray-900 mb-4 h-9 flex items-center">
      Kontrol Pemesanan
    </h3>

    <div class="space-y-4 flex-1">
      <!-- PENDING: Show Confirm & Cancel -->
      <div v-if="canConfirm" class="space-y-3">
        <button
          @click="handleConfirm"
          :disabled="isProcessing"
          class="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="isProcessing"
            ><i class="mdi mdi-loading mdi-spin"></i
          ></span>
          <span v-else
            ><i class="mdi mdi-check-circle text-lg"></i> Konfirmasi
            Pemesanan</span
          >
        </button>
        <button
          v-if="canCancel"
          @click="handleCancel"
          :disabled="isProcessing"
          :class="CANCEL_BUTTON_CLASS"
        >
          Batalkan
        </button>
      </div>

      <!-- CONFIRMED: Show Assign Mechanic & Cancel -->
      <div v-else-if="canAssignAndStart" class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p
            class="text-sm text-blue-800 mb-3 font-medium flex items-center gap-2"
          >
            <i class="mdi mdi-information text-lg"></i>
            Pilih mekanik untuk mulai servis
          </p>
          <CustomSelect
            v-model="selectedMechanicId"
            :options="mechanicOptionsList"
            placeholder="-- Pilih Mekanik --"
            class="mb-3"
          />
          <button
            @click="assignMechanicAndStart"
            :disabled="!selectedMechanicId || isProcessing"
            class="w-full py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="isProcessing"
              ><i class="mdi mdi-loading mdi-spin"></i
            ></span>
            <span v-else
              ><i class="mdi mdi-play-circle text-lg"></i> Pilih & Mulai
              Servis</span
            >
          </button>
        </div>
        <button
          v-if="canCancel"
          @click="handleCancel"
          :disabled="isProcessing"
          :class="CANCEL_BUTTON_CLASS"
        >
          Batalkan
        </button>
      </div>

      <!-- IN PROGRESS: Show Complete -->
      <div v-else-if="canComplete" class="space-y-3">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
          <p class="text-sm text-purple-800 flex items-center gap-2">
            <i class="mdi mdi-cog animate-spin text-lg"></i>
            <span>
              Sedang dikerjakan oleh:
              <strong>{{ currentMechanicName || "Mekanik" }}</strong>
            </span>
          </p>
        </div>
        <button
          @click="handleComplete"
          :disabled="isProcessing"
          class="w-full py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="isProcessing"
            ><i class="mdi mdi-loading mdi-spin"></i
          ></span>
          <span v-else
            ><i class="mdi mdi-check-all text-lg"></i> Tandai Selesai</span
          >
        </button>
      </div>

      <!-- COMPLETED or CANCELLED: Status Info Only -->
      <div v-else>
        <div
          v-if="isCompleted"
          class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"
          >
            <i class="mdi mdi-check-all text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-green-800">Servis Selesai</h4>
            <p class="text-xs text-green-600 mt-1">
              Pemesanan ini telah selesai dikerjakan.
            </p>
          </div>
        </div>
        <div
          v-if="isCancelled"
          class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"
          >
            <i class="mdi mdi-close-circle text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-red-800">Dibatalkan</h4>
            <p class="text-xs text-red-600 mt-1">
              Pemesanan ini telah dibatalkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
