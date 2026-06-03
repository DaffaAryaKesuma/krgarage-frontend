import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { formatDateShort } from "@/utils/date";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import {
  notifyKrGarageDataChanged,
  useRealtimeRefresh,
} from "@/composables/useRealtimeRefresh";
import { PEMESANAN_STATUS } from "@/utils/statusBadge";
import { PEMBAYARAN_STATUS } from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
import type { MekanikProfile } from "@/types/user";

interface DasborStatistik {
  pemesanan_hari_ini: number;
  sedang_dikerjakan: number;
  selesai_hari_ini: number;
}

interface FetchOptions {
  silent?: boolean;
}

export function useAdminDasborPage() {
  const toast = useToast();

  const isLoading = ref(true);
  const statistik = ref<DasborStatistik>({
    pemesanan_hari_ini: 0,
    sedang_dikerjakan: 0,
    selesai_hari_ini: 0,
  });
  const lowStockCount = ref(0);
  const terbaruPemesanan = ref<Pemesanan[]>([]);
  const currentDate = ref("");
  const mekaniks = ref<MekanikProfile[]>([]);
  const selectedMekanikForPemesanan = ref<Record<number, number>>({});

  const mekanikOptions = computed<MekanikOption[]>(() =>
    mekaniks.value.map((mekanik) => ({
      value: mekanik.id,
      label: mekanik.nama,
    })),
  );

  const fetchDasborStatistik = async (notifyOnError = true) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/dashboard/statistik`, {
        headers: getAuthHeaders(),
      });

      statistik.value = data;
    } catch (error: any) {
      logError(error, "fetchDasborStatistik");
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

  const fetchDasborData = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    try {
      const [pemesananRes, lowStockRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard/pemesanan-terbaru`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${API_URL}/admin/inventori/stok-menipis`, {
          headers: getAuthHeaders(),
        }),
      ]);

      terbaruPemesanan.value = pemesananRes.data;
      lowStockCount.value = lowStockRes.data.data?.length || 0;
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "fetchDasborData");
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  useRealtimeRefresh(() => fetchDasborData({ silent: true }));

  const changeStatus = async (pemesanan: Pemesanan, statusBaru: string, catatan?: string) => {
    try {
      const payload: Record<string, string> = { status: statusBaru };
      if (catatan) payload.catatan_mekanik = catatan;

      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        payload,
        { headers: getAuthHeaders() },
      );

      pemesanan.status = statusBaru;
      toast.success("Status pemesanan berhasil diubah!");
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "changeStatus");
      toast.error(handleApiError(error));
    }
  };

  const assignMekanikAndStart = async (pemesanan: Pemesanan) => {
    const mekanikId = selectedMekanikForPemesanan.value[pemesanan.id];

    if (!mekanikId) {
      toast.error("Pilih mekanik terlebih dahulu");
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/tugaskan-mekanik`,
        { id_mekanik: mekanikId },
        { headers: getAuthHeaders() },
      );

      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        { status: PEMESANAN_STATUS.DIKERJAKAN },
        { headers: getAuthHeaders() },
      );

      pemesanan.status = PEMESANAN_STATUS.DIKERJAKAN;
      pemesanan.id_mekanik = mekanikId;
      pemesanan.mekanik =
        mekaniks.value.find((mekanik) => mekanik.id === mekanikId) || null;

      toast.success("Mekanik di-assign dan servis dimulai!");
      notifyKrGarageDataChanged();
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "assignMekanikAndStart");
      toast.error(handleApiError(error));
    }
  };

  const changePembayaranStatus = async (pemesanan: Pemesanan, statusBaru: string) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status-pembayaran`,
        { status_pembayaran: statusBaru },
        { headers: getAuthHeaders() },
      );

      pemesanan.status_pembayaran =
        data.data?.status_pembayaran || data.pemesanan?.status_pembayaran || statusBaru || PEMBAYARAN_STATUS.PAID;
      toast.success("Status pembayaran berhasil diperbarui menjadi lunas!");
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "changePembayaranStatus");
      toast.error(handleApiError(error));
    }
  };

  onMounted(() => {
    fetchDasborData();
    fetchMekaniks();
    currentDate.value = formatDateShort(new Date());
  });

  return {
    isLoading,
    statistik,
    lowStockCount,
    terbaruPemesanan,
    currentDate,
    mekanikOptions,
    selectedMekanikForPemesanan,
    fetchDasborStatistik,
    fetchDasborData,
    fetchMekaniks,
    changeStatus,
    assignMekanikAndStart,
    changePembayaranStatus,
  };
}
