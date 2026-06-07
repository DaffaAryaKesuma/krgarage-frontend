<script setup lang="ts">
// Helper class untuk alert, ikon, dan warna teks.
import {
  getAlertBoxClass,
  getAlertIconClass,
  getIconToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
// Helper class untuk label, hint, input, textarea, dan error.
import {
  FORM_ERROR_CLASS,
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";
// Helper class untuk slot jam yang tersedia, dipilih, atau sudah dibooking.
import { getTimeSlotClass } from "@/utils/selectionVariants";

// Props menerima daftar jam, slot penuh, nilai form, dan error validasi.
interface Props {
  timeSlots: string[];
  bookedSlots: string[];
  dateValue: string;
  timeValue: string;
  catatan: string;
  dateError?: string;
  timeError?: string;
  dateTouched?: boolean;
  timeTouched?: boolean;
}

// Event update:* membuat komponen ini bisa dipakai dengan v-model terpisah.
interface Emits {
  (e: "update:dateValue", value: string): void;
  (e: "update:timeValue", value: string): void;
  (e: "update:catatan", value: string): void;
  (e: "dateChange"): void;
  (e: "timeSelect", slot: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Saat tanggal berubah, parent diberi sinyal untuk mengambil slot jam terbaru.
const handleDateChange = () => {
  emit("update:dateValue", props.dateValue);
  emit("dateChange");
};

// Saat jam dipilih, update nilai jam dan beri tahu parent.
const selectTime = (slot: string) => {
  emit("update:timeValue", slot);
  emit("timeSelect", slot);
};
</script>

<template>
  <!-- Kartu utama step pilih jadwal. -->
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <!-- Header step. -->
    <div class="flex items-center gap-3 mb-6">
      <div
        :class="[
          getIconToneClass('success'),
          'flex h-10 w-10 items-center justify-center rounded-full',
        ]"
      >
        <i class="mdi mdi-calendar-clock text-xl"></i>
      </div>
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900">
          Jadwal Pemesanan
        </h2>
        <p class="text-sm text-gray-500">Pilih tanggal dan jam yang sesuai</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Input tanggal pemesanan. -->
      <div>
        <label :class="FORM_LABEL_CLASS">
          <i :class="['mdi mdi-calendar mr-1', getToneTextClass('success')]"></i>Tanggal Pemesanan
          <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
        </label>
        <input
          :value="dateValue"
          @input="
            emit('update:dateValue', ($event.target as HTMLInputElement).value)
          "
          @change="handleDateChange"
          type="date"
          :min="new Date().toISOString().split('T')[0]"
          :class="getFormInputClass(!!(dateError && dateTouched), 'px-4 py-3')"
        />
        <!-- Error tanggal muncul setelah field disentuh. -->
        <p
          v-if="dateError && dateTouched"
          :class="FORM_ERROR_CLASS"
        >
          <i class="mdi mdi-alert-circle text-xs"></i>{{ dateError }}
        </p>
      </div>

      <!-- Pilihan jam pemesanan. -->
      <div>
        <label :class="FORM_LABEL_CLASS">
          <i :class="['mdi mdi-clock-outline mr-1', getToneTextClass('success')]"></i>Jam Pemesanan
          <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="slot in timeSlots"
            :key="slot"
            type="button"
            @click="selectTime(slot)"
            :disabled="bookedSlots.includes(slot)"
            :class="[
              'py-2 px-2 rounded-lg font-semibold text-sm transition border-2',
              getTimeSlotClass({
                booked: bookedSlots.includes(slot),
                selected: timeValue === slot,
              }),
            ]"
          >
            {{ slot }}
          </button>
        </div>
        <!-- Hint menjelaskan arti warna slot. -->
        <p :class="FORM_HINT_CLASS">
          <i class="mdi mdi-information-outline"></i> Merah = Sudah dipesan
        </p>
        <!-- Pesan khusus jika semua slot penuh karena mekanik sibuk -->
        <div
          v-if="bookedSlots.length === timeSlots.length"
          :class="[getAlertBoxClass('warning'), 'mt-3 flex items-start gap-2 px-3 py-2 shadow-none']"
        >
          <i
            :class="[getAlertIconClass('warning'), 'mdi mdi-wrench-clock mt-0.5 flex-shrink-0']"
          ></i>
          <p class="text-xs font-medium">
            Semua mekanik sedang sibuk di tanggal ini
          </p>
        </div>
        <!-- Error jam muncul setelah field disentuh. -->
        <p
          v-if="timeError && timeTouched"
          :class="FORM_ERROR_CLASS"
        >
          <i class="mdi mdi-alert-circle text-xs"></i>{{ timeError }}
        </p>
      </div>
    </div>

    <!-- Catatan tambahan dari pelanggan, sifatnya opsional. -->
    <div>
      <label :class="FORM_LABEL_CLASS">
        <i :class="['mdi mdi-note-text mr-1', getToneTextClass('success')]"></i>Catatan Tambahan
        (Opsional)
      </label>
      <textarea
        :value="catatan"
        @input="
          emit('update:catatan', ($event.target as HTMLTextAreaElement).value)
        "
        :class="getFormTextareaClass(false, 'px-4 py-3')"
        rows="4"
        placeholder="Contoh: Vespa terasa kurang responsif, mohon dicek karburator dan kampas rem..."
      ></textarea>
    </div>
  </div>
</template>
