// Mengambil computed untuk data turunan, ref untuk state, dan onBeforeUnmount untuk membersihkan timer.
import { computed, ref, type Ref } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil router untuk redirect jika token tidak valid.
import { useRouter } from "vue-router";
// Mengambil helper error.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil toast untuk pesan error.
import { useToast } from "@/utils/useToast";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper refresh otomatis saat data berubah.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Mengambil helper status pemesanan mekanik.
import {
  isCompletedOrCancelledStatus,
  mapMekanikFilterToPemesananStatus,
  type MekanikStatusFilter,
} from "@/utils/statusBadge";
// Mengambil helper pagination API.
import { useApiPagination } from "@/composables/useApiPagination";
// Mengambil tipe data pemesanan mekanik.
import type { MekanikPemesanan } from "@/types/pemesanan";

// Tipe tab dashboard mekanik.
type MekanikTab = "active" | "riwayat";

// Opsi tambahan saat fetch data.
interface FetchOptions {
  // Jika true, fetch berjalan diam-diam tanpa loading/toast.
  silent?: boolean;
}

// Fungsi utama untuk mengambil dan mengatur data pemesanan mekanik.
export function useMekanikPemesanan(activeTab: Ref<MekanikTab>) {
  // Router untuk redirect ke beranda jika tidak ada token.
  const router = useRouter();
  // Toast untuk pesan error.
  const toast = useToast();

  // Daftar pekerjaan aktif mekanik.
  const activePemesanan = ref<MekanikPemesanan[]>([]);
  // Daftar riwayat pekerjaan mekanik.
  const riwayatPemesanan = ref<MekanikPemesanan[]>([]);
  // Status loading daftar.
  const loading = ref(false);
  // Filter status pekerjaan aktif.
  const statusFilter = ref<MekanikStatusFilter>("semua");
  const REQUEST_TIMEOUT_MS = 25000;
  const ACTIVE_JOBS_PER_PAGE = 50;

  // Filter tahun riwayat; 0 berarti semua tahun.
  const selectedYear = ref(0);
  // Filter bulan riwayat; 0 berarti semua bulan.
  const selectedMonth = ref(0);

  // Pagination untuk data riwayat.
  const {
    pagination: riwayatPagination,
    setCurrentPage: setRiwayatCurrentPage,
    updateFromApi: updateRiwayatPagination,
  } = useApiPagination(10);

  // Mengambil header token dan redirect jika token tidak tersedia.
  const getValidAuthHeaders = () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      router.push("/");
      return null;
    }
    return headers;
  };

  // Mengambil pekerjaan aktif mekanik dari backend.
  const fetchActiveJobs = async (options: FetchOptions = {}) => {
    // Jika bukan silent, tampilkan loading.
    if (!options.silent) {
      loading.value = true;
    }
    try {
      // Ambil header token.
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      // Ambil semua pemesanan mekanik.
      const response = await axios.get(
        `${API_URL}/mekanik/pemesanan?per_page=${ACTIVE_JOBS_PER_PAGE}`,
        { headers, timeout: REQUEST_TIMEOUT_MS },
      );

      // Simpan hanya pemesanan yang belum selesai/batal.
      activePemesanan.value = response.data.data.filter(
        (pemesanan: MekanikPemesanan) =>
          !isCompletedOrCancelledStatus(pemesanan.status),
      );
    } catch (error: any) {
      // Catat dan tampilkan error jika bukan silent.
      logError(error, "fetchActiveJobs");
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      // Matikan loading jika bukan silent.
      if (!options.silent) {
        loading.value = false;
      }
    }
  };

  // Mengambil riwayat pekerjaan mekanik.
  const fetchRiwayat = async (page = 1, options: FetchOptions = {}) => {
    // Jika bukan silent, tampilkan loading.
    if (!options.silent) {
      loading.value = true;
    }
    try {
      // Ambil header token.
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      // Buat parameter query pagination.
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: riwayatPagination.value.per_page.toString(),
      });

      // Tambahkan filter tahun jika dipilih.
      if (selectedYear.value !== 0) {
        params.append("year", selectedYear.value.toString());
      }

      // Tambahkan filter bulan jika dipilih.
      if (selectedMonth.value !== 0) {
        params.append("month", selectedMonth.value.toString());
      }

      // Ambil data pemesanan mekanik berdasarkan filter.
      const response = await axios.get(
        `${API_URL}/mekanik/pemesanan?${params.toString()}`,
        { headers, timeout: REQUEST_TIMEOUT_MS },
      );

      // Simpan hanya pemesanan yang sudah selesai atau dibatalkan.
      riwayatPemesanan.value = response.data.data.filter(
        (pemesanan: MekanikPemesanan) =>
          isCompletedOrCancelledStatus(pemesanan.status),
      );
      // Update data pagination dari response API.
      updateRiwayatPagination(response.data.meta || response.data);
    } catch (error: any) {
      // Catat dan tampilkan error jika bukan silent.
      logError(error, "fetchRiwayat");
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      // Matikan loading jika bukan silent.
      if (!options.silent) {
        loading.value = false;
      }
    }
  };

  // Mengambil data sesuai tab yang sedang aktif.
  const fetchData = async () => {
    if (activeTab.value === "active") {
      await fetchActiveJobs();
      return;
    }

    await fetchRiwayat(riwayatPagination.value.current_page);
  };

  // Refresh data secara diam-diam saat ada event perubahan data.
  const refreshFromRealtime = async () => {
    if (activeTab.value === "active") {
      await fetchActiveJobs({ silent: true });
    } else {
      await fetchRiwayat(riwayatPagination.value.current_page, { silent: true });
    }

  };

  // Pasang listener refresh realtime.
  useRealtimeRefresh(refreshFromRealtime);

  // Data yang ditampilkan di grid, tergantung tab dan filter status.
  const filteredPemesanan = computed(() => {
    // Jika tab riwayat, langsung tampilkan data riwayat.
    if (activeTab.value === "riwayat") {
      return riwayatPemesanan.value;
    }

    // Jika filter semua, tampilkan semua pekerjaan aktif.
    if (statusFilter.value === "semua") {
      return activePemesanan.value;
    }

    // Ubah filter mekanik menjadi status pemesanan.
    const targetStatus = mapMekanikFilterToPemesananStatus(statusFilter.value);
    // Tampilkan pekerjaan aktif sesuai target status.
    return activePemesanan.value.filter(
      (pemesanan) => pemesanan.status === targetStatus,
    );
  });

  // Handler saat filter riwayat berubah.
  const onFilterChange = () => {
    if (activeTab.value !== "riwayat") {
      return;
    }

    // Reset halaman riwayat ke halaman pertama.
    setRiwayatCurrentPage(1);
    void fetchRiwayat(1);
  };

  // Handler saat pagination berubah.
  const handlePageChange = (page: number) => {
    void fetchRiwayat(page);
  };

  // Kembalikan state dan fungsi ke file .vue.
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
