<script setup lang="ts">
import { onMounted } from "vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getIconToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
import {
  CANCEL_BUTTON_CLASS,
  useAdminPemesananControlPanel,
} from "./useAdminPemesananControlPanel";

const props = defineProps<{
  pemesananId: number;
  currentStatus: string;
  currentPembayaranStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}>();

const emit = defineEmits(["refresh"]);
const {
  mekanikOptionsDaftar,
  isProcessing,
  selectedMekanikId,
  canConfirm,
  canAssignAndStart,
  canComplete,
  canCancel,
  isCompleted,
  isCancelled,
  canMarkAsPaid,
  pembayaranStatusLabel,
  pembayaranStatusBadgeClass,
  assignedMekanikName,
  showAksiConfirmation,
  aksiConfirmationConfig,
  handleConfirm,
  handleComplete,
  handleCancel,
  handleMarkAsPaid,
  closeAksiConfirmation,
  confirmAksi,
  fetchMekaniks,
  assignMekanikAndStart,
} = useAdminPemesananControlPanel(props, () => emit("refresh"));

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
      <p :class="META_LABEL_CLASS">Mekanik Ditugaskan</p>
      <p
        class="text-sm font-semibold capitalize"
        :class="assignedMekanikName ? getToneTextClass('info') : 'text-gray-600'"
      >
        {{ assignedMekanikName || "Belum ditugaskan" }}
      </p>
    </div>

    <div class="space-y-4 flex-1">
      <div v-if="canConfirm" class="space-y-3">
        <button
          @click="handleConfirm"
          :disabled="isProcessing"
          class="w-full py-3 bg-white border border-blue-700 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="isProcessing"
            ><i class="mdi mdi-loading mdi-spin"></i
          ></span>
          <span v-else
            ><i class="mdi mdi-check-circle text-lg"></i> Konfirmasi
          </span>
        </button>
        <button
          v-if="canCancel"
          @click="handleCancel"
          :disabled="isProcessing"
          :class="CANCEL_BUTTON_CLASS"
        >
          <i class="mdi mdi-close-circle text-lg"></i> Batalkan
        </button>
      </div>

      <div v-else-if="canAssignAndStart" class="space-y-4">
        <div :class="getAlertBoxClass('info')">
          <p class="mb-3 flex items-center gap-2 text-sm font-medium">
            <i class="mdi mdi-information text-lg"></i>
            Pilih mekanik
          </p>
          <CustomSelect
            v-model="selectedMekanikId"
            :options="mekanikOptionsDaftar"
            placeholder="Pilih Mekanik"
            class="mb-3"
          />
          <button
            @click="assignMekanikAndStart"
            :disabled="!selectedMekanikId || isProcessing"
            class="w-full py-3 bg-white border border-blue-700 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isProcessing"
              ><i class="mdi mdi-loading mdi-spin"></i
            ></span>
            <span v-else
              ><i class="mdi mdi-play-circle text-lg"></i> Mulai Servis</span
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
        <div :class="[getAlertBoxClass('warning'), 'mb-3']">
          <p class="flex items-center gap-2 text-sm">
            <i class="mdi mdi-wrench-cog text-lg"></i>
            <span>
              Sedang dikerjakan oleh
              <strong class="capitalize">{{ assignedMekanikName || "Mekanik" }}</strong>
            </span>
          </p>
        </div>
        <button
          @click="handleComplete"
          :disabled="isProcessing"
          class="w-full py-3 bg-white border border-green-600 text-green-600 text-sm font-semibold rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
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
          :class="[getAlertBoxClass('success'), 'flex items-center gap-3']"
        >
          <div
            :class="[
              getIconToneClass('success'),
              'flex h-10 w-10 items-center justify-center rounded-full',
            ]"
          >
            <i class="mdi mdi-check-all text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold">Servis Selesai</h4>
            <p class="mt-1 text-xs">
              Pemesanan ini telah selesai dikerjakan.
            </p>

            <div
              class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-200 bg-white px-3 py-2"
            >
              <div>
                <p :class="META_LABEL_CLASS">
                  Status Pembayaran
                </p>
                <span :class="pembayaranStatusBadgeClass">
                  {{ pembayaranStatusLabel }}
                </span>
              </div>

              <button
                v-if="canMarkAsPaid"
                @click="handleMarkAsPaid"
                :disabled="isProcessing"
                class="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i class="mdi mdi-cash-check"></i>
                Tandai Lunas
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="isCancelled"
          :class="[getAlertBoxClass('error'), 'flex items-center gap-3']"
        >
          <div
            :class="[
              getIconToneClass('danger'),
              'flex h-10 w-10 items-center justify-center rounded-full',
            ]"
          >
            <i class="mdi mdi-close-circle text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold">Dibatalkan</h4>
            <p class="mt-1 text-xs">
              Pemesanan ini telah dibatalkan.
            </p>
            <p v-if="assignedMekanikName" class="mt-2 text-xs text-gray-600">
              Mekanik: <strong>{{ assignedMekanikName }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <CatatanInputModal
      v-if="aksiConfirmationConfig?.value === 'Selesai'"
      :show="showAksiConfirmation"
      :title="aksiConfirmationConfig?.title || 'Konfirmasi Aksi'"
      message="Tuliskan catatan servis untuk pelanggan"
      :confirm-text="aksiConfirmationConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      required
      @confirm="confirmAksi"
      @cancel="closeAksiConfirmation"
    />
    <ConfirmationModal
      v-else
      :show="showAksiConfirmation"
      :title="aksiConfirmationConfig?.title || 'Konfirmasi Aksi'"
      :message="aksiConfirmationConfig?.message || ''"
      :confirm-text="aksiConfirmationConfig?.confirmText || 'Ya, Lanjutkan'"
      cancel-text="Batal"
      :variant="aksiConfirmationConfig?.variant || 'info'"
      @confirm="confirmAksi()"
      @cancel="closeAksiConfirmation"
    />
  </div>
</template>
