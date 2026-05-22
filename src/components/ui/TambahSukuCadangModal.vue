<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { toIDR } from "@/utils/money";
import type { SukuCadangRingkasan } from "@/types/inventaris";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

import { scrollLock } from "@/composables/scrollLock";

interface KeranjangItem {
  sukucadang: SukuCadangRingkasan;
  quantity: number;
}

interface Props {
  show: boolean;
  sukuCadang: SukuCadangRingkasan[];
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isSubmitting: false,
});

const emit = defineEmits<{
  close: [];
  submit: [items: { sukucadangId: number; quantity: number }[]];
}>();

const searchQuery = ref("");
const keranjang = ref<KeranjangItem[]>([]);
const activeCardId = ref<number | null>(null);
const activeQuantity = ref(1);

scrollLock(() => props.show);

// Reset saat modal dibuka/ditutup
watch(
  () => props.show,
  (val) => {
    if (val) {
      searchQuery.value = "";
      keranjang.value = [];
      activeCardId.value = null;
      activeQuantity.value = 1;
    }
  }
);

const idSudahDiKeranjang = computed(
  () => new Set(keranjang.value.map((item) => item.sukucadang.id)),
);

const filteredSukuCadang = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  return props.sukuCadang.filter(
    (sukuCadang) =>
      !idSudahDiKeranjang.value.has(sukuCadang.id) &&
      (sukuCadang.nama_suku_cadang.toLowerCase().includes(query) ||
        (sukuCadang.kategori || "").toLowerCase().includes(query)),
  );
});

const grandTotal = computed(() =>
  keranjang.value.reduce(
    (sum, item) => sum + item.sukucadang.harga_jual * item.quantity,
    0,
  ),
);

const getStokBadge = (sukuCadang: SukuCadangRingkasan) => {
  if (sukuCadang.jumlah_stok === 0)
    return { label: "Habis", class: "bg-red-100 text-red-700" };
  if (sukuCadang.stok_menipis)
    return {
      label: `Kritis: ${sukuCadang.jumlah_stok}`,
      class: "bg-orange-100 text-orange-700",
    };
  return {
    label: `Stok: ${sukuCadang.jumlah_stok}`,
    class: "bg-green-100 text-green-700",
  };
};

const selectCard = (sukuCadang: SukuCadangRingkasan) => {
  if (activeCardId.value === sukuCadang.id) {
    activeCardId.value = null;
    activeQuantity.value = 1;
  } else {
    activeCardId.value = sukuCadang.id;
    activeQuantity.value = 1;
  }
};

const decrementQty = () => {
  if (activeQuantity.value > 1) activeQuantity.value--;
};

const incrementQty = (max: number) => {
  if (activeQuantity.value < max) activeQuantity.value++;
};

const tambahKeKeranjang = (sukuCadang: SukuCadangRingkasan) => {
  keranjang.value.push({
    sukucadang: sukuCadang,
    quantity: activeQuantity.value,
  });
  activeCardId.value = null;
  activeQuantity.value = 1;
};

const hapusDariKeranjang = (index: number) => {
  keranjang.value.splice(index, 1);
};

