import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { handleApiError, logError } from "@/utils/errorHandler";
import { toMoneyNumber } from "@/utils/money";
import { canPelangganCancelPemesanan } from "@/utils/statusBadge";
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { Pemesanan } from "@/types/pemesanan";

interface FetchOptions {
  silent?: boolean;
}

export function usePelangganPemesananDetailPage() {
  const route = useRoute();
  const toast = useToast();

  const pemesanan = ref<Pemesanan | null>(null);
  const isLoading = ref(true);
  const isCancelling = ref(false);
  const showCancelConfirm = ref(false);
  const errorMessage = ref("");

  const pemesananId = computed(() => Number(route.params.id));

  const getLayananSnapshotPrice = (layanan: Pemesanan["layanan"][number]) =>
    toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0);

  const totalLayanan = computed(
    () =>
      pemesanan.value?.layanan?.reduce(
        (sum, layanan) => sum + getLayananSnapshotPrice(layanan),
        0,
      ) || 0,
  );

  const totalSukuCadang = computed(
    () =>
      pemesanan.value?.item_pemesanan?.reduce(
        (sum, item) => sum + toMoneyNumber(item.harga_saat_ini) * item.jumlah,
        0,
      ) || 0,
  );

  const totalBiaya = computed(() => {
    const rawTotal = pemesanan.value?.total_harga;
    if (rawTotal === null || rawTotal === undefined) {
      return totalLayanan.value + totalSukuCadang.value;
    }
    return toMoneyNumber(rawTotal);
  });

  const canCancel = computed(() =>
    canPelangganCancelPemesanan(pemesanan.value?.status || null),
  );

  const fetchPemesananDetail = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
      errorMessage.value = "";
    }

    if (!Number.isFinite(pemesananId.value) || pemesananId.value <= 0) {
      if (!options.silent) {
        errorMessage.value = "ID pemesanan tidak valid.";
        isLoading.value = false;
      }
      return;
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
        `${API_URL}/pemesanan/${pemesananId.value}`,
        { headers },
      );
      pemesanan.value = data?.data || data;
    } catch (error: any) {
      logError(error, "fetchPemesananDetail");
      if (!options.silent) {
        errorMessage.value = handleApiError(error);
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  useRealtimeRefresh(() => fetchPemesananDetail({ silent: true }));

  const handleConfirmCancel = async () => {
    if (!pemesanan.value || isCancelling.value) return;

    isCancelling.value = true;
    const headers = getAuthHeaders();

    try {
      await axios.post(
        `${API_URL}/pemesanan/${pemesanan.value.id}/batalkan`,
        {},
        { headers },
      );

      toast.success("Pemesanan berhasil dibatalkan");
      showCancelConfirm.value = false;
      await fetchPemesananDetail();
    } catch (error: any) {
      logError(error, "cancelPemesananFromDetail");
      toast.error(handleApiError(error));
    } finally {
      isCancelling.value = false;
    }
  };

  onMounted(() => {
    fetchPemesananDetail();
  });

  return {
    pemesanan,
    isLoading,
    isCancelling,
    showCancelConfirm,
    errorMessage,
    totalLayanan,
    totalSukuCadang,
    totalBiaya,
    canCancel,
    handleConfirmCancel,
  };
}
