<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CustomerHistoryFilters from "@/components/customer/history/CustomerHistoryFilters.vue";
import CustomerHistoryList from "@/components/customer/history/CustomerHistoryList.vue";
import { API_URL } from "@/utils/api";

interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at: string;
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

const toast = useToast();

const list = ref<Booking[]>([]);
const isLoading = ref(true);
const cancelling = ref<number | null>(null);
const showConfirmDialog = ref(false);
const bookingToCancel = ref<number | null>(null);

// Filter states
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(new Date().getFullYear());

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
});

// Cancel booking - show confirmation dialog
const cancelBooking = (bookingId: number) => {
  bookingToCancel.value = bookingId;
  showConfirmDialog.value = true;
};

// Handle confirm cancel
const handleConfirmCancel = async () => {
  showConfirmDialog.value = false;
  if (!bookingToCancel.value) return;

  const bookingId = bookingToCancel.value;
  cancelling.value = bookingId;
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `${API_URL}/bookings/${bookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    toast.success("Pemesanan berhasil dibatalkan");
    await fetchBookings(1);
  } catch (error: any) {
    logError(error, "cancelBooking");
    toast.error(handleApiError(error));
  } finally {
    cancelling.value = null;
    bookingToCancel.value = null;
  }
};

// Handle cancel dialog close
const handleCancelDialog = () => {
  showConfirmDialog.value = false;
  bookingToCancel.value = null;
};

// Fetch bookings with filters
const fetchBookings = async (page = 1) => {
  isLoading.value = true;
  const token = localStorage.getItem("token");

  if (!token) {
    isLoading.value = false;
    return;
  }

  try {
    const { data } = await axios.get(
      `${API_URL}/bookings?page=${page}&per_page=${pagination.value.per_page}&month=${selectedMonth.value}&year=${selectedYear.value}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    list.value = data.data;
    Object.assign(pagination.value, {
      current_page: data.current_page,
      last_page: data.last_page,
      per_page: data.per_page,
      total: data.total,
      from: data.from || 0,
      to: data.to || 0,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    isLoading.value = false;
  }
};

// Handle filter change
const handleFilterChange = () => {
  pagination.value.current_page = 1;
  fetchBookings(1);
};

onMounted(() => fetchBookings());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
          >
            <i class="mdi mdi-history text-3xl"></i>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">Riwayat Servis</h1>
            <p class="text-sm sm:text-base text-red-100">
              Pantau semua riwayat pemesanan dan pembayaran Anda
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <section class="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Filter Section -->
        <CustomerHistoryFilters
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          @change="handleFilterChange"
        />

        <!-- History List -->
        <CustomerHistoryList
          :bookings="list"
          :is-loading="isLoading"
          :pagination="pagination"
          :cancelling-id="cancelling"
          @cancel="cancelBooking"
          @page-change="fetchBookings"
        />
      </section>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmationModal
      :show="showConfirmDialog"
      title="Batalkan Pemesanan"
      message="Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Batalkan"
      cancel-text="Tidak"
      variant="danger"
      @confirm="handleConfirmCancel"
      @cancel="handleCancelDialog"
    />
  </div>
</template>