const handleSubmit = () => {
  if (!keranjang.value.length) return;
  emit(
    "submit",
    keranjang.value.map((item) => ({
      sukucadangId: item.sukucadang.id,
      quantity: item.quantity,
    })),
  );
};

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
      style="max-height: 92vh"
    >
      <!-- Header -->
      <div
        class="bg-red-600 px-5 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
      >
        <div>
          <h3 class="text-xl font-bold text-white">Tambah Suku Cadang</h3>
          <p class="text-red-200 font-medium text-sm mt-0.5">
            Pilih item lalu tentukan jumlah
          </p>
        </div>
        <button
          @click="handleClose"
          class="text-white/70 hover:text-white transition rounded-full p-1"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- Search Bar -->
        <div class="px-4 pt-4 pb-2 shrink-0">
          <div class="relative">
            <i
              class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau kategori suku cadang..."
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-gray-300"
            />
          </div>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto px-4 pb-2 custom-scrollbar">
          <!-- Loading -->
          <LoadingSpinner
            v-if="isLoading"
            message="Memuat suku cadang..."
          />

          <!-- Empty -->
          <EmptyState
            v-else-if="filteredSukuCadang.length === 0"
            icon="mdi mdi-package-variant"
            :title="searchQuery ? 'Tidak Ada Hasil' : 'Suku Cadang Kosong'"
            :message="
              searchQuery
                ? 'Tidak ada suku cadang yang cocok dengan kata kunci pencarian Anda.'
                : 'Semua suku cadang sudah dimasukkan ke keranjang.'
            "
          />

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
            <div
              v-for="sukuCadang in filteredSukuCadang"
              :key="sukuCadang.id"
              @click="sukuCadang.jumlah_stok > 0 && selectCard(sukuCadang)"
              :class="[
                'rounded-xl border-2 p-3 transition-all cursor-pointer select-none',
                sukuCadang.jumlah_stok === 0
                  ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                  : activeCardId === sukuCadang.id
                    ? 'border-gray-300 bg-gray-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm',
              ]"
            >
              <div class="mb-2">
                <p
                  class="font-bold text-gray-900 text-base leading-tight line-clamp-2"
                >
                  {{ sukuCadang.nama_suku_cadang }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ sukuCadang.kategori }}
                </p>
              </div>

              <span
                :class="[
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2',
                  getStokBadge(sukuCadang).class,
                ]"
              >
                <i class="mdi mdi-package text-xs"></i>
                {{ getStokBadge(sukuCadang).label }}
              </span>

              <p class="text-base font-bold">
                {{ toIDR(sukuCadang.harga_jual) }}
              </p>

              <!-- Quantity Stepper (muncul saat dipilih) -->
              <div
                v-if="activeCardId === sukuCadang.id"
                class="mt-3 space-y-2"
                @click.stop
              >
                <div class="flex items-center justify-between gap-2">
                  <div
                    class="flex items-center border border-gray-300 rounded-lg overflow-hidden"
                  >
                    <button
                      @click="decrementQty"
                      class="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold text-base"
                    >
                      −
                    </button>
                    <input
                      v-model.number="activeQuantity"
                      type="number"
                      min="1"
                      :max="sukuCadang.jumlah_stok"
                      readonly
                      class="w-12 text-center text-base font-bold border-x border-gray-300 py-1.5 focus:outline-none no-spinners cursor-default"
                    />
                    <button
                      @click="incrementQty(sukuCadang.jumlah_stok)"
                      class="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  @click="tambahKeKeranjang(sukuCadang)"
                  class="w-full py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1"
                >
                  <i class="mdi mdi-cart-plus text-base"></i>
                  Tambah ke Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Keranjang -->
        <div class="shrink-0 border-t border-gray-100 px-4 pt-3 pb-1">
          <div v-if="keranjang.length > 0">
            <p
              class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
            >
              Keranjang ({{ keranjang.length }} item)
            </p>
            <div class="space-y-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(item, index) in keranjang"
                :key="item.sukucadang.id"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-900 truncate">
                    {{ item.sukucadang.nama_suku_cadang }}
                  </p>
                  <p class="text-xs text-gray-500">
                    x{{ item.quantity }} ×
                    {{ toIDR(item.sukucadang.harga_jual) }}
                  </p>
                </div>
                <div class="flex items-center gap-2 ml-2 shrink-0">
                  <span class="text-xs font-bold">
                    {{ toIDR(item.sukucadang.harga_jual * item.quantity) }}
                  </span>
                  <button
                    @click="hapusDariKeranjang(index)"
                    class="text-gray-300 hover:text-red-500 transition"
                  >
                    <i class="mdi mdi-close-circle text-base"></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200"
            >
              <span class="font-bold">Total</span>
              <span class="font-bold">{{
                toIDR(grandTotal)
              }}</span>
            </div>
          </div>
          <div v-else class="text-center py-2 text-gray-400">
            <p class="text-xs">Pilih suku cadang di atas untuk ditambahkan</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 flex gap-3 border-t border-gray-100 shrink-0">
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          class="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting || keranjang.length === 0"
          class="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          <i v-if="isSubmitting" class="mdi mdi-loading mdi-spin"></i>
          {{
            isSubmitting ? "Menyimpan..." : `Tambahkan ${keranjang.length} Item`
          }}
        </button>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.no-spinners {
  -moz-appearance: textfield;
  appearance: textfield;
}
.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
