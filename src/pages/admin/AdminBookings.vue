<script setup lang="ts">
import { onMounted } from "vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import Pagination from "@/components/ui/Pagination.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminBookingsFilters from "@/components/admin/bookings/AdminBookingsFilters.vue";
import AdminBookingCard from "@/components/admin/bookings/AdminBookingCard.vue";
import { useAdminBookingsPage } from "@/composables/useAdminBookingsPage";

const {
  bookings,
  showTodayOnly,
  pagination,
  isLoading,
  error,
  searchQuery,
  monthFilter,
  yearFilter,
  statusFilter,
  paymentFilter,
  filteredBookings,
  selectedMekanikForBooking,
  mekanikOptions,
  fetchAllBookings,
  fetchMekaniks,
  confirmBooking,
  cancelBooking,
  completeBooking,
  markBookingAsPaid,
  assignMekanikAndStart,
} = useAdminBookingsPage();

onMounted(() => {
  fetchAllBookings();
  fetchMekaniks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Kelola Pemesanan"
      icon="mdi-clipboard-list"
      subtitle="Pantau dan kelola semua pemesanan servis pelanggan anda di sini"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <section class="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Loading State -->
        <LoadingSpinner v-if="isLoading" message="Memuat data pemesanan..." />

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-600 py-8">
          {{ error }}
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else-if="bookings.length === 0"
          icon="mdi mdi-clipboard-list"
          title="Belum Ada Pemesanan"
          message="Belum ada pemesanan yang masuk dari pelanggan."
        />

        <!-- Main Content -->
        <div v-else>
          <!-- Filters -->
          <AdminBookingsFilters
            v-model:search-query="searchQuery"
            v-model:month-filter="monthFilter"
            v-model:year-filter="yearFilter"
            v-model:status-filter="statusFilter"
            v-model:payment-filter="paymentFilter"
            v-model:show-today-only="showTodayOnly"
            :total-bookings="bookings.length"
            :filtered-count="filteredBookings.length"
          />

          <!-- Empty Filtered Results -->
          <EmptyState
            v-if="filteredBookings.length === 0"
            icon="mdi mdi-magnify-close"
            title="Tidak Ada Hasil"
            message="Tidak ada pemesanan yang sesuai dengan filter yang dipilih."
          />

          <!-- Booking Cards Grid -->
          <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminBookingCard
              v-for="booking in filteredBookings"
              :key="booking.id"
              :booking="booking"
              :mekanik-options="mekanikOptions"
              v-model:selected-mekanik-id="
                selectedMekanikForBooking[booking.id]
              "
              @confirm="confirmBooking"
              @cancel="cancelBooking"
              @complete="completeBooking"
              @mark-paid="markBookingAsPaid"
              @assign-and-start="assignMekanikAndStart"
            />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="filteredBookings.length > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :total="pagination.total"
            :per-page="pagination.per_page"
            :from="pagination.from"
            :to="pagination.to"
            @page-change="fetchAllBookings"
          />
        </div>
      </section>
    </div>
  </div>
</template>
