<script setup lang="ts">
import { computed, ref } from "vue";
// Tipe form, error, dan nama field diambil dari helper halaman pemesanan.
import type {
  PelangganPemesananErrors,
  PelangganPemesananFormState,
  PemesananFormField,
} from "@/pages/pelanggan/PelangganPemesananPage/pelangganPemesananHelpers";
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";

// Step pemesanan hanya punya tiga nilai yang valid.
type PemesananStep = 1 | 2 | 3;

// Props menerima state form dan fungsi validasi dari parent.
interface Props {
  form: PelangganPemesananFormState;
  errors: PelangganPemesananErrors;
  bookedSlots: string[];
  validateRequiredFields: (fields: PemesananFormField[]) => boolean;
}

// Bentuk data item step yang ditampilkan di progress bar.
interface StepItem {
  id: PemesananStep;
  title: string;
}

const props = defineProps<Props>();

// Step yang sedang aktif dilihat pengguna.
const currentStep = ref<PemesananStep>(1);
// Step tertinggi yang sudah boleh dibuka.
const highestUnlockedStep = ref<PemesananStep>(1);
// Modal ringkasan ditampilkan setelah step terakhir valid.
const showSummaryModal = ref(false);

// Daftar step yang muncul di UI.
const steps: StepItem[] = [
  { id: 1, title: "Pilih Layanan" },
  { id: 2, title: "Pilih Vespa" },
  { id: 3, title: "Pilih Jadwal" },
];

// Field wajib untuk masing-masing step.
const stepRequiredFields: Record<PemesananStep, PemesananFormField[]> = {
  1: ["id_layanan"],
  2: ["id_vespa"],
  3: ["tanggal_pemesanan", "jam_pemesanan"],
};

// Mengecek apakah sebuah step sudah lengkap dan bebas error.
const isStepComplete = (stepId: PemesananStep): boolean => {
  if (stepId === 1) {
    // Step 1 selesai jika minimal satu layanan dipilih.
    return props.form.id_layanan.length > 0 && !props.errors.id_layanan;
  }

  if (stepId === 2) {
    // Step 2 selesai jika Vespa sudah dipilih.
    return !!props.form.id_vespa && !props.errors.id_vespa;
  }

  if (stepId === 3) {
    // Step 3 selesai jika tanggal dan jam valid, serta jam belum dibooking.
    return (
      !!props.form.tanggal_pemesanan &&
      !!props.form.jam_pemesanan &&
      !props.bookedSlots.includes(props.form.jam_pemesanan) &&
      !props.errors.tanggal_pemesanan &&
      !props.errors.jam_pemesanan
    );
  }

  return false;
};

// Daftar id step yang sudah selesai.
const completedSteps = computed(() =>
  steps.filter((step) => isStepComplete(step.id)).map((step) => step.id),
);

// Tombol lanjut aktif jika step saat ini sudah lengkap.
const canContinue = computed(() => {
  return isStepComplete(currentStep.value);
});

// Helper kecil untuk menentukan status tampilan step.
const isUnlocked = (stepId: number) => stepId <= highestUnlockedStep.value;
const isCompleted = (stepId: number) =>
  completedSteps.value.includes(stepId as PemesananStep);
const isActive = (stepId: number) => stepId === currentStep.value;

// Garis penghubung aktif jika step berikutnya sudah terbuka.
const isConnectorActive = (index: number) => {
  const nextStep = steps[index + 1];
  return !!nextStep && nextStep.id <= highestUnlockedStep.value;
};

// Pengguna hanya boleh klik step yang sudah terbuka.
const selectStep = (stepId: number) => {
  if (isUnlocked(stepId)) {
    currentStep.value = stepId as PemesananStep;
  }
};

// Pindah ke step sebelumnya.
const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value = (currentStep.value - 1) as PemesananStep;
  }
};

// Validasi step aktif lalu pindah ke step berikutnya.
const goToNextStep = () => {
  const isCurrentStepValid = props.validateRequiredFields(
    stepRequiredFields[currentStep.value],
  );

  if (!isCurrentStepValid) return;

  if (currentStep.value === 3) {
    // Step terakhir tidak pindah halaman, tetapi membuka modal ringkasan.
    showSummaryModal.value = true;
    return;
  }

  // Buka step berikutnya jika validasi berhasil.
  const nextStep = (currentStep.value + 1) as PemesananStep;
  currentStep.value = nextStep;
  if (nextStep > highestUnlockedStep.value) {
    highestUnlockedStep.value = nextStep;
  }
};

