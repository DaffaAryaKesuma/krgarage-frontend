import { ref, onMounted } from "vue";
import axios from "axios";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";

interface FetchOptions {
  silent?: boolean;
}

export function usePemilikDasborPage() {
  const statistik = ref({
    pendapatanHariIni: 0,
    pendapatanBulanIni: 0,
    unitHariIni: 0,
    nilaiStok: 0,
    loading: true,
  });

  const ringkasan = ref(null);
  const metrik = ref(null);
  const terbaruPemesanan = ref<any[]>([]);

  const fetchDasborData = async (options: FetchOptions = {}) => {
    try {
      const headers = getAuthHeaders();

      const [statistikRes, pemesananRes, ringkasanRes, metrikRes] =
        await Promise.all([
          axios.get(`${API_URL}/pemilik/statistik`, { headers }),
          axios.get(`${API_URL}/pemilik/pemesanan-terbaru`, { headers }),
          axios.get(`${API_URL}/pemilik/ringkasan`, { headers }),
          axios.get(`${API_URL}/pemilik/metrik-keuangan`, { headers }),
        ]);

      statistik.value = {
        pendapatanHariIni:
          statistikRes.data.data?.pendapatan_hari_ini ??
          statistikRes.data.pendapatan_hari_ini ??
          0,
        pendapatanBulanIni:
          statistikRes.data.data?.pendapatan_bulan_ini ??
          statistikRes.data.pendapatan_bulan_ini ??
          0,
        unitHariIni:
          statistikRes.data.data?.unit_hari_ini ??
          statistikRes.data.unit_hari_ini ??
          0,
        nilaiStok:
          statistikRes.data.data?.nilai_stok ??
          statistikRes.data.nilai_stok ??
          0,
        loading: false,
      };

      ringkasan.value = ringkasanRes.data.data ?? ringkasanRes.data;
      metrik.value = metrikRes.data.data ?? metrikRes.data;

      const pemesanan = pemesananRes.data.data ?? pemesananRes.data;
      terbaruPemesanan.value = Array.isArray(pemesanan)
        ? pemesanan.slice(0, 5)
        : [];
    } catch (error: any) {
      logError(error, "fetchDasborData");
      if (!options.silent) {
        statistik.value.loading = false;
      }
    }
  };

  onMounted(fetchDasborData);

  useRealtimeRefresh(() => fetchDasborData({ silent: true }));

  return {
    statistik,
    ringkasan,
    metrik,
    terbaruPemesanan,
    fetchDasborData,
  };
}
