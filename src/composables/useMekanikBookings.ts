import { computed, ref, type Ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import {
  isCompletedOrCancelledStatus,
  mapMekanikFilterToBookingStatus,
  type MekanikStatusFilter,
} from "@/utils/statusBadge";
import { useApiPagination } from "@/composables/useApiPagination";
import type { MekanikBooking } from "@/types/booking";

type MekanikTab = "active" | "history";

export function useMekanikBookings(activeTab: Ref<MekanikTab>) {
  const router = useRouter();
  const toast = useToast();

  const activeBookings = ref<MekanikBooking[]>([]);
  const historyBookings = ref<MekanikBooking[]>([]);
  const loading = ref(false);
  const statusFilter = ref<MekanikStatusFilter>("all");

  const selectedYear = ref(0);
  const selectedMonth = ref(0);

  const {
    pagination: historyPagination,
    setCurrentPage: setHistoryCurrentPage,
    updateFromApi: updateHistoryPagination,
  } = useApiPagination(10);

  const getValidAuthHeaders = () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      router.push("/");
      return null;
    }
    return headers;
  };

  const fetchActiveJobs = async () => {
    loading.value = true;
    try {
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/mekanik/pemesanan?per_page=1000`,
        { headers },
      );

      activeBookings.value = response.data.data.filter(
        (booking: MekanikBooking) =>
          !isCompletedOrCancelledStatus(booking.status),
      );
    } catch (error: any) {
      logError(error, "fetchActiveJobs");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const fetchHistory = async (page = 1) => {
    loading.value = true;
    try {
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: historyPagination.value.per_page.toString(),
      });

      if (selectedYear.value !== 0) {
        params.append("year", selectedYear.value.toString());
      }

      if (selectedMonth.value !== 0) {
        params.append("month", selectedMonth.value.toString());
      }

      const response = await axios.get(
        `${API_URL}/mekanik/pemesanan?${params.toString()}`,
        { headers },
      );

      historyBookings.value = response.data.data.filter(
        (booking: MekanikBooking) =>
          isCompletedOrCancelledStatus(booking.status),
      );
      updateHistoryPagination(response.data);
    } catch (error: any) {
      logError(error, "fetchHistory");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const fetchData = async () => {
    if (activeTab.value === "active") {
      await fetchActiveJobs();
      return;
    }

    await fetchHistory(historyPagination.value.current_page);
  };

  const filteredBookings = computed(() => {
    if (activeTab.value === "history") {
      return historyBookings.value;
    }

    if (statusFilter.value === "all") {
      return activeBookings.value;
    }

    const targetStatus = mapMekanikFilterToBookingStatus(statusFilter.value);
    return activeBookings.value.filter(
      (booking) => booking.status === targetStatus,
    );
  });

  const onFilterChange = () => {
    if (activeTab.value !== "history") {
      return;
    }

    setHistoryCurrentPage(1);
    void fetchHistory(1);
  };

  const handlePageChange = (page: number) => {
    void fetchHistory(page);
  };

  return {
    activeBookings,
    historyBookings,
    filteredBookings,
    loading,
    statusFilter,
    selectedYear,
    selectedMonth,
    historyPagination,
    fetchActiveJobs,
    fetchHistory,
    fetchData,
    onFilterChange,
    handlePageChange,
  };
}
