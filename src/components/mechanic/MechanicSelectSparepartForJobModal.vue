<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { getAuthHeaders } from "@/utils/auth";
import { toIDR } from "@/utils/money";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import { API_URL } from "@/utils/api";
import type { SparepartSummary } from "@/types/inventory";

const toast = useToast();

const props = defineProps<{
  bookingId: number;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const spareparts = ref<SparepartSummary[]>([]);
const selectedSparepartId = ref<number | null>(null);
const sparepartQuantity = ref(1);
const isAddingSparepart = ref(false);

// Computed: Options untuk CustomSelect
const sparepartOptions = computed(() =>
  spareparts.value.map((sp) => ({
    value: sp.id,
    label: `${sp.nama_suku_cadang} - Stock: ${sp.jumlah_stok} - ${toIDR(
      sp.harga_jual,
    )}`,
  })),
);

// Get selected sparepart
const selectedSparepart = computed(() =>
  spareparts.value.find((s) => s.id === selectedSparepartId.value),
);

// Estimated total
const estimatedTotal = computed(() => {
  if (!selectedSparepart.value) return 0;
  return selectedSparepart.value.harga_jual * sparepartQuantity.value;
});

const fetchSpareparts = async () => {
  try {
    const response = await axios.get(`${API_URL}/mekanik/suku-cadang`, {
      headers: getAuthHeaders(),
    });

    const sparepartsData = response.data.data || response.data;
    spareparts.value = Array.isArray(sparepartsData) ? sparepartsData : [];

    // Ensure we always have some data to work with
    if (spareparts.value.length === 0) {
      // If API returns empty, keep empty (don't show test data in production)
      spareparts.value = [];
    }
  } catch (error: any) {
    logError(error, "fetchSpareparts");
    toast.error(handleApiError(error));
    spareparts.value = [];
  }
};

const addSparepart = async () => {
  if (!selectedSparepartId.value) {
    toast.error("Pilih sparepart terlebih dahulu");
    return;
  }

  if (
    sparepartQuantity.value <= 0 ||
    !selectedSparepart.value ||
    sparepartQuantity.value > selectedSparepart.value.jumlah_stok
  ) {
    toast.error("Jumlah tidak valid");
    return;
  }

  isAddingSparepart.value = true;
  try {
    await axios.post(
      `${API_URL}/mekanik/pemesanan/${props.bookingId}/tambah-suku-cadang`,
      {
        id_suku_cadang: selectedSparepartId.value,
        jumlah: sparepartQuantity.value,
      },
      { headers: getAuthHeaders() },
    );

    toast.success("Sparepart berhasil ditambahkan");
    emit("success");

    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch (error: any) {
    logError(error, "addSparepart");
    toast.error(handleApiError(error));
  } finally {
    isAddingSparepart.value = false;
  }
};

const closeModal = () => {
  selectedSparepartId.value = null;
  sparepartQuantity.value = 1;
  emit("close");
};

// Watch for modal open and fetch spareparts
watch(
  () => props.show,
  async (newShow) => {
    if (newShow) {
      await fetchSpareparts();
    }
  },
  { immediate: false },
);

// Also fetch on component mount as backup
onMounted(() => {
  fetchSpareparts();
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 p-6">
        <h3 class="text-2xl font-bold text-white">Tambah Suku Cadang</h3>
      </div>

      <!-- Content -->
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
            :max="selectedSparepart?.jumlah_stok"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-gray-50"
          />
          <p v-if="selectedSparepart" class="text-xs text-gray-500 mt-1">
            Maksimal: {{ selectedSparepart.jumlah_stok }}
          </p>
        </div>

        <!-- harga Preview -->
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
            @click="closeModal"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            :disabled="isAddingSparepart"
          >
            Batal
          </button>
          <button
            @click="addSparepart"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isAddingSparepart || !selectedSparepartId"
          >
            <span
              v-if="isAddingSparepart"
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
