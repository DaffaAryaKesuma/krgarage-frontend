import { computed, ref, type Ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import {
  isCompletedOrCancelledStatus,
  mapMekanikFilterToPemesananStatus,
  type MekanikStatusFilter,
} from "@/utils/statusBadge";
import { useApiPagination } from "@/composables/useApiPagination";
import type { MekanikPemesanan } from "@/types/pemesanan";

type MekanikTab = "active" | "riwayat";

export function useMekanikPemesanan(activeTab: Ref<MekanikTab>) {
  const router = useRouter();
  const toast = useToast();

  const activePemesanan = ref<MekanikPemesanan[]>([]);
  const riwayatPemesanan = ref<MekanikPemesanan[]>([]);
  const loading = ref(false);
  const statusFilter = ref<MekanikStatusFilter>("all");

  const selectedYear = ref(0);
  const selectedMonth = ref(0);

  const {
    pagination: riwayatPagination,
    setCurrentPage: setRiwayatCurrentPage,
    updateFromApi: updateRiwayatPagination,
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

      activePemesanan.value = response.data.data.filter(
        (pemesanan: MekanikPemesanan) =>
          !isCompletedOrCancelledStatus(pemesanan.status),
      );
    } catch (error: any) {
      logError(error, "fetchActiveJobs");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const fetchRiwayat = async (page = 1) => {
    loading.value = true;
    try {
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: riwayatPagination.value.per_page.toString(),
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

      riwayatPemesanan.value = response.data.data.filter(
        (pemesanan: MekanikPemesanan) =>
          isCompletedOrCancelledStatus(pemesanan.status),
      );
      updateRiwayatPagination(response.data);
    } catch (error: any) {
      logError(error, "fetchRiwayat");
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

    await fetchRiwayat(riwayatPagination.value.current_page);
  };

  const filteredPemesanan = computed(() => {
    if (activeTab.value === "riwayat") {
      return riwayatPemesanan.value;
    }

    if (statusFilter.value === "all") {
      return activePemesanan.value;
    }

    const targetStatus = mapMekanikFilterToPemesananStatus(statusFilter.value);
    return activePemesanan.value.filter(
      (pemesanan) => pemesanan.status === targetStatus,
    );
  });

  const onFilterChange = () => {
    if (activeTab.value !== "riwayat") {
      return;
    }

    setRiwayatCurrentPage(1);
    void fetchRiwayat(1);
  };

  const handlePageChange = (page: number) => {
    void fetchRiwayat(page);
  };

  return {
    activePemesanan,
    riwayatPemesanan,
    filteredPemesanan,
    loading,
    statusFilter,
    selectedYear,
    selectedMonth,
    riwayatPagination,
    fetchActiveJobs,
    fetchRiwayat,
    fetchData,
    onFilterChange,
    handlePageChange,
  };
}
