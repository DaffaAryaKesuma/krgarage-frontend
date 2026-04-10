<script setup lang="ts">
import CustomerHistoryCard from "./CustomerHistoryCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  total_harga: number | null;
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
  item_pemesanan?: Array<{
    id: number;
    suku_cadang: { nama_suku_cadang: string; kategori: string };
    jumlah: number;
    harga_saat_ini: number;
  }>;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Props {
  bookings: Booking[];
  isLoading?: boolean;
  pagination: PaginationData;
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <CustomerHistoryCard
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
