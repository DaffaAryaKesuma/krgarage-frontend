<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { toIDR } from "@/utils/money";
import type { SukuCadangRingkasan } from "@/types/inventaris";

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
  },
);

const idSudahDiKeranjang = computed(
  () => new Set(keranjang.value.map((k) => k.sukucadang.id)),
);

const filteredSukuCadang = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return props.sukuCadang.filter(
    (sc) =>
      !idSudahDiKeranjang.value.has(sc.id) &&
      (sc.nama_suku_cadang.toLowerCase().includes(q) ||
        (sc.kategori || "").toLowerCase().includes(q)),
  );
});

const grandTotal = computed(() =>
  keranjang.value.reduce(
    (sum, item) => sum + item.sukucadang.harga_jual * item.quantity,
    0,
  ),
);

const getStokBadge = (sc: SukuCadangRingkasan) => {
  if (sc.jumlah_stok === 0)
    return { label: "Habis", class: "bg-red-100 text-red-700" };
  if (sc.stok_menipis)
    return {
      label: `Kritis: ${sc.jumlah_stok}`,
      class: "bg-orange-100 text-orange-700",
    };
  return {
    label: `Stok: ${sc.jumlah_stok}`,
    class: "bg-green-100 text-green-700",
  };
};

const selectCard = (sc: SukuCadangRingkasan) => {
  if (activeCardId.value === sc.id) {
    activeCardId.value = null;
    activeQuantity.value = 1;
  } else {
    activeCardId.value = sc.id;
    activeQuantity.value = 1;
  }
};

const decrementQty = () => {
  if (activeQuantity.value > 1) activeQuantity.value--;
};

const incrementQty = (max: number) => {
  if (activeQuantity.value < max) activeQuantity.value++;
};

const tambahKeKeranjang = (sc: SukuCadangRingkasan) => {
  keranjang.value.push({ sukucadang: sc, quantity: activeQuantity.value });
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
    keranjang.value.map((k) => ({
      sukucadangId: k.sukucadang.id,
      quantity: k.quantity,
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
        class="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
      >
        <div>
          <h3 class="text-lg font-bold text-white">Tambah Suku Cadang</h3>
          <p class="text-red-200 text-xs mt-0.5">
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
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition"
            />
          </div>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto px-4 pb-2">
          <!-- Loading -->
          <div
            v-if="isLoading"
            class="flex items-center justify-center py-12 gap-2 text-gray-400"
          >
            <i class="mdi mdi-loading mdi-spin text-2xl text-red-500"></i>
            <span class="text-sm">Memuat suku cadang...</span>
          </div>

          <!-- Empty -->
          <div
            v-else-if="filteredSukuCadang.length === 0"
            class="text-center py-10 text-gray-400"
          >
            <i class="mdi mdi-package-variant text-4xl"></i>
            <p class="text-sm mt-1">
              {{
                searchQuery
                  ? "Tidak ada hasil untuk pencarian ini"
                  : "Semua suku cadang sudah di keranjang"
              }}
            </p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 gap-3 py-1">
            <div
              v-for="sc in filteredSukuCadang"
              :key="sc.id"
              @click="sc.jumlah_stok > 0 && selectCard(sc)"
              :class="[
                'rounded-xl border-2 p-3 transition-all cursor-pointer select-none',
                sc.jumlah_stok === 0
                  ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                  : activeCardId === sc.id
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-sm',
              ]"
            >
              <div class="mb-2">
                <p class="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                  {{ sc.nama_suku_cadang }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">{{ sc.kategori }}</p>
              </div>

              <span
                :class="[
                  'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2',
                  getStokBadge(sc).class,
                ]"
              >
                <i class="mdi mdi-package text-[10px]"></i>
                {{ getStokBadge(sc).label }}
              </span>

              <p class="text-sm font-black text-red-600">
                {{ toIDR(sc.harga_jual) }}
              </p>

              <!-- Quantity Stepper (muncul saat dipilih) -->
              <div
                v-if="activeCardId === sc.id"
                class="mt-3 space-y-2"
                @click.stop
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      @click="decrementQty"
                      class="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition font-bold text-base"
                    >
                      −
                    </button>
                    <input
                      v-model.number="activeQuantity"
                      type="number"
                      min="1"
                      :max="sc.jumlah_stok"
                      class="w-10 text-center text-sm font-bold border-x border-gray-300 py-1 focus:outline-none"
                    />
                    <button
                      @click="incrementQty(sc.jumlah_stok)"
                      class="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                  <span class="text-xs font-bold text-red-600">
                    {{ toIDR(sc.harga_jual * activeQuantity) }}
                  </span>
                </div>
                <button
                  @click="tambahKeKeranjang(sc)"
                  class="w-full py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1"
                >
                  <i class="mdi mdi-cart-plus text-sm"></i>
                  Tambah ke Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Keranjang -->
        <div class="shrink-0 border-t border-gray-100 px-4 pt-3 pb-1">
          <div v-if="keranjang.length > 0">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Keranjang ({{ keranjang.length }} item)
            </p>
            <div class="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              <div
                v-for="(item, index) in keranjang"
                :key="item.sukucadang.id"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-900 truncate">
                    {{ item.sukucadang.nama_suku_cadang }}
                  </p>
                  <p class="text-[10px] text-gray-500">
                    x{{ item.quantity }} × {{ toIDR(item.sukucadang.harga_jual) }}
                  </p>
                </div>
                <div class="flex items-center gap-2 ml-2 shrink-0">
                  <span class="text-xs font-bold text-red-600">
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
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span class="text-xs font-bold text-gray-700">Total</span>
              <span class="text-base font-black text-red-600">{{ toIDR(grandTotal) }}</span>
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
          <i v-else class="mdi mdi-check-circle"></i>
          {{ isSubmitting ? "Menyimpan..." : `Tambahkan ${keranjang.length} Item` }}
        </button>
      </div>
    </div>
  </div>
</template>
