<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminBookingInfoCards from "@/components/admin/booking-detail/AdminBookingInfoCards.vue";
import AdminBookingControlPanel from "@/components/admin/booking-detail/AdminBookingControlPanel.vue";
import AdminBookingServicesList from "@/components/admin/booking-detail/AdminBookingServicesList.vue";
import AdminBookingSparepartsList from "@/components/admin/booking-detail/AdminBookingSparepartsList.vue";
import AdminBookingTotalSummary from "@/components/admin/booking-detail/AdminBookingTotalSummary.vue";
import AdminAddSparepartModal from "@/components/admin/booking-detail/AdminAddSparepartModal.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { formatDateShort, formatTimeShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import type { Booking } from "@/types/booking";
import type { SparepartSummary } from "@/types/inventory";

const toast = useToast();
const route = useRoute();

// State
const booking = ref<Booking | null>(null);
const isLoading = ref(true);
const error = ref("");

// Sparepart Modal State
const showAddSparepartModal = ref(false);
const availableSpareparts = ref<SparepartSummary[]>([]);
const isAddingSparepart = ref(false);

// Delete Confirmation State
const showDeleteConfirm = ref(false);
const itemToDelete = ref<number | null>(null);

// Computed Properties
const isInProgress = computed(() => {
  return booking.value?.status.toLowerCase().includes("progress") || false;
});

const totalHarga = computed(() => {
  return booking.value?.layanan?.reduce((sum, s) => sum + s.harga, 0) || 0;
});

const totalSpareparts = computed(() => {
  return (
    booking.value?.item_pemesanan?.reduce(
      (sum, item) => sum + item.harga_saat_ini * item.jumlah,
      0,
    ) || 0
  );
});

const grandTotal = computed(() => totalHarga.value + totalSpareparts.value);

const totalAkhir = computed(
  () => booking.value?.total_harga || grandTotal.value,
);

// API Functions
async function fetchBookingData() {
  try {
    const { data } = await axios.get(
      `${API_URL}/admin/pemesanan/${route.params.id}`,
      { headers: getAuthHeaders() },
    );
    booking.value = data;
  } catch (err) {
    console.error("Gagal mengambil detail pemesanan:", err);
    if (!booking.value) error.value = "Gagal memload data.";
  }
}

async function fetchAvailableSpareparts() {
  try {
    const { data } = await axios.get(`${API_URL}/admin/inventori`, {
      headers: getAuthHeaders(),
    });
    availableSpareparts.value = data.data;
  } catch (err) {
    console.error("Gagal mengambil suku cadang:", err);
  }
}

// Modal Functions
const openAddSparepartModal = () => {
  showAddSparepartModal.value = true;
  fetchAvailableSpareparts();
};

const closeAddSparepartModal = () => {
  showAddSparepartModal.value = false;
};

// CRUD Operations
async function addSparepartToBooking(data: {
  sparepartId: number;
  quantity: number;
}) {
  isAddingSparepart.value = true;
  try {
    await axios.post(
      `${API_URL}/admin/pemesanan/${booking.value?.id}/tambah-suku-cadang`,
      {
        id_suku_cadang: data.sparepartId,
        jumlah: data.quantity,
      },
      { headers: getAuthHeaders() },
    );

    toast.success("Suku cadang berhasil ditambahkan!");
    closeAddSparepartModal();
    await fetchBookingData();
  } catch (err: any) {
    console.error("Gagal menambahkan suku cadang:", err);
    toast.error(err.response?.data?.message || "Gagal menambahkan suku cadang");
  } finally {
    isAddingSparepart.value = false;
  }
}

async function removeSparepartFromBooking() {
  if (!itemToDelete.value) return;

  try {
    await axios.delete(
      `${API_URL}/admin/pemesanan/${booking.value?.id}/item/${itemToDelete.value}`,
      { headers: getAuthHeaders() },
    );

    toast.success("Suku cadang berhasil dihapus!");
    showDeleteConfirm.value = false;
    await fetchBookingData();
  } catch (err: any) {
    console.error("Gagal menghapus suku cadang:", err);
    toast.error(err.response?.data?.message || "Gagal menghapus suku cadang");
  }
}

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
              :current-mechanic-id="booking.id_mekanik"
              :current-mechanic-name="booking.mekanik?.nama"
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
              @delete-item="
                itemToDelete = $event;
                showDeleteConfirm = true;
              "
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
