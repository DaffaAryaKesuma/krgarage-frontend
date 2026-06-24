<script setup lang="ts">
import { computed, ref } from "vue";
// Empty state, pagination, dan table shell reusable.
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import TableShell from "@/components/ui/TableShell.vue";
// Helper format tanggal, nama, dan rupiah.
import { formatDateShort } from "@/utils/date";
import { formatNama, getImageUrl } from "@/utils/format";
import { toIDR } from "@/utils/money";
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
import { scrollLock } from "@/composables/scrollLock";
// Class label kecil.
import { META_LABEL_CLASS } from "@/utils/badgeVariants";
// Helper class tabel.
import {
  TABLE_BODY_CLASS,
  TABLE_COMFORTABLE_HEADER_CELL_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_MOBILE_CARD_CLASS,
  TABLE_MOBILE_CARD_GRID_CLASS,
  TABLE_MOBILE_CARD_HEADER_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
  TABLE_WRAPPER_CLASS,
  buildFixedTableClass,
} from "@/utils/tableVariants";
// Header tabel dan composable pagination.
import {
  TABLE_HEADERS,
  usePemilikKeuanganPengeluaranRestokTable,
  type PemilikKeuanganPengeluaranRestokTableProps,
} from "./usePemilikKeuanganPengeluaranRestokTable";
import type { RiwayatRestokSukuCadang } from "@/types/inventaris";

// Event update currentPage dikirim saat pagination berubah.
interface Emits {
  (e: "update:currentPage", value: number): void;
}

// Props mengikuti interface dari composable.
const props = defineProps<PemilikKeuanganPengeluaranRestokTableProps>();
const emit = defineEmits<Emits>();

// Ambil nilai pagination dari composable.
const { totalPages, from, to, paginatedPengeluaran } =
  usePemilikKeuanganPengeluaranRestokTable(props);

// Lebar kolom desktop.
const TABLE_COLUMN_WIDTHS = [
  "18%",
  "20%",
  "9%",
  "14%",
  "14%",
  "11%",
  "10%",
  "10%",
];
// Class cell umum.
const TABLE_CELL_CLASS = "px-6 py-4 align-middle text-sm text-gray-900";
// Class cell total pengeluaran dibuat menonjol.
const TABLE_TOTAL_CELL_CLASS =
  "px-6 py-4 align-middle text-sm font-semibold text-red-600";
const RECEIPT_BUTTON_CLASS = getButtonClass("infoOutline", "xs", "h-8");

const selectedReceiptUrl = ref<string | null>(null);
const receiptLoadFailed = ref(false);

// Kunci halaman belakang selama modal struk terbuka.
scrollLock(() => selectedReceiptUrl.value !== null);

