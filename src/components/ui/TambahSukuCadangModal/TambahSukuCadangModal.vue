<script setup lang="ts">
// Format harga suku cadang ke Rupiah.
import { toIDR } from "@/utils/money";
// Helper class tombol.
import {
  getButtonClass,
  getFullWidthButtonClass,
  getIconButtonClass,
} from "@/utils/buttonVariants";
// Helper gradient header.
import { getGradientToneClass } from "@/utils/badgeVariants";
// Helper input dengan icon.
import { getFormInputWithIconClass } from "@/utils/formVariants";
import type { SukuCadangRingkasan } from "@/types/inventaris";
// Komponen state loading/kosong.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
// Logic modal dipisah ke composable.
import { useTambahSukuCadangModal } from "@/components/ui/TambahSukuCadangModal/useTambahSukuCadangModal";

// Props modal: show, list suku cadang, dan state loading/submitting.
const props = withDefaults(
  defineProps<{
    show: boolean;
    sukuCadang: SukuCadangRingkasan[];
    isLoading?: boolean;
    isSubmitting?: boolean;
  }>(),
  { isLoading: false, isSubmitting: false },
);

// Event close dan submit dikirim ke parent.
const emit = defineEmits<{
  close: [];
  submit: [items: { sukucadangId: number; quantity: number }[]];
}>();

// Ambil state dan aksi dari composable.
const {
  searchQuery,
  keranjang,
  activeCardId,
  activeQuantity,
  filteredSukuCadang,
  grandTotal,
  getStokBadge,
  selectCard,
  decrementQty,
  incrementQty,
  tambahKeKeranjang,
  hapusDariKeranjang,
  handleSubmit,
  handleClose,
} = useTambahSukuCadangModal(props, emit);
</script>

<template>
  <!-- Overlay modal tambah suku cadang. -->
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <!-- Card modal utama. -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
      style="max-height: 92vh"
    >
      <!-- Header modal. -->
      <div
        :class="[
          'bg-gradient-to-br px-5 py-4 rounded-t-2xl flex items-center justify-between shrink-0',
          getGradientToneClass('primary'),
        ]"
      >
        <div>
          <h3 class="text-xl font-bold text-white">Tambah Suku Cadang</h3>
          <p class="text-white/80 font-medium text-sm mt-0.5">
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

      <!-- Body modal berisi search, grid item, dan keranjang. -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- Search bar untuk filter nama/kategori. -->
        <div class="px-4 pt-4 pb-2 shrink-0">
          <div class="relative">
            <i
              class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau kategori suku cadang..."
              :class="getFormInputWithIconClass(false, 'rounded-xl bg-gray-50 pl-9')"
            />
          </div>
        </div>

        <!-- Grid/list suku cadang. -->
        <div class="flex-1 overflow-y-auto px-4 pb-2 custom-scrollbar">
          <!-- Loading saat daftar suku cadang belum siap. -->
          <LoadingSpinner
            v-if="isLoading"
            message="Memuat suku cadang..."
          />

          <!-- Empty state saat tidak ada hasil/filter kosong. -->
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

          <!-- Grid item suku cadang. -->
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
                  'mb-2 gap-1.5 py-0.5',
                  getStokBadge(sukuCadang).class,
                ]"
              >
                <i class="mdi mdi-package text-xs"></i>
                {{ getStokBadge(sukuCadang).label }}
              </span>

              <p class="text-base font-bold">
                {{ toIDR(sukuCadang.harga_jual) }}
              </p>

              <!-- Quantity stepper muncul saat card sedang aktif. -->
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
                  :class="getFullWidthButtonClass('primary', 'sm', 'gap-1 font-bold')"
                >
                  <i class="mdi mdi-cart-plus text-base"></i>
                  Tambah ke Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Keranjang item terpilih. -->
        <div class="shrink-0 border-t border-gray-100 px-4 pt-3 pb-1">
          <!-- List keranjang jika ada item. -->
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
                    :class="getIconButtonClass('subtle', 'sm')"
                  >
                    <i class="mdi mdi-close-circle text-base"></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200"
            >
              <!-- Total semua item keranjang. -->
              <span class="font-bold">Total</span>
              <span class="font-bold">{{
                toIDR(grandTotal)
              }}</span>
            </div>
          </div>
          <!-- Hint jika keranjang masih kosong. -->
          <div v-else class="text-center py-2 text-gray-400">
            <p class="text-xs">Pilih suku cadang di atas untuk ditambahkan</p>
          </div>
        </div>
      </div>

      <!-- Footer tombol batal dan submit. -->
      <div class="px-4 py-3 flex gap-3 border-t border-gray-100 shrink-0">
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          :class="getButtonClass('secondary', 'md', 'flex-1 rounded-xl border-2 border-gray-200')"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting || keranjang.length === 0"
          :class="getButtonClass('primary', 'md', 'flex-1 rounded-xl font-bold')"
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
