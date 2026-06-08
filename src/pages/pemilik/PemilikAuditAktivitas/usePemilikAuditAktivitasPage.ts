import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { getYearOptions } from "@/utils/dateFilters";
import { logError } from "@/utils/errorHandler";
import type { AuditActorRole, AuditModulKey, LogAktivitas } from "@/types/inventaris";

export function usePemilikAuditAktivitasPage() {
  const YEAR_OPTIONS = computed(() =>
    getYearOptions(6).map((opt) => Number(opt.value)),
  );

  const selectedMonth = ref(new Date().getMonth() + 1);
  const selectedYear = ref(new Date().getFullYear());
  const selectedModul = ref<AuditModulKey>("semua");
  const selectedRole = ref<AuditActorRole>("semua");
  const logs = ref<LogAktivitas[]>([]);
  const loading = ref(true);
  const auditCurrentPage = ref(1);
  const auditItemsPerPage = 10;

  const fetchLogs = async () => {
    loading.value = true;

    try {
      const headers = getAuthHeaders();
      const params = {
        month: selectedMonth.value,
        year: selectedYear.value,
        modul: selectedModul.value,
        role: selectedRole.value,
      };

      const response = await axios.get(`${API_URL}/pemilik/log-aktivitas`, {
        headers,
        params,
      });

      logs.value = response.data.data ?? response.data;
    } catch (error: any) {
      logError(error, "fetchAuditAktivitas");
      logs.value = [];
    } finally {
      loading.value = false;
    }
  };

  watch([selectedMonth, selectedYear, selectedModul, selectedRole], () => {
    auditCurrentPage.value = 1;
    fetchLogs();
  });
  onMounted(fetchLogs);

  return {
    YEAR_OPTIONS,
    selectedMonth,
    selectedYear,
    selectedModul,
    selectedRole,
    logs,
    loading,
    auditCurrentPage,
    auditItemsPerPage,
  };
}
