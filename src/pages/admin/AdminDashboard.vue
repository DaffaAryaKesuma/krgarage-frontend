<script setup lang="ts">
import AdminDashboardStatsCards from "@/components/admin/dashboard/AdminDashboardStatsCards.vue";
import AdminDashboardRecentBookings from "@/components/admin/dashboard/AdminDashboardRecentBookings.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { useAdminDashboardPage } from "@/composables/useAdminDashboardPage";

const {
  stats,
  lowStockCount,
  recentBookings,
  currentDate,
  mekanikOptions,
  selectedMekanikForBooking,
  changeStatus,
  changePaymentStatus,
  assignMekanikAndStart,
} = useAdminDashboardPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Dasbor Admin"
      icon="mdi-view-dashboard"
      :subtitle="currentDate"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Summary Cards -->
      <AdminDashboardStatsCards
        :stats="stats"
        :low-stock-count="lowStockCount"
      />

      <!-- Recent Bookings -->
      <AdminDashboardRecentBookings
        :bookings="recentBookings"
        :mekanik-options="mekanikOptions"
        v-model:selected-mekaniks="selectedMekanikForBooking"
        @status-change="changeStatus"
        @payment-status-change="changePaymentStatus"
        @assign-and-start="assignMekanikAndStart"
      />
    </div>
  </div>
</template>
