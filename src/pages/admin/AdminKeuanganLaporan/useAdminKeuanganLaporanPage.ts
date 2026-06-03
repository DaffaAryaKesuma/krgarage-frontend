import { ref, onMounted } from "vue";
import axios from "axios";
import { logError, handleApiError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { KeuanganPemesanan } from "@/types/pemesanan";

export interface Ringkasan {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

export interface MonthlyData {
  bulan: number;
  pendapatan: string;
}

interface FetchOptions {
  silent?: boolean;
}

export function useAdminKeuanganLaporanPage() {
  const toast = useToast();

  const selectedYear = ref(new Date().getFullYear());
  const selectedMonth = ref<number | string>(new Date().getMonth() + 1);
  const isLoading = ref(true);

  const ringkasan = ref<Ringkasan>({
    total_pendapatan: 0,
    total_pemesanan: 0,
    rata_rata_nilai_pesan: 0,
  });

  const monthlyData = ref<MonthlyData[]>([]);
  const topLayanan = ref<any[]>([]);
  const pemesanan = ref<KeuanganPemesanan[]>([]);

  const fetchLaporan = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    try {
      const params = {
        year: selectedYear.value,
        ...(selectedMonth.value && { month: selectedMonth.value }),
      };

      const { data } = await axios.get(`${API_URL}/admin/laporan/keuangan`, {
        params,
        headers: getAuthHeaders(),
      });

      ringkasan.value = data.ringkasan;
      monthlyData.value = data.data_bulanan;
      topLayanan.value = data.layanan_terpopuler;
      pemesanan.value = data.pemesanan;
    } catch (error: any) {
      logError(error, "fetchLaporan");
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  useRealtimeRefresh(() => fetchLaporan({ silent: true }));

  onMounted(() => fetchLaporan());

  return {
    selectedYear,
    selectedMonth,
    isLoading,
    ringkasan,
    monthlyData,
    topLayanan,
    pemesanan,
    fetchLaporan,
  };
}
