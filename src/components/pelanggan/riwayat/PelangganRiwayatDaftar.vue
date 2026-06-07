<script setup lang="ts">
// Kartu untuk menampilkan satu item riwayat.
import PelangganRiwayatKartu from "./PelangganRiwayatKartu.vue";
// Komponen umum untuk loading, data kosong, dan pagination.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
// Tipe data pemesanan pelanggan dan metadata pagination API.
import type { PelangganPemesanan } from "@/types/pemesanan";
import type { ApiPagination } from "@/types/pagination";

// Props menerima daftar pemesanan, status loading, pagination, dan id yang sedang dibatalkan.
interface Props {
  pemesanan: PelangganPemesanan[];
  isLoading?: boolean;
  pagination: ApiPagination;
  cancellingId?: number | null;
}

// Default menjaga komponen tetap aman jika props opsional tidak dikirim.
withDefaults(defineProps<Props>(), {
  isLoading: false,
  cancellingId: null,
});

// Event cancel dan pageChange diteruskan ke parent.
const emit = defineEmits<{
  cancel: [pemesananId: number];
  pageChange: [page: number];
}>();

// Mengirim id pemesanan yang ingin dibatalkan.
const handleCancel = (pemesananId: number) => {
  emit("cancel", pemesananId);
};

// Mengirim nomor halaman baru saat pagination diklik.
const handlePageChange = (page: number) => {
  emit("pageChange", page);
};
</script>

<template>
  <!-- Loading saat data riwayat sedang diambil dari API. -->
  <LoadingSpinner v-if="isLoading" message="Memuat data..." />

  <!-- Empty state saat filter bulan/tahun tidak punya data. -->
  <EmptyState
    v-else-if="pemesanan.length === 0"
    icon="mdi mdi-history"
    title="Belum Ada Riwayat"
    message="Tidak ada riwayat servis untuk bulan dan tahun yang dipilih. Yuk pesan sekarang untuk servis Vespa Anda!"
    aksi-text="Pesan Sekarang"
    aksi-link="/app/pemesanan"
  />

  <template v-else>
    <!-- Grid kartu riwayat. -->
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PelangganRiwayatKartu
        v-for="item in pemesanan"
        :key="item.id"
        :pemesanan="item"
        :is-cancelling="cancellingId === item.id"
        @cancel="handleCancel"
      />
    </div>

    <!-- Pagination mengikuti metadata dari API. -->
    <Pagination
      :current-page="pagination.current_page"
      :last-page="pagination.last_page"
      :total="pagination.total"
      :per-page="pagination.per_page"
      :from="pagination.from"
      :to="pagination.to"
      @page-change="handlePageChange"
    />
  </template>
</template>
