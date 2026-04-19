<script setup lang="ts">
import { onMounted } from "vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  CANCEL_BUTTON_CLASS,
  useAdminBookingControlPanel,
} from "@/composables/useAdminBookingControlPanel";

const props = defineProps<{
  bookingId: number;
  currentStatus: string;
  currentPaymentStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}>();

const emit = defineEmits(["refresh"]);
const {
  mekanikOptionsList,
  isProcessing,
  selectedMekanikId,
  canConfirm,
  canAssignAndStart,
  canComplete,
  canCancel,
  isCompleted,
  isCancelled,
  canMarkAsPaid,
  paymentStatusLabel,
  paymentStatusBadgeClass,
  assignedMekanikName,
  showActionConfirmation,
  actionConfirmationConfig,
  handleConfirm,
  handleComplete,
  handleCancel,
  handleMarkAsPaid,
  closeActionConfirmation,
  confirmAction,
  fetchMekaniks,
  assignMekanikAndStart,
} = useAdminBookingControlPanel(props, () => emit("refresh"));

onMounted(() => {
  void fetchMekaniks();
});
</script>

<template>
  <div
    class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
  >
    <h3 class="mb-3 flex items-center text-sm font-bold text-gray-900">
      Kontrol Pemesanan
    </h3>

    <div
      class="mb-4 rounded-lg border px-3 py-2"
      :class="
        assignedMekanikName
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 bg-gray-50'
      "
    >
      <p class="text-xs text-gray-500">Mekanik Ditugaskan</p>
      <p
        class="text-sm font-semibold"
        :class="assignedMekanikName ? 'text-blue-800' : 'text-gray-600'"
      >
        {{ assignedMekanikName || "Belum ditugaskan" }}
      </p>
    </div>

    <div class="space-y-4 flex-1">
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

      <div v-else-if="canAssignAndStart" class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p
            class="text-sm text-blue-800 mb-3 font-medium flex items-center gap-2"
          >
            <i class="mdi mdi-information text-lg"></i>
            Pilih mekanik untuk mulai servis
          </p>
          <CustomSelect
            v-model="selectedMekanikId"
            :options="mekanikOptionsList"
            placeholder="-- Pilih Mekanik --"
            class="mb-3"
          />
          <button
            @click="assignMekanikAndStart"
            :disabled="!selectedMekanikId || isProcessing"
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

      <div v-else-if="canComplete" class="space-y-3">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
          <p class="text-sm text-purple-800 flex items-center gap-2">
            <i class="mdi mdi-cog animate-spin text-lg"></i>
            <span>
              Sedang dikerjakan oleh:
              <strong>{{ assignedMekanikName || "Mekanik" }}</strong>
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

            <div
              class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-200 bg-white px-3 py-2"
            >
              <div>
                <p
                  class="text-[11px] font-medium uppercase tracking-wide text-gray-500"
                >
                  Status Pembayaran
                </p>
                <span :class="paymentStatusBadgeClass">
                  {{ paymentStatusLabel }}
                </span>
              </div>

              <button
                v-if="canMarkAsPaid"
                @click="handleMarkAsPaid"
                :disabled="isProcessing"
                class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i class="mdi mdi-cash-check"></i>
                Tandai Lunas
              </button>
            </div>
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
            <p v-if="assignedMekanikName" class="mt-2 text-xs text-gray-600">
              Mekanik: <strong>{{ assignedMekanikName }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
      :show="showActionConfirmation"
      :title="actionConfirmationConfig?.title || 'Konfirmasi Aksi'"
      :message="actionConfirmationConfig?.message || ''"
      :confirm-text="actionConfirmationConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      :variant="actionConfirmationConfig?.variant || 'info'"
      @confirm="confirmAction"
      @cancel="closeActionConfirmation"
    />
  </div>
</template>
