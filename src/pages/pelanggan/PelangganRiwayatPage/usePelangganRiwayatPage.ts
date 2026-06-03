import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useApiPagination } from "@/composables/useApiPagination";
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { PelangganPemesanan } from "@/types/pemesanan";

interface FetchOptions {
  silent?: boolean;
}

export function usePelangganRiwayatPage() {
  const toast = useToast();

  const list = ref<PelangganPemesanan[]>([]);
  const isLoading = ref(true);
  const cancelling = ref<number | null>(null);
  const showConfirmDialog = ref(false);
  const pemesananToCancel = ref<number | null>(null);

  const selectedMonth = ref<number>(new Date().getMonth() + 1);
  const selectedYear = ref<number>(new Date().getFullYear());
  const { pagination, setCurrentPage, updateFromApi } = useApiPagination(10);

  const fetchPemesanan = async (page = 1, options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    const headers = getAuthHeaders();

    if (!Object.keys(headers).length) {
      if (!options.silent) {
        isLoading.value = false;
      }
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/pemesanan?page=${page}&per_page=${pagination.value.per_page}&month=${selectedMonth.value}&year=${selectedYear.value}`,
        { headers },
      );

      list.value = data.data;
      updateFromApi(data.meta || data);
    } catch (error) {
      logError(error, "fetchPemesanan");
      if (!options.silent) {
        toast.error("Gagal memuat riwayat pemesanan.");
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  useRealtimeRefresh(
    () => fetchPemesanan(pagination.value.current_page, { silent: true }),
  );

  const cancelPemesanan = (pemesananId: number) => {
    pemesananToCancel.value = pemesananId;
    showConfirmDialog.value = true;
  };

  const handleConfirmCancel = async () => {
    showConfirmDialog.value = false;
    if (!pemesananToCancel.value) return;

    const pemesananId = pemesananToCancel.value;
    cancelling.value = pemesananId;
    const headers = getAuthHeaders();

    try {
      await axios.post(
        `${API_URL}/pemesanan/${pemesananId}/batalkan`,
        {},
        { headers },
      );

      toast.success("Pemesanan berhasil dibatalkan");
      await fetchPemesanan(1);
    } catch (error: any) {
      logError(error, "cancelPemesanan");
      toast.error(handleApiError(error));
    } finally {
      cancelling.value = null;
      pemesananToCancel.value = null;
    }
  };

  const handleCancelDialog = () => {
    showConfirmDialog.value = false;
    pemesananToCancel.value = null;
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchPemesanan(1);
  };

  onMounted(() => fetchPemesanan());

  return {
    list,
    isLoading,
    cancelling,
    showConfirmDialog,
    selectedMonth,
    selectedYear,
    pagination,
    fetchPemesanan,
    cancelPemesanan,
    handleConfirmCancel,
    handleCancelDialog,
    handleFilterChange,
  };
}
