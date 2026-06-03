import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { PelangganPemesanan } from "@/types/pemesanan";
import type { VespaDetail } from "@/types/vespa";
import {
  isStatusMenunggu,
  isStatusDikonfirmasi,
  isStatusDikerjakan,
  isStatusSelesai,
  isStatusBatal,
} from "@/utils/statusBadge";

interface FetchOptions {
  silent?: boolean;
}

export function usePelangganDasborPage() {
  const toast = useToast();

  const pemesananDaftar = ref<PelangganPemesanan[]>([]);
  const vespaDaftar = ref<VespaDetail[]>([]);
  const vespasDueLayanan = ref<any[]>([]);
  const isLoading = ref(true);
  const user = ref({ nama: "Guest" });

  const fetchDasborData = async (options: FetchOptions = {}) => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      if (!options.silent) {
        isLoading.value = false;
      }
      return;
    }

    try {
      const [pemesananResponse, vespaResponse, dueLayananResponse] =
        await Promise.all([
          axios.get(`${API_URL}/pemesanan`, { headers }),
          axios.get(`${API_URL}/vespa-saya`, { headers }),
          axios.get(`${API_URL}/vespa-saya/perlu-servis`, { headers }),
        ]);

      pemesananDaftar.value =
        pemesananResponse.data.data || pemesananResponse.data;
      vespaDaftar.value = vespaResponse.data.data || vespaResponse.data;
      vespasDueLayanan.value =
        dueLayananResponse.data.data || dueLayananResponse.data;
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

  const upcomingPemesanan = computed(() =>
    pemesananDaftar.value
      .filter(
        (p) =>
          isStatusMenunggu(p.status) ||
          isStatusDikonfirmasi(p.status) ||
          isStatusDikerjakan(p.status),
      )
      .slice(0, 3),
  );

  const terbaruPemesanan = computed(() =>
    pemesananDaftar.value
      .filter((p) => isStatusSelesai(p.status) || isStatusBatal(p.status))
      .slice(0, 3),
  );

  onMounted(async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
    await fetchDasborData();
  });

  return {
    user,
    pemesananDaftar,
    vespaDaftar,
    vespasDueLayanan,
    isLoading,
    upcomingPemesanan,
    terbaruPemesanan,
    fetchDasborData,
  };
}
