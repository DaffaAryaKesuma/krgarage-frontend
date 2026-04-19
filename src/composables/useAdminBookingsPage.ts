import { computed, ref } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { BOOKING_STATUS, type BookingStatusFilter } from "@/utils/statusBadge";
import {
  PAYMENT_STATUS,
  type PaymentStatusFilter,
} from "@/utils/paymentStatus";
import { useApiPagination } from "@/composables/useApiPagination";
import type { Booking } from "@/types/booking";
import type { MekanikProfile } from "@/types/user";
import {
  matchesAdminBookingFilters,
  type AdminBookingsFilterState,
} from "@/composables/helpers/adminBookingsHelpers";

export function useAdminBookingsPage() {
  const toast = useToast();

  const bookings = ref<Booking[]>([]);
  const mekaniks = ref<MekanikProfile[]>([]);
  const showTodayOnly = ref(false);
  const { pagination, updateFromApi } = useApiPagination(10);

  const isLoading = ref(true);
  const error = ref("");
  const searchQuery = ref("");
  const monthFilter = ref("");
  const yearFilter = ref(new Date().getFullYear().toString());
  const statusFilter = ref<BookingStatusFilter>("all");
  const paymentFilter = ref<PaymentStatusFilter>("all");

  const filteredBookings = computed(() => {
    const filters: AdminBookingsFilterState = {
      query: searchQuery.value,
      monthFilter: monthFilter.value,
      yearFilter: yearFilter.value,
      statusFilter: statusFilter.value,
      paymentFilter: paymentFilter.value,
      todayOnly: showTodayOnly.value,
    };

    return bookings.value.filter((booking) =>
      matchesAdminBookingFilters(booking, filters),
    );
  });

  const selectedMekanikForBooking = ref<{ [bookingId: number]: number }>({});

  const mekanikOptions = computed(() =>
    mekaniks.value.map((m) => ({ value: m.id, label: m.nama })),
  );

  const fetchAllBookings = async (page = 1) => {
    isLoading.value = true;
    error.value = "";

    try {
      const { data } = await axios.get(
        `${API_URL}/admin/pemesanan?page=${page}&per_page=${pagination.value.per_page}`,
        { headers: getAuthHeaders() },
      );

      bookings.value = data.data || [];
      updateFromApi(data);
    } catch (err: any) {
      console.error("Gagal mengambil data pemesanan:", err);
      error.value =
        err.response?.status === 401
          ? "Sesi tidak valid. Silakan login kembali."
          : "Gagal memuat data pemesanan.";
    } finally {
      isLoading.value = false;
    }
  };

  const changeStatus = async (booking: Booking, newStatus: string) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() },
      );

      booking.status = data.pemesanan?.status ?? newStatus;
      toast.success("Status pemesanan berhasil diubah!");
      await fetchAllBookings(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal mengubah status:", err);
      toast.error(
        err.response?.data?.message || "Gagal mengubah status pemesanan.",
      );
    }
  };

  const fetchMekaniks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
      });
      mekaniks.value = data.data || [];
    } catch (err: any) {
      console.error("Gagal mengambil data mekanik:", err);
    }
  };

  const confirmBooking = async (booking: Booking) => {
    await changeStatus(booking, BOOKING_STATUS.CONFIRMED);
  };

  const cancelBooking = async (booking: Booking) => {
    await changeStatus(booking, BOOKING_STATUS.CANCELLED);
  };

  const completeBooking = async (booking: Booking) => {
    await changeStatus(booking, BOOKING_STATUS.COMPLETED);
  };

  const markBookingAsPaid = async (booking: Booking) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/status-pembayaran`,
        { status_pembayaran: PAYMENT_STATUS.PAID },
        { headers: getAuthHeaders() },
      );

      booking.status_pembayaran =
        data.pemesanan?.status_pembayaran || PAYMENT_STATUS.PAID;
      toast.success("Status pembayaran berhasil diperbarui menjadi lunas!");
      await fetchAllBookings(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal memperbarui status pembayaran:", err);
      toast.error(
        err.response?.data?.message || "Gagal memperbarui status pembayaran.",
      );
    }
  };

  const assignMekanikAndStart = async (booking: Booking) => {
    const mekanikId = selectedMekanikForBooking.value[booking.id];

    if (!mekanikId) {
      toast.error("Pilih mekanik terlebih dahulu");
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/tugaskan-mekanik`,
        { id_mekanik: mekanikId },
        { headers: getAuthHeaders() },
      );

      await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/status`,
        { status: BOOKING_STATUS.IN_PROGRESS },
        { headers: getAuthHeaders() },
      );

      toast.success("Mekanik di-assign dan servis dimulai!");
      await fetchAllBookings(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal assign mekanik dan mulai servis:", err);
      toast.error(err.response?.data?.message || "Gagal memproses pemesanan.");
    }
  };

  return {
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
  };
}
