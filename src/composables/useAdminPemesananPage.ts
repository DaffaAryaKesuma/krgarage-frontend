import { computed, ref } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { PEMESANAN_STATUS, type PemesananStatusFilter } from "@/utils/statusBadge";
import {
  PEMBAYARAN_STATUS,
  type PembayaranStatusFilter,
} from "@/utils/pembayaranStatus";
import { useApiPagination } from "@/composables/useApiPagination";
import type { Pemesanan } from "@/types/pemesanan";
import type { MekanikProfile } from "@/types/user";
import {
  matchesAdminPemesananFilters,
  type AdminPemesananFilterState,
} from "@/composables/helpers/adminPemesananHelpers";

export function useAdminPemesananPage() {
  const toast = useToast();

  const pemesanan = ref<Pemesanan[]>([]);
  const mekaniks = ref<MekanikProfile[]>([]);
  const showTodayOnly = ref(false);
  const { pagination, updateFromApi } = useApiPagination(10);

  const isLoading = ref(true);
  const error = ref("");
  const searchQuery = ref("");
  const monthFilter = ref("");
  const yearFilter = ref(new Date().getFullYear().toString());
  const statusFilter = ref<PemesananStatusFilter>("all");
  const pembayaranFilter = ref<PembayaranStatusFilter>("all");

  const filteredPemesanan = computed(() => {
    const filters: AdminPemesananFilterState = {
      query: searchQuery.value,
      monthFilter: monthFilter.value,
      yearFilter: yearFilter.value,
      statusFilter: statusFilter.value,
      pembayaranFilter: pembayaranFilter.value,
      todayOnly: showTodayOnly.value,
    };

    return pemesanan.value.filter((pemesanan) =>
      matchesAdminPemesananFilters(pemesanan, filters),
    );
  });

  const selectedMekanikForPemesanan = ref<{ [pemesananId: number]: number }>({});

  const mekanikOptions = computed(() =>
    mekaniks.value.map((m) => ({ value: m.id, label: m.nama })),
  );

  const fetchAllPemesanan = async (page = 1) => {
    isLoading.value = true;
    error.value = "";

    try {
      const { data } = await axios.get(
        `${API_URL}/admin/pemesanan?page=${page}&per_page=${pagination.value.per_page}`,
        { headers: getAuthHeaders() },
      );

      pemesanan.value = data.data || [];
      updateFromApi(data);
    } catch (err: any) {
      console.error("Gagal mengambil data pemesanan:", err);
      error.value =
        err.response?.status === 401
          ? "Sesi tidak valid. Silakan login kembali."
          : "Gagal memuat data pemesanan.";
    } finally {
      isLoading.value = false;
    }
  };

  const changeStatus = async (pemesanan: Pemesanan, newStatus: string, catatan?: string) => {
    try {
      const payload: any = { status: newStatus };
      if (catatan) {
        payload.catatan_mekanik = catatan;
      }

      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        payload,
        { headers: getAuthHeaders() },
      );

      pemesanan.status = data.pemesanan?.status ?? newStatus;
      toast.success("Status pemesanan berhasil diubah!");
      await fetchAllPemesanan(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal mengubah status:", err);
      toast.error(
        err.response?.data?.message || "Gagal mengubah status pemesanan.",
      );
    }
  };

  const fetchMekaniks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
      });
      mekaniks.value = data.data || [];
    } catch (err: any) {
      console.error("Gagal mengambil data mekanik:", err);
    }
  };

  const confirmPemesanan = async (pemesanan: Pemesanan) => {
    await changeStatus(pemesanan, PEMESANAN_STATUS.CONFIRMED);
  };

  const cancelPemesanan = async (pemesanan: Pemesanan) => {
    await changeStatus(pemesanan, PEMESANAN_STATUS.CANCELLED);
  };

  const isCompleteModalOpen = ref(false);
  const pemesananToComplete = ref<Pemesanan | null>(null);

  const handleCompleteClick = (pemesanan: Pemesanan) => {
    pemesananToComplete.value = pemesanan;
    isCompleteModalOpen.value = true;
  };

  const handleCompleteConfirm = async (catatan: string) => {
    if (pemesananToComplete.value) {
      await changeStatus(pemesananToComplete.value, PEMESANAN_STATUS.COMPLETED, catatan);
      isCompleteModalOpen.value = false;
      pemesananToComplete.value = null;
    }
  };

  const completePemesanan = async (pemesanan: Pemesanan) => {
    handleCompleteClick(pemesanan);
  };

  const markPemesananAsPaid = async (pemesanan: Pemesanan) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status-pembayaran`,
        { status_pembayaran: PEMBAYARAN_STATUS.PAID },
        { headers: getAuthHeaders() },
      );

      pemesanan.status_pembayaran =
        data.pemesanan?.status_pembayaran || PEMBAYARAN_STATUS.PAID;
      toast.success("Status pembayaran berhasil diperbarui menjadi lunas!");
      await fetchAllPemesanan(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal memperbarui status pembayaran:", err);
      toast.error(
        err.response?.data?.message || "Gagal memperbarui status pembayaran.",
      );
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
        { status: PEMESANAN_STATUS.IN_PROGRESS },
        { headers: getAuthHeaders() },
      );

      toast.success("Mekanik di-assign dan servis dimulai!");
      await fetchAllPemesanan(pagination.value.current_page);
    } catch (err: any) {
      console.error("Gagal assign mekanik dan mulai servis:", err);
      toast.error(err.response?.data?.message || "Gagal memproses pemesanan.");
    }
  };

  return {
    pemesanan,
    showTodayOnly,
    pagination,
    isLoading,
    error,
    searchQuery,
    monthFilter,
    yearFilter,
    statusFilter,
    pembayaranFilter,
    filteredPemesanan,
    selectedMekanikForPemesanan,
    mekanikOptions,
    fetchAllPemesanan,
    fetchMekaniks,
    confirmPemesanan,
    cancelPemesanan,
    completePemesanan,
    markPemesananAsPaid,
    assignMekanikAndStart,
    isCompleteModalOpen,
    handleCompleteClick,
    handleCompleteConfirm,
  };
}
