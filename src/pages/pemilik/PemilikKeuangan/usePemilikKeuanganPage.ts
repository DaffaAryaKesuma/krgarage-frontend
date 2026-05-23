import { ref } from "vue";
import axios from "axios";
import { getAuthHeaders } from "@/utils/auth";
import { API_URL } from "@/utils/api";
import { logError } from "@/utils/errorHandler";
import { toLocalISOString } from "@/utils/format";
import type { KeuanganPemesanan } from "@/types/pemesanan";



export function usePemilikKeuanganPage() {
  // 1. Pindahkan State ke sini
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const startDate = ref(toLocalISOString(oneMonthAgo));
  const endDate = ref(toLocalISOString(today));
  
  const revenueData = ref<any>({ labels: [], datasets: [] });
  const pemesanan = ref<KeuanganPemesanan[]>([]);
  const loading = ref(true);
  const ringkasan = ref({
    totalRevenue: 0,
    totalPemesanan: 0,
    avgPemesanan: 0,
  });
  
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  
  // 2. Pindahkan fungsi fetchKeuanganData ke sini
  const fetchKeuanganData = async () => {
    loading.value = true;
    currentPage.value = 1; 
    try {
      const headers = getAuthHeaders();
      const params = {
        start_date: startDate.value,
        end_date: endDate.value,
      };
      
      const [trendRes, pemesananRes] = await Promise.all([
        axios.get(`${API_URL}/pemilik/tren-pendapatan`, { headers, params }),
        axios.get(`${API_URL}/pemilik/transaksi`, { headers, params }),
      ]);
      
      const trendData = trendRes.data.data || trendRes.data;
      revenueData.value = {
        labels: trendData.labels || [],
        datasets: [
          {
            label: `Pendapatan`,
            data: trendData.values || [],
            borderColor: "rgb(220, 38, 38)",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

      const pemesananData = pemesananRes.data.data || pemesananRes.data;
      pemesanan.value = Array.isArray(pemesananData) ? pemesananData : [];
      const total = pemesanan.value.reduce((sum, b) => sum + Number(b.total_harga || 0), 0);

      ringkasan.value = {
        totalRevenue: total,
        totalPemesanan: pemesanan.value.length,
        avgPemesanan: pemesanan.value.length > 0 ? total / pemesanan.value.length : 0,
      };
    } catch (error: any) {
      logError(error, "fetchKeuanganData");
      pemesanan.value = [];
      revenueData.value = { labels: [], datasets: [] };
      ringkasan.value = { totalRevenue: 0, totalPemesanan: 0, avgPemesanan: 0 };
    } finally {
      loading.value = false;
    }
  };
  
  // 3. Wajib: "Keluarkan" semua variabel dan fungsi agar bisa dibaca oleh komponen .vue
  return {
    startDate,
    endDate,
    revenueData,
    pemesanan,
    loading,
    ringkasan,
    currentPage,
    itemsPerPage,
    fetchKeuanganData
  };
}