<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CustomerHistoryFilters from "@/components/customer/history/CustomerHistoryFilters.vue";
import CustomerHistoryList from "@/components/customer/history/CustomerHistoryList.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useApiPagination } from "@/composables/useApiPagination";
import type { CustomerBooking } from "@/types/booking";

const toast = useToast();

const list = ref<CustomerBooking[]>([]);
const isLoading = ref(true);
const cancelling = ref<number | null>(null);
const showConfirmDialog = ref(false);
const bookingToCancel = ref<number | null>(null);

// Filter states
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(new Date().getFullYear());
const { pagination, setCurrentPage, updateFromApi } = useApiPagination(10);

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
  const headers = getAuthHeaders();

  try {
    await axios.post(
      `${API_URL}/pemesanan/${bookingId}/batalkan`,
      {},
      { headers },
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
  const headers = getAuthHeaders();

  if (!Object.keys(headers).length) {
    isLoading.value = false;
    return;
  }

  try {
    const { data } = await axios.get(
      `${API_URL}/pemesanan?page=${page}&per_page=${pagination.value.per_page}&month=${selectedMonth.value}&year=${selectedYear.value}`,
      { headers },
    );

    list.value = data.data;
    updateFromApi(data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    isLoading.value = false;
  }
};

// Handle filter change
const handleFilterChange = () => {
  setCurrentPage(1);
  fetchBookings(1);
};

onMounted(() => fetchBookings());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Riwayat Servis"
      icon="mdi-history"
      subtitle="Pantau semua riwayat pemesanan dan pembayaran Anda"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

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
