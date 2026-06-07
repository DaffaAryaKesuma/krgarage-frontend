<script setup lang="ts">
// onMounted dipakai untuk mengambil daftar mekanik saat panel tampil.
import { onMounted } from "vue";
// Modal konfirmasi umum dan modal catatan selesai.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CatatanInputModal from "@/components/ui/CatatanInputModal.vue";
// Select mekanik.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Format completed_at dan paid_at.
import { formatDateTimeShort } from "@/utils/date";
// Helper class tampilan.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getIconToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
// Class tombol dan logic panel berasal dari composable.
import {
  CANCEL_BUTTON_CLASS,
  COMPLETE_BUTTON_CLASS,
  CONFIRM_BUTTON_CLASS,
  MARK_PAID_BUTTON_CLASS,
  useAdminPemesananControlPanel,
} from "./useAdminPemesananControlPanel";

// Props panel kontrol berasal dari detail pemesanan.
const props = defineProps<{
  pemesananId: number;
  currentStatus: string;
  currentPembayaranStatus?: string | null;
  completedAt?: string | null;
  paidAt?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}>();

// refresh dikirim ke parent setelah aksi berhasil.
const emit = defineEmits(["refresh"]);
// Ambil state dan handler panel dari composable.
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

// Ambil mekanik untuk dropdown setelah komponen mounted.
onMounted(() => {
  void fetchMekaniks();
});
</script>

<template>
  <!-- Panel kontrol pemesanan di halaman detail admin. -->
  <div
    class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
  >
    <h3 class="mb-3 flex items-center text-sm font-bold text-gray-900">
      Kontrol Pemesanan
    </h3>

    <!-- Informasi mekanik yang sudah ditugaskan. -->
    <div
      :class="[
        getAlertBoxClass(assignedMekanikName ? 'info' : 'neutral'),
        'mb-4 px-3 py-2 shadow-none',
      ]"
    >
      <p :class="META_LABEL_CLASS">Mekanik Ditugaskan</p>
      <p
        class="text-sm font-semibold capitalize"
        :class="assignedMekanikName ? getToneTextClass('info') : 'text-gray-600'"
      >
        {{ assignedMekanikName || "Belum ditugaskan" }}
      </p>
    </div>

    <!-- Area aksi berubah sesuai status pemesanan. -->
    <div class="space-y-4 flex-1">
      <!-- Status Menunggu: bisa konfirmasi atau batal. -->
      <div v-if="canConfirm" class="space-y-3">
        <button
          @click="handleConfirm"
          :disabled="isProcessing"
          :class="CONFIRM_BUTTON_CLASS"
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

      <!-- Status Dikonfirmasi: pilih mekanik lalu mulai servis. -->
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
            :class="CONFIRM_BUTTON_CLASS"
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

      <!-- Status Dikerjakan: tandai selesai. -->
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
          :class="COMPLETE_BUTTON_CLASS"
        >
          <span v-if="isProcessing"
            ><i class="mdi mdi-loading mdi-spin"></i
          ></span>
          <span v-else
            ><i class="mdi mdi-check-all text-lg"></i> Tandai Selesai</span
          >
        </button>
      </div>

      <!-- Status akhir: tampilkan selesai/batal dan pembayaran. -->
      <div v-else>
        <div
          v-if="isCompleted"
          :class="[getAlertBoxClass('success'), 'space-y-3']"
        >
          <div class="flex items-start gap-3">
            <div
              :class="[
                getIconToneClass('success'),
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              ]"
            >
              <i class="mdi mdi-check-all text-lg"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-sm font-bold">Servis Selesai</h4>
              <p v-if="props.completedAt" class="mt-1 text-xs">
                {{ formatDateTimeShort(props.completedAt) }}
              </p>
            </div>
          </div>

          <div class="rounded-lg border border-green-200 bg-white/70 px-3 py-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p :class="META_LABEL_CLASS">Pembayaran</p>
                <span :class="pembayaranStatusBadgeClass">
                  {{ pembayaranStatusLabel }}
                </span>
              </div>

              <button
                v-if="canMarkAsPaid"
                @click="handleMarkAsPaid"
                :disabled="isProcessing"
                :class="MARK_PAID_BUTTON_CLASS"
              >
                <i class="mdi mdi-cash-check"></i>
                Tandai Lunas
              </button>
            </div>
            <p v-if="props.paidAt" class="mt-2 text-xs text-gray-600">
              {{ formatDateTimeShort(props.paidAt) }}
            </p>
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

    <!-- Jika aksi selesai, pakai modal catatan wajib. -->
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
    <!-- Aksi lain pakai modal konfirmasi biasa. -->
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
