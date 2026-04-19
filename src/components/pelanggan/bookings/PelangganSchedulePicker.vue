<script setup lang="ts">
interface Props {
  timeSlots: string[];
  bookedSlots: string[];
  dateValue: string;
  timeValue: string;
  notes: string;
  dateError?: string;
  timeError?: string;
  dateTouched?: boolean;
  timeTouched?: boolean;
}

interface Emits {
  (e: "update:dateValue", value: string): void;
  (e: "update:timeValue", value: string): void;
  (e: "update:notes", value: string): void;
  (e: "dateChange"): void;
  (e: "timeSelect", slot: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDateChange = () => {
  emit("update:dateValue", props.dateValue);
  emit("dateChange");
};

const selectTime = (slot: string) => {
  emit("update:timeValue", slot);
  emit("timeSelect", slot);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
      >
        <i class="mdi mdi-calendar-clock text-xl text-green-600"></i>
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
          Jadwal Pemesanan
        </h2>
        <p class="text-sm text-gray-500">Pilih tanggal dan jam yang sesuai</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Date -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="mdi mdi-calendar text-green-600 mr-1"></i>Tanggal Pemesanan
          <span class="text-red-500">*</span>
        </label>
        <input
          :value="dateValue"
          @input="
            emit('update:dateValue', ($event.target as HTMLInputElement).value)
          "
          @change="handleDateChange"
          type="date"
          :min="new Date().toISOString().split('T')[0]"
          :class="[
            'w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none',
            dateError && dateTouched
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 focus:border-green-500',
          ]"
        />
        <p
          v-if="dateError && dateTouched"
          class="text-red-600 text-sm mt-2 flex items-center gap-1"
        >
          <i class="mdi mdi-alert-circle"></i>{{ dateError }}
        </p>
      </div>

      <!-- Time -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="mdi mdi-clock-outline text-green-600 mr-1"></i>Jam Pemesanan
          <span class="text-red-500">*</span>
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
              bookedSlots.includes(slot)
                ? 'bg-red-100 border-red-300 text-red-600 opacity-50 cursor-not-allowed line-through'
                : timeValue === slot
                  ? 'bg-green-500 border-green-600 text-white shadow-lg'
                  : 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50',
            ]"
          >
            {{ slot }}
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          <i class="mdi mdi-information-outline"></i> Merah = Sudah dipesan
        </p>
        <p
          v-if="timeError && timeTouched"
          class="text-red-600 text-sm mt-2 flex items-center gap-1"
        >
          <i class="mdi mdi-alert-circle"></i>{{ timeError }}
        </p>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="mdi mdi-note-text text-green-600 mr-1"></i>Catatan Tambahan
        (Opsional)
      </label>
      <textarea
        :value="notes"
        @input="
          emit('update:notes', ($event.target as HTMLTextAreaElement).value)
        "
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
        rows="4"
        placeholder="Contoh: Vespa terasa kurang responsif, mohon dicek karburator dan kampas rem..."
      ></textarea>
    </div>
  </div>
</template>
