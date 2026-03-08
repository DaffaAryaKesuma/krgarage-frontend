<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { getStatusBadge, getStatusLabel } from "@/utils/statusBadge";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AdminBookingInfoCards from "@/components/admin/booking-detail/AdminBookingInfoCards.vue";
import AdminBookingNotes from "@/components/admin/booking-detail/AdminBookingNotes.vue";
import AdminBookingServicesList from "@/components/admin/booking-detail/AdminBookingServicesList.vue";
import AdminBookingSparepartsList from "@/components/admin/booking-detail/AdminBookingSparepartsList.vue";
import AdminBookingTotalSummary from "@/components/admin/booking-detail/AdminBookingTotalSummary.vue";
import AdminAddSparepartModal from "@/components/admin/booking-detail/AdminAddSparepartModal.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

const toast = useToast();
const route = useRoute();

// Interfaces
interface BookingItem {
  id: number;
  suku_cadang: { id: number; nama_suku_cadang: string; kategori: string };
  jumlah: number;
  harga_saat_ini: number;
}

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  catatan_pelanggan: string;
  total_harga: number | null;
  pengguna: { nama: string; email: string; no_telepon?: string };
  vespa: { model: string; tahun_produksi: number; plat_nomor: string };
  layanan: { id: number; nama_layanan: string; harga: number }[];
  item_pemesanan?: BookingItem[];
}

interface Sparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_jual: number;
}

// State
const booking = ref<Booking | null>(null);
const isLoading = ref(true);
const error = ref("");

// Sparepart Modal State
const showAddSparepartModal = ref(false);
const availableSpareparts = ref<Sparepart[]>([]);
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

// API Functions
async function fetchBookingData() {
  try {
    const { data } = await axios.get(
      `${API_URL}/admin/bookings/${route.params.id}`,
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
    const { data } = await axios.get(`${API_URL}/admin/inventory`, {
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
      `${API_URL}/admin/bookings/${booking.value?.id}/add-sparepart`,
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
      `${API_URL}/admin/bookings/${booking.value?.id}/items/${itemToDelete.value}`,
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
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Red Header Bar -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white mb-1">Detail Pemesanan</h1>
            <h2 class="text-xl font-semibold text-white">
              {{ booking?.kode_pemesanan || "Loading..." }}
            </h2>
          </div>
          <router-link
            to="/admin/bookings"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition no-underline backdrop-blur-sm self-center"
          >
            <i class="mdi mdi-arrow-left"></i>
            <span class="font-medium">Kembali</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <i class="mdi mdi-alert-circle text-4xl text-red-600 mb-2"></i>
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Info Cards -->
        <AdminBookingInfoCards
          :user="booking.pengguna"
          :vespa="booking.vespa"
          :tanggal-pemesanan="booking.tanggal_pemesanan"
          :jam-pemesanan="booking.jam_pemesanan"
        />

        <!-- Catatan Pelanggan -->
        <AdminBookingNotes :catatan="booking.catatan_pelanggan" />

        <!-- Layanan & Sparepart Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div
            class="p-6 border-b border-gray-100 flex items-center justify-between"
          >
            <h2 class="text-xl font-bold text-gray-900">Rincian Layanan</h2>
            <!-- Status Badge - moved here -->
            <div
              v-if="booking"
              class="px-4 py-2 rounded-full text-sm font-semibold"
              :class="getStatusBadge(booking.status)"
            >
              {{ getStatusLabel(booking.status) }}
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Services -->
            <AdminBookingServicesList :services="booking.layanan" />

            <!-- Sparepart Section -->
            <AdminBookingSparepartsList
              v-if="isInProgress || booking.item_pemesanan?.length"
              :booking-items="booking.item_pemesanan"
              :is-in-progress="isInProgress"
              @add-sparepart="openAddSparepartModal"
              @delete-item="
                (itemId) => {
                  itemToDelete = itemId;
                  showDeleteConfirm = true;
                }
              "
            />

            <!-- Total Section -->
            <AdminBookingTotalSummary
              :total-harga="totalHarga"
              :total-spareparts="totalSpareparts"
              :grand-total="booking.total_harga || grandTotal"
            />
          </div>
        </div>
      </div>

      <!-- Add Sparepart Modal -->
      <AdminAddSparepartModal
        :show="showAddSparepartModal"
        :available-spareparts="availableSpareparts"
        :is-adding="isAddingSparepart"
        @submit="addSparepartToBooking"
        @close="closeAddSparepartModal"
      />
    </div>

    <!-- Delete Confirmation Modal -->
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
</template>
