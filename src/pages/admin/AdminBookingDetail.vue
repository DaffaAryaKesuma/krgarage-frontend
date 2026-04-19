<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminBookingInfoCards from "@/components/admin/booking-detail/AdminBookingInfoCards.vue";
import AdminBookingControlPanel from "@/components/admin/booking-detail/AdminBookingControlPanel.vue";
import AdminBookingServicesList from "@/components/admin/booking-detail/AdminBookingServicesList.vue";
import AdminBookingSparepartsList from "@/components/admin/booking-detail/AdminBookingSparepartsList.vue";
import AdminBookingTotalSummary from "@/components/admin/booking-detail/AdminBookingTotalSummary.vue";
import AdminAddSparepartModal from "@/components/admin/booking-detail/AdminAddSparepartModal.vue";
import { useAdminBookingDetailPage } from "@/composables/useAdminBookingDetailPage";

const route = useRoute();
const {
  booking,
  isLoading,
  error,
  showAddSparepartModal,
  availableSpareparts,
  isAddingSparepart,
  showDeleteConfirm,
  isInProgress,
  totalHarga,
  totalSpareparts,
  totalAkhir,
  fetchBookingData,
  openAddSparepartModal,
  closeAddSparepartModal,
  addSparepartToBooking,
  promptDeleteSparepart,
  removeSparepartFromBooking,
} = useAdminBookingDetailPage(String(route.params.id));

// Lifecycle
onMounted(async () => {
  isLoading.value = true;
  await fetchBookingData();
  isLoading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        booking
          ? `Kelola rincian lengkap untuk ${booking.kode_pemesanan}`
          : 'Kelola rincian lengkap pemesanan pelanggan'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    >
      <template #actions>
        <router-link
          to="/admin/pemesanan"
          class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white no-underline backdrop-blur-sm transition hover:bg-white/20"
        >
          <i class="mdi mdi-arrow-left"></i>
          <span class="font-medium">Kembali</span>
        </router-link>
      </template>
    </AppPageHeader>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <i class="mdi mdi-alert-circle mb-2 text-4xl text-red-600"></i>
        <p class="font-medium text-red-800">{{ error }}</p>
      </div>

      <div v-else-if="booking" class="space-y-6">
        <section>
          <AdminBookingInfoCards
            :user="booking.pengguna"
            :vespa="booking.vespa"
            :tanggal-pemesanan="booking.tanggal_pemesanan"
            :jam-pemesanan="booking.jam_pemesanan"
          >
            <AdminBookingControlPanel
              :booking-id="booking.id"
              :current-status="booking.status"
              :current-payment-status="booking.status_pembayaran"
              :current-mekanik-id="booking.id_mekanik"
              :current-mekanik-name="booking.mekanik?.nama"
              @refresh="fetchBookingData"
            />
          </AdminBookingInfoCards>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div class="mb-2 flex items-center gap-2">
              <i class="mdi mdi-note-outline text-amber-600"></i>
              <h2 class="font-semibold text-gray-900">Catatan Pelanggan</h2>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-line">
              {{ booking.catatan_pelanggan || "Tidak ada catatan pelanggan." }}
            </p>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div class="mb-2 flex items-center gap-2">
              <i class="mdi mdi-note-text text-green-600"></i>
              <h2 class="font-semibold text-gray-900">Catatan Mekanik</h2>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-line">
              {{ booking.catatan_mekanik || "Belum ada catatan dari mekanik." }}
            </p>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <AdminBookingServicesList :services="booking.layanan" />
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <AdminBookingSparepartsList
              :booking-items="booking.item_pemesanan"
              :is-in-progress="isInProgress"
              @add-sparepart="openAddSparepartModal"
              @delete-item="promptDeleteSparepart"
            />
          </div>
        </section>

        <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <AdminBookingTotalSummary
            :total-harga="totalHarga"
            :total-spareparts="totalSpareparts"
            :grand-total="totalAkhir"
          />

          <AdminAddSparepartModal
            :show="showAddSparepartModal"
            :available-spareparts="availableSpareparts"
            :is-adding="isAddingSparepart"
            @submit="addSparepartToBooking"
            @close="closeAddSparepartModal"
          />
        </section>
      </div>

      <ConfirmationModal
        :show="showDeleteConfirm"
        title="Hapus Suku Cadang"
        message="Apakah Anda yakin ingin menghapus suku cadang ini dari pemesanan?"
        confirm-text="Hapus"
        cancel-text="Batal"
        variant="danger"
        @confirm="removeSparepartFromBooking"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>
