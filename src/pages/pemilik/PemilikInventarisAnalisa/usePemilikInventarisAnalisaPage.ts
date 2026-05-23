import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { getYearOptions } from "@/utils/dateFilters";
import { API_URL } from "@/utils/api";

export function usePemilikInventarisAnalisaPage() {
  const YEAR_OPTIONS = computed(() =>
    getYearOptions(6).map((opt) => Number(opt.value)),
  );

  const selectedMonth = ref(new Date().getMonth() + 1);
  const selectedYear = ref(new Date().getFullYear());

  const topLayanan = ref<any[]>([]);
  const topSukuCadang = ref<any[]>([]);
  const lowStockItems = ref<any[]>([]);
  const loading = ref(true);

  const ringkasan = ref({
    totalLayanan: 0,
    totalSukuCadang: 0,
    lowStockCount: 0,
  });

  const fetchInventarisAnalisa = async () => {
    loading.value = true;
    try {
      const headers = getAuthHeaders();
      const params = {
        month: selectedMonth.value,
        year: selectedYear.value,
      };

      const [layananRes, sukucadangRes, lowStockRes] = await Promise.all([
        axios.get(`${API_URL}/pemilik/layanan-terpopuler`, { headers, params }),
        axios.get(`${API_URL}/pemilik/suku-cadang-terlaris`, { headers, params }),
        axios.get(`${API_URL}/pemilik/stok-menipis`, { headers }),
      ]);

      topLayanan.value = layananRes.data.data ?? layananRes.data;
      topSukuCadang.value = sukucadangRes.data.data ?? sukucadangRes.data;
      lowStockItems.value = lowStockRes.data.data ?? lowStockRes.data;

      ringkasan.value = {
        totalLayanan: Array.isArray(topLayanan.value)
          ? topLayanan.value.reduce(
              (sum, s) => sum + parseInt(s.total || s.total_pemesanan || 0),
              0,
            )
          : 0,
        totalSukuCadang: Array.isArray(topSukuCadang.value)
          ? topSukuCadang.value.reduce(
              (sum, s) => sum + parseInt(s.total_terjual || 0),
              0,
            )
          : 0,
        lowStockCount: Array.isArray(lowStockItems.value)
          ? lowStockItems.value.length
          : 0,
      };
    } catch (error: any) {
      logError(error, "fetchInventarisData");
    } finally {
      loading.value = false;
    }
  };

  watch([selectedMonth, selectedYear], () => {
    fetchInventarisAnalisa();
  });

  onMounted(fetchInventarisAnalisa);

  return {
    YEAR_OPTIONS,
    selectedMonth,
    selectedYear,
    topLayanan,
    topSukuCadang,
    lowStockItems,
    loading,
    ringkasan,
  };
}
