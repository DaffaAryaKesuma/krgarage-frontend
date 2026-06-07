<script setup lang="ts">
// Helper format uang rupiah.
import { toIDR } from "@/utils/money";
// Helper format durasi dan gambar layanan.
import { formatWaktu, getImageUrl } from "@/utils/format";
// Helper class untuk label, alert, ikon, dan warna teks.
import {
  META_LABEL_CLASS,
  getAlertBoxClass,
  getIconToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
// Helper class untuk kartu pilihan dan tanda centang.
import {
  getSelectionCardClass,
  getSelectionCheckClass,
} from "@/utils/selectionVariants";
// Class error form dipakai jika layanan belum dipilih.
import { FORM_ERROR_CLASS } from "@/utils/formVariants";
// Tipe item layanan yang berasal dari katalog layanan.
import type { LayananCatalogItem } from "@/types/layanan";

// Props menerima katalog layanan, pilihan id layanan, dan pesan validasi.
interface Props {
  layanan: LayananCatalogItem[];
  modelValue: number[];
  error?: string;
  touched?: boolean;
}

// Event update:modelValue membuat pilihan layanan bisa memakai v-model.
interface Emits {
  (e: "update:modelValue", value: number[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Menambah atau menghapus id layanan dari array pilihan.
const toggleLayanan = (id: number) => {
  // Salin array agar tidak mengubah props secara langsung.
  const selectedIds = [...props.modelValue];
  const idx = selectedIds.indexOf(id);

  if (idx === -1) {
    selectedIds.push(id);
  } else {
    selectedIds.splice(idx, 1);
  }

  // Kirim array terbaru ke parent.
  emit("update:modelValue", selectedIds);
};
</script>

<template>
  <!-- Kartu utama step pilih layanan. -->
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <!-- Header step. -->
    <div class="flex items-center gap-3 mb-6">
      <div
        :class="[
          getIconToneClass('primary'),
          'flex h-10 w-10 items-center justify-center rounded-full',
        ]"
      >
        <i class="mdi mdi-wrench text-xl"></i>
      </div>
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900">
          Pilih Layanan
        </h2>
        <p class="text-sm text-gray-500">
          Pilih satu atau lebih layanan yang Anda butuhkan
        </p>
      </div>
    </div>

    <!-- Grid katalog layanan yang bisa dipilih lebih dari satu. -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in layanan"
        :key="item.id"
        @click="toggleLayanan(item.id)"
        :class="
          getSelectionCardClass({
            selected: modelValue.includes(item.id),
            tone: 'success',
            extraClass:
              'group relative overflow-hidden rounded-xl duration-200 hover:shadow-md',
          })
        "
      >
        <!-- Gambar layanan, fallback dipakai jika gambar gagal dimuat. -->
        <div class="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            :src="getImageUrl(item.gambar)"
            :alt="item.nama_layanan"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            @error="
              (e: Event) =>
                ((e.target as HTMLImageElement).src =
                  'https://placehold.co/600x400?text=Tidak+Ada+Gambar')
            "
          />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"
          ></div>
        </div>

        <!-- Konten detail layanan. -->
        <div class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <i class="mdi mdi-wrench"></i>
            <h3 class="font-bold text-sm">
              {{ item.nama_layanan }}
            </h3>
          </div>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            {{ item.deskripsi }}
          </p>

          <!-- Info harga dan durasi layanan. -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div :class="[getAlertBoxClass('info'), 'rounded p-2 shadow-none']">
              <p :class="META_LABEL_CLASS">Harga</p>
              <p class="text-sm font-bold" :class="getToneTextClass('info')">
                {{ toIDR(item.harga) }}
              </p>
            </div>
            <div
              :class="[getAlertBoxClass('success'), 'rounded p-2 shadow-none']"
            >
              <p :class="META_LABEL_CLASS">Durasi</p>
              <p class="text-sm font-bold" :class="getToneTextClass('success')">
                {{ formatWaktu(item.durasi_pengerjaan) }}
              </p>
            </div>
          </div>

          <!-- Checkmark pilihan layanan. -->
          <div
            class="flex items-center justify-between pt-2 border-t border-gray-200"
          >
            <span class="text-xs font-semibold text-gray-700"
              >Pilih layanan</span
            >
            <div
              :class="
                getSelectionCheckClass('success', modelValue.includes(item.id))
              "
            >
              <i
                v-if="modelValue.includes(item.id)"
                class="mdi mdi-check text-white text-sm"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error tampil jika belum ada layanan dipilih. -->
    <p v-if="error && touched" :class="[FORM_ERROR_CLASS, 'mt-4']">
      <i class="mdi mdi-alert-circle"></i>{{ error }}
    </p>
  </div>
</template>
