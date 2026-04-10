<script setup lang="ts">
import { ref, computed } from "vue";
import { toIDR } from "@/utils/money";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import type { SparepartSummary } from "@/types/inventory";

interface Props {
  show: boolean;
  availableSpareparts: SparepartSummary[];
  isAdding: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: { sparepartId: number; quantity: number }];
  close: [];
}>();

const selectedSparepartId = ref<number | null>(null);
const sparepartQuantity = ref(1);

const sparepartOptions = computed(() =>
  props.availableSpareparts.map((sp) => ({
    value: sp.id,
    label: `${sp.nama_suku_cadang} - ${sp.kategori} (Stok: ${sp.jumlah_stok})`,
  })),
);

const selectedSparepart = computed(() =>
  props.availableSpareparts.find((s) => s.id === selectedSparepartId.value),
);

const estimatedTotal = computed(
  () => (selectedSparepart.value?.harga_jual || 0) * sparepartQuantity.value,
);

const handleSubmit = () => {
  if (!selectedSparepartId.value) return;
  emit("submit", {
    sparepartId: selectedSparepartId.value,
    quantity: sparepartQuantity.value,
  });
};

const handleClose = () => {
  selectedSparepartId.value = null;
  sparepartQuantity.value = 1;
  emit("close");
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
    >
      <div class="bg-gradient-to-r from-red-600 to-red-700 p-6">
        <h3 class="text-2xl font-bold text-white">Tambah Suku Cadang</h3>
      </div>

      <div class="p-6 space-y-5">
        <!-- Sparepart Selector -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Suku Cadang
          </label>
          <CustomSelect
            v-model="selectedSparepartId"
            :options="sparepartOptions"
            placeholder="-- Pilih Suku Cadang --"
          />
        </div>

        <!-- Quantity Input -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Jumlah
          </label>
          <input
            v-model.number="sparepartQuantity"
            type="number"
            min="1"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-gray-50"
          />
        </div>

        <!-- Price Preview -->
        <div
          v-if="selectedSparepart"
          class="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-100"
        >
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-700">Harga Satuan:</span>
            <span class="font-semibold text-gray-900">
              {{ toIDR(selectedSparepart.harga_jual) }}
            </span>
          </div>
          <div
            class="flex justify-between items-center pt-2 border-t border-red-200 mt-2"
          >
            <span class="font-bold text-gray-900">Total:</span>
            <span class="text-xl font-bold text-red-600">{{
              toIDR(estimatedTotal)
            }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            @click="handleClose"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            :disabled="isAdding"
          >
            Batal
          </button>
          <button
            @click="handleSubmit"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isAdding || !selectedSparepartId"
          >
            <span
              v-if="isAdding"
              class="flex items-center justify-center gap-2"
            >
              <i class="mdi mdi-loading mdi-spin"></i>
              Menambahkan...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <i class="mdi mdi-check"></i>
              Tambahkan
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