const selectedReceiptImage = computed(() =>
  selectedReceiptUrl.value ? getImageUrl(selectedReceiptUrl.value) : "",
);
const selectedReceiptIsHeic = computed(() =>
  /\.(heic|heif)(?:$|[?#])/i.test(selectedReceiptUrl.value ?? ""),
);

const getReceiptSource = (item: RiwayatRestokSukuCadang) => {
  if (item.foto_struk_url) {
    return item.foto_struk_url;
  }

  if (item.foto_struk && item.foto_struk_tersedia !== false) {
    return item.foto_struk;
  }

  return "";
};

const openReceiptModal = (url: string) => {
  selectedReceiptUrl.value = url;
  receiptLoadFailed.value = false;
};

const closeReceiptModal = () => {
  selectedReceiptUrl.value = null;
  receiptLoadFailed.value = false;
};
</script>

<template>
  <!-- Kartu tabel pengeluaran restok. -->
  <div class="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">
    <!-- Header section. -->
    <div class="mb-6">
      <h2 class="flex items-center gap-2 text-xl font-bold text-gray-900">
        <i class="mdi mdi-package-up text-red-600"></i>
        Pengeluaran Restock
      </h2>
    </div>

    <!-- TableShell menangani tampilan desktop dan mobile. -->
    <TableShell
      v-if="pengeluaran.length > 0"
      :headers="TABLE_HEADERS"
      :responsive-kartu="true"
      desktop-breakpoint="lg"
      :mobile-kartu-class="TABLE_MOBILE_KARTU_CLASS"
      :wrapper-class="TABLE_WRAPPER_CLASS"
      :table-class="buildFixedTableClass('text-sm')"
      :head-class="TABLE_HEAD_CLASS"
      header-row-class="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
      :header-cell-class="TABLE_COMFORTABLE_HEADER_CELL_CLASS"
      :body-class="TABLE_BODY_CLASS"
      :column-widths="TABLE_COLUMN_WIDTHS"
    >
      <!-- Tampilan kartu mobile untuk pengeluaran restok. -->
      <template #mobile>
        <div
          v-for="item in paginatedPengeluaran"
          :key="`mobile-restok-${item.id}`"
          :class="TABLE_MOBILE_CARD_CLASS"
        >
          <!-- Header kartu mobile: nama suku cadang, tanggal, dan total. -->
          <div :class="TABLE_MOBILE_CARD_HEADER_CLASS">
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ item.suku_cadang?.nama_suku_cadang || "Suku Cadang" }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDateShort(item.created_at) }}
              </p>
            </div>
            <p class="text-sm font-bold text-red-600">
              {{ toIDR(item.total_pengeluaran) }}
            </p>
          </div>

          <!-- Detail restok pada kartu mobile. -->
          <div :class="TABLE_MOBILE_CARD_GRID_CLASS">
            <div>
              <p :class="META_LABEL_CLASS">Jumlah</p>
              <p class="font-medium text-gray-900">{{ item.jumlah }}</p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">Harga/Unit</p>
              <p class="font-medium text-gray-900">
                {{ toIDR(item.harga_beli_satuan) }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">Stok</p>
              <!-- Perubahan stok sebelum dan sesudah restok. -->
              <p class="font-medium text-gray-900">
                {{ item.stok_sebelum }} -> {{ item.stok_sesudah }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">Admin</p>
              <p class="font-medium text-gray-900">
                {{ formatNama(item.admin?.nama || "-") }}
              </p>
            </div>
            <div>
              <p :class="META_LABEL_CLASS">Struk</p>
              <button
                v-if="getReceiptSource(item)"
                type="button"
                :class="RECEIPT_BUTTON_CLASS"
                @click="openReceiptModal(getReceiptSource(item))"
              >
                Lihat
              </button>
              <p v-else-if="item.foto_struk" class="font-medium text-gray-500">
                File tidak tersedia
              </p>
              <p v-else class="font-medium text-gray-500">-</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Tampilan baris tabel desktop. -->
      <tr
        v-for="item in paginatedPengeluaran"
        :key="item.id"
        class="transition-colors hover:bg-gray-50"
      >
        <td :class="TABLE_CELL_CLASS">
          {{ formatDateShort(item.created_at) }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ item.suku_cadang?.nama_suku_cadang || "Suku Cadang" }}
        </td>
        <td :class="TABLE_CELL_CLASS">{{ item.jumlah }}</td>
        <td :class="TABLE_CELL_CLASS">
          {{ toIDR(item.harga_beli_satuan) }}
        </td>
        <td :class="TABLE_TOTAL_CELL_CLASS">
          {{ toIDR(item.total_pengeluaran) }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ item.stok_sebelum }} -> {{ item.stok_sesudah }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          {{ formatNama(item.admin?.nama || "-") }}
        </td>
        <td :class="TABLE_CELL_CLASS">
          <button
            v-if="getReceiptSource(item)"
            type="button"
            :class="RECEIPT_BUTTON_CLASS"
            @click="openReceiptModal(getReceiptSource(item))"
          >
            Lihat
          </button>
          <span v-else-if="item.foto_struk" class="text-gray-500">
            File tidak tersedia
          </span>
          <span v-else class="text-gray-500">-</span>
        </td>
      </tr>

      <!-- Pagination tabel pengeluaran. -->
      <template #footer>
        <div class="px-4 pb-3 sm:px-6">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="pengeluaran.length"
            :per-page="itemsPerPage"
            :from="from"
            :to="to"
            @page-change="emit('update:currentPage', $event)"
          />
        </div>
      </template>
    </TableShell>

    <!-- Empty state jika tidak ada pengeluaran restok pada periode filter. -->
    <EmptyState
      v-else
      icon="mdi mdi-package-search"
      title="Tidak ada pengeluaran restok"
      :message="`Tidak ada restok dari ${formatDateShort(startDate)} sampai ${formatDateShort(endDate)}.`"
      class="py-12"
    />

    <div
      v-if="selectedReceiptUrl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      @click.self="closeReceiptModal"
    >
      <div
        class="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4"
        >
          <h3 class="text-base font-bold text-gray-900">Foto Struk Restok</h3>
          <button
            type="button"
            :class="getIconButtonClass('neutral', 'md', 'rounded-full')"
            @click="closeReceiptModal"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>
        <div class="max-h-[calc(90vh-4.5rem)] overflow-auto bg-gray-100 p-4">
          <div
            v-if="selectedReceiptIsHeic"
            class="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center"
          >
            <i class="mdi mdi-file-image-outline mb-2 text-4xl text-blue-500"></i>
            <p class="text-sm font-semibold text-gray-800">
              Struk menggunakan format HEIC/HEIF
            </p>
            <p class="mt-1 max-w-md text-xs text-gray-500">
              Sebagian browser tidak dapat menampilkan format ini secara langsung.
            </p>
            <a
              :href="selectedReceiptImage"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <i class="mdi mdi-open-in-new"></i>
              Buka atau Unduh Struk
            </a>
          </div>
          <div
            v-else-if="receiptLoadFailed"
            class="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-gray-600"
          >
            <i class="mdi mdi-image-off-outline mb-2 text-4xl text-gray-400"></i>
            <p class="text-sm font-semibold text-gray-800">
              Foto struk tidak tersedia
            </p>
            <p class="mt-1 max-w-sm text-xs">
              File struk lama kemungkinan tidak ada di storage server production.
            </p>
          </div>
          <img
            v-else
            :src="selectedReceiptImage"
            alt="Foto struk restok"
            class="mx-auto max-h-[calc(90vh-7rem)] max-w-full rounded-xl object-contain shadow-sm"
            @error="receiptLoadFailed = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
