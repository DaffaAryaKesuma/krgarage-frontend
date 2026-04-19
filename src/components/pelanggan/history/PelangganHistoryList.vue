<script setup lang="ts">
import PelangganHistoryCard from "./PelangganHistoryCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import type { PelangganBooking } from "@/types/booking";
import type { ApiPagination } from "@/types/pagination";

interface Props {
  bookings: PelangganBooking[];
  isLoading?: boolean;
  pagination: ApiPagination;
  cancellingId?: number | null;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  cancellingId: null,
});

const emit = defineEmits<{
  cancel: [bookingId: number];
  pageChange: [page: number];
}>();

const handleCancel = (bookingId: number) => {
  emit("cancel", bookingId);
};

const handlePageChange = (page: number) => {
  emit("pageChange", page);
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" message="Memuat data..." />

  <EmptyState
    v-else-if="bookings.length === 0"
    icon="mdi mdi-history"
    title="Belum Ada Riwayat"
    message="Tidak ada riwayat servis untuk bulan dan tahun yang dipilih. Yuk pesan sekarang untuk servis Vespa Anda!"
    action-text="Pesan Sekarang"
    action-link="/app/pemesanan"
  />

  <template v-else>
    <!-- Card Grid -->
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PelangganHistoryCard
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
        :is-cancelling="cancellingId === booking.id"
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
