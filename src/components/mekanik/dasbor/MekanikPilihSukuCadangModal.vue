<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { getAuthHeaders } from "@/utils/auth";
import { toIDR } from "@/utils/money";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import { API_URL } from "@/utils/api";
import type { SukuCadangRingkasan } from "@/types/inventaris";

const toast = useToast();

const props = defineProps<{
  pemesananId: number;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const sukucadang = ref<SukuCadangRingkasan[]>([]);
const selectedSukuCadangId = ref<number | null>(null);
const sukucadangQuantity = ref(1);
const isAddingSukuCadang = ref(false);

// Computed: Opsi untuk CustomSelect
const sukucadangOptions = computed(() =>
  sukucadang.value.map((sp) => ({
    value: sp.id,
    label: `${sp.nama_suku_cadang} - Stok: ${sp.jumlah_stok} - ${toIDR(
      sp.harga_jual,
    )}`,
  })),
);

// Ambil suku cadang yang dipilih
const selectedSukuCadang = computed(() =>
  sukucadang.value.find((s) => s.id === selectedSukuCadangId.value),
);

// Estimasi total
const estimatedTotal = computed(() => {
  if (!selectedSukuCadang.value) return 0;
  return selectedSukuCadang.value.harga_jual * sukucadangQuantity.value;
});

const fetchSukuCadang = async () => {
  try {
    const response = await axios.get(`${API_URL}/mekanik/suku-cadang`, {
      headers: getAuthHeaders(),
    });

    const sukucadangData = response.data.data || response.data;
    sukucadang.value = Array.isArray(sukucadangData) ? sukucadangData : [];

    // Ensure we always have some data to work with
    if (sukucadang.value.length === 0) {
      // If API returns empty, keep empty (don't show test data in production)
      sukucadang.value = [];
    }
  } catch (error: any) {
    logError(error, "fetchSukuCadang");
    toast.error(handleApiError(error));
    sukucadang.value = [];
  }
};

const addSukuCadang = async () => {
  if (!selectedSukuCadangId.value) {
    toast.error("Pilih sukucadang terlebih dahulu");
    return;
  }

  if (
    sukucadangQuantity.value <= 0 ||
    !selectedSukuCadang.value ||
    sukucadangQuantity.value > selectedSukuCadang.value.jumlah_stok
  ) {
    toast.error("Jumlah tidak valid");
    return;
  }

  isAddingSukuCadang.value = true;
  try {
    await axios.post(
      `${API_URL}/mekanik/pemesanan/${props.pemesananId}/tambah-suku-cadang`,
      {
        id_suku_cadang: selectedSukuCadangId.value,
        jumlah: sukucadangQuantity.value,
      },
      { headers: getAuthHeaders() },
    );

    toast.success("SukuCadang berhasil ditambahkan");
    emit("success");

    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch (error: any) {
    logError(error, "addSukuCadang");
    toast.error(handleApiError(error));
  } finally {
    isAddingSukuCadang.value = false;
  }
};

const closeModal = () => {
  selectedSukuCadangId.value = null;
  sukucadangQuantity.value = 1;
  emit("close");
};

// Watch for modal open and fetch sukucadang
watch(
  () => props.show,
  async (newShow) => {
    if (newShow) {
      await fetchSukuCadang();
    }
  },
  { immediate: false },
);

// Also fetch on component mount as backup
onMounted(() => {
  fetchSukuCadang();
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

      <!-- Konten -->
      <div class="p-6 space-y-5">
        <!-- Pemilih Suku Cadang -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Suku Cadang
          </label>
          <CustomSelect
            v-model="selectedSukuCadangId"
            :options="sukucadangOptions"
            placeholder="-- Pilih Suku Cadang --"
          />
        </div>

        <!-- Quantity Input -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Jumlah
          </label>
          <input
            v-model.number="sukucadangQuantity"
            type="number"
            min="1"
            :max="selectedSukuCadang?.jumlah_stok"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-gray-50"
          />
          <p v-if="selectedSukuCadang" class="text-xs text-gray-500 mt-1">
            Maksimal: {{ selectedSukuCadang.jumlah_stok }}
          </p>
        </div>

        <!-- Preview Harga -->
        <div
          v-if="selectedSukuCadang"
          class="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-100"
        >
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-700">Harga Satuan:</span>
            <span class="font-semibold text-gray-900">
              {{ toIDR(selectedSukuCadang.harga_jual) }}
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

        <!-- Tombol Aksi -->
        <div class="flex gap-3 pt-2">
          <button
            @click="closeModal"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            :disabled="isAddingSukuCadang"
          >
            Batal
          </button>
          <button
            @click="addSukuCadang"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isAddingSukuCadang || !selectedSukuCadangId"
          >
            <span
              v-if="isAddingSukuCadang"
              class="flex items-center justify-center gap-2"
            >
              <i class="mdi mdi-loading mdi-spin"></i>
              Menambahkan...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              Tambahkan
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
