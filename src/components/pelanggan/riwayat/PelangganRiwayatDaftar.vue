<script setup lang="ts">
import PelangganRiwayatKartu from "./PelangganRiwayatKartu.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import type { PelangganPemesanan } from "@/types/pemesanan";
import type { ApiPagination } from "@/types/pagination";

interface Props {
  pemesanan: PelangganPemesanan[];
  isLoading?: boolean;
  pagination: ApiPagination;
  cancellingId?: number | null;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  cancellingId: null,
});

const emit = defineEmits<{
  cancel: [pemesananId: number];
  pageChange: [page: number];
}>();

const handleCancel = (pemesananId: number) => {
  emit("cancel", pemesananId);
};

const handlePageChange = (page: number) => {
  emit("pageChange", page);
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" message="Memuat data..." />

  <EmptyState
    v-else-if="pemesanan.length === 0"
    icon="mdi mdi-history"
    title="Belum Ada Riwayat"
    message="Tidak ada riwayat servis untuk bulan dan tahun yang dipilih. Yuk pesan sekarang untuk servis Vespa Anda!"
    aksi-text="Pesan Sekarang"
    aksi-link="/app/pemesanan"
  />

  <template v-else>
    <!-- Kartu Grid -->
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PelangganRiwayatKartu
        v-for="item in pemesanan"
        :key="item.id"
        :pemesanan="item"
        :is-cancelling="cancellingId === item.id"
        @cancel="handleCancel"
      />
    </div>

    <!-- Pagination -->
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
