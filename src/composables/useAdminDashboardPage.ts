import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { formatDateShort } from "@/utils/date";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { BOOKING_STATUS } from "@/utils/statusBadge";
import { PAYMENT_STATUS } from "@/utils/paymentStatus";
import type { Booking, MekanikOption } from "@/types/booking";
import type { MekanikProfile } from "@/types/user";

interface DashboardStats {
  pemesanan_hari_ini: number;
  sedang_diproses: number;
  selesai_hari_ini: number;
}

export function useAdminDashboardPage() {
  const toast = useToast();

  const stats = ref<DashboardStats>({
    pemesanan_hari_ini: 0,
    sedang_diproses: 0,
    selesai_hari_ini: 0,
  });
  const lowStockCount = ref(0);
  const recentBookings = ref<Booking[]>([]);
  const currentDate = ref("");
  const mekaniks = ref<MekanikProfile[]>([]);
  const selectedMekanikForBooking = ref<Record<number, number>>({});

  const mekanikOptions = computed<MekanikOption[]>(() =>
    mekaniks.value.map((mekanik) => ({
      value: mekanik.id,
      label: mekanik.nama,
    })),
  );

  const fetchDashboardStats = async (notifyOnError = true) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/dashboard/statistik`, {
        headers: getAuthHeaders(),
      });

      stats.value = data;
    } catch (error: any) {
      logError(error, "fetchDashboardStats");
      if (notifyOnError) {
        toast.error(handleApiError(error));
      }
    }
  };

  const fetchMekaniks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
      });
      mekaniks.value = data.data || [];
    } catch (error: any) {
      logError(error, "fetchMekaniks");
      toast.error(handleApiError(error));
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, lowStockRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard/pemesanan-terbaru`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${API_URL}/admin/inventori/stok-menipis`, {
          headers: getAuthHeaders(),
        }),
      ]);

      recentBookings.value = bookingsRes.data;
      lowStockCount.value = lowStockRes.data.data?.length || 0;
      await fetchDashboardStats(false);
    } catch (error: any) {
      logError(error, "fetchDashboardData");
      toast.error(handleApiError(error));
    }
  };

  const changeStatus = async (booking: Booking, newStatus: string) => {
    try {
      await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() },
      );

      booking.status = newStatus;
      toast.success("Status pemesanan berhasil diubah!");
      await fetchDashboardStats(false);
    } catch (error: any) {
      logError(error, "changeStatus");
      toast.error(handleApiError(error));
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

      booking.status = BOOKING_STATUS.IN_PROGRESS;
      booking.id_mekanik = mekanikId;
      booking.mekanik =
        mekaniks.value.find((mekanik) => mekanik.id === mekanikId) || null;

      toast.success("Mekanik di-assign dan servis dimulai!");
      await fetchDashboardStats(false);
    } catch (error: any) {
      logError(error, "assignMekanikAndStart");
      toast.error(handleApiError(error));
    }
  };

  const changePaymentStatus = async (booking: Booking, newStatus: string) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${booking.id}/status-pembayaran`,
        { status_pembayaran: newStatus },
        { headers: getAuthHeaders() },
      );

      booking.status_pembayaran =
        data.pemesanan?.status_pembayaran || newStatus || PAYMENT_STATUS.PAID;
      toast.success("Status pembayaran berhasil diperbarui menjadi lunas!");
    } catch (error: any) {
      logError(error, "changePaymentStatus");
      toast.error(handleApiError(error));
    }
  };

  onMounted(() => {
    fetchDashboardData();
    fetchMekaniks();
    currentDate.value = formatDateShort(new Date());
  });

  return {
    stats,
    lowStockCount,
    recentBookings,
    currentDate,
    mekanikOptions,
    selectedMekanikForBooking,
    fetchDashboardStats,
    fetchDashboardData,
    fetchMekaniks,
    changeStatus,
    assignMekanikAndStart,
    changePaymentStatus,
  };
}