// Menutup modal ringkasan pemesanan.
const closeSummaryModal = () => {
  showSummaryModal.value = false;
};

const previousButtonClass = getButtonClass(
  "secondary",
  "lg",
  "rounded-lg font-bold",
);

const getNextButtonClass = () =>
  getButtonClass(
    canContinue.value ? "primary" : "secondary",
    "lg",
    [
      "rounded-lg px-6 font-bold",
      canContinue.value ? "shadow-md active:scale-[0.98]" : "cursor-not-allowed bg-gray-200 text-gray-500 hover:bg-gray-200",
    ].join(" "),
  );
</script>

<template>
  <div class="space-y-6">
    <!-- Progress bar pemesanan. -->
    <nav class="px-1 py-2" aria-label="Progress pemesanan">
      <ol class="flex items-start">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          class="relative flex flex-1 flex-col items-center text-center"
        >
          <!-- Garis penghubung antar step. -->
          <div
            v-if="index < steps.length - 1"
            :class="[
              'absolute left-1/2 top-[17px] h-1 w-full rounded-full transition-colors',
              isConnectorActive(index) ? 'bg-red-500' : 'bg-gray-200',
            ]"
            aria-hidden="true"
          ></div>

          <!-- Tombol angka/check untuk memilih step. -->
          <button
            type="button"
            :disabled="!isUnlocked(step.id)"
            @click="selectStep(step.id)"
            :class="[
              'relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-red-100',
              isActive(step.id)
                ? 'bg-white ring-4 ring-red-100'
                : isUnlocked(step.id)
                  ? 'hover:scale-105'
                  : 'cursor-not-allowed',
            ]"
            :aria-current="isActive(step.id) ? 'step' : undefined"
          >
            <span
              :class="[
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition',
                isUnlocked(step.id)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-400',
              ]"
            >
              <i
                v-if="isCompleted(step.id)"
                class="mdi mdi-check text-base"
                aria-hidden="true"
              ></i>
              <span v-else class="h-2.5 w-2.5 rounded-full bg-current"></span>
            </span>
          </button>

          <!-- Judul step di bawah bulatan progress. -->
          <div class="mt-3 max-w-[9rem] px-1">
            <p
              :class="[
                'text-xs font-semibold sm:text-sm',
                isUnlocked(step.id) ? 'text-gray-900' : 'text-gray-400',
              ]"
            >
              {{ step.title }}
            </p>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Isi step diisi oleh parent melalui slot. -->
    <slot :current-step="currentStep"></slot>

    <!-- Tombol navigasi antar step. -->
    <div
      class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <button
        v-if="currentStep > 1"
        type="button"
        @click="goToPreviousStep"
        :class="previousButtonClass"
      >
        <i class="mdi mdi-arrow-left text-lg"></i>
        Kembali
      </button>
      <span v-else></span>

      <button
        type="button"
        :disabled="!canContinue"
        @click="goToNextStep"
        :class="getNextButtonClass()"
      >
        {{ currentStep === 3 ? "Lihat Ringkasan" : "Lanjutkan" }}
        <i
          :class="[
            currentStep === 3 ? 'mdi mdi-receipt-text' : 'mdi mdi-arrow-right',
            'text-lg',
          ]"
        ></i>
      </button>
    </div>

    <!-- Modal ringkasan sebelum pesanan dikonfirmasi. -->
    <div
      v-if="showSummaryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      @click.self="closeSummaryModal"
    >
      <div
        class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl"
      >
        <button
          type="button"
          @click="closeSummaryModal"
          :class="getIconButtonClass('neutral', 'md', 'absolute right-3 top-3 z-10 rounded-full bg-white shadow-sm')"
          aria-label="Tutup ringkasan pemesanan"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>

        <!-- Konten ringkasan dikirim dari parent lewat named slot. -->
        <slot name="summary" :close-summary="closeSummaryModal"></slot>
      </div>
    </div>
  </div>
</template>
