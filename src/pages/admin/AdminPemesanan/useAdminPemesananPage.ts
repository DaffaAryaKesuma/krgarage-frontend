import { computed, ref } from "vue";
// Axios dipakai untuk semua request pemesanan admin.
import axios from "axios";
// Toast untuk menampilkan feedback sukses/gagal.
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import {
  notifyKrGarageDataChanged,
  useRealtimeRefresh,
} from "@/composables/useRealtimeRefresh";
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
} from "@/pages/admin/AdminPemesanan/adminPemesananHelpers";

// Opsi fetch agar refresh realtime bisa diam-diam.
interface FetchOptions {
  silent?: boolean;
}

// Composable utama halaman kelola pemesanan admin.
export function useAdminPemesananPage() {
  const toast = useToast();

  // Data pemesanan dari API.
  const pemesanan = ref<Pemesanan[]>([]);
  // Daftar mekanik untuk dropdown assign.
  const mekaniks = ref<MekanikProfile[]>([]);
  // Filter cepat untuk menampilkan pemesanan hari ini saja.
  const showTodayOnly = ref(false);
  // Helper pagination agar meta dari API mudah dipakai.
  const { pagination, updateFromApi } = useApiPagination(10);

  // Loading dan error utama halaman.
  const isLoading = ref(true);
  const error = ref("");
  // State filter pencarian dan status.
  const searchQuery = ref("");
  const monthFilter = ref("");
  const yearFilter = ref(new Date().getFullYear().toString());
  const statusFilter = ref<PemesananStatusFilter>("semua");
  const pembayaranFilter = ref<PembayaranStatusFilter>("all");

  // Data yang ditampilkan setelah melewati semua filter frontend.
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

  // Menyimpan mekanik pilihan berdasarkan id pemesanan.
  const selectedMekanikForPemesanan = ref<{ [pemesananId: number]: number }>({});

  // Mengubah daftar mekanik menjadi option dropdown.
  const mekanikOptions = computed(() =>
    mekaniks.value.map((m) => ({
      value: m.id,
      label: m.tersedia === false ? `${m.nama} - sedang bertugas` : m.nama,
      disabled: m.tersedia === false,
    })),
  );

  // Mengambil semua pemesanan dari backend dengan pagination.
  const fetchAllPemesanan = async (page = 1, options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    error.value = "";

    try {
      // Query page dan per_page dikirim ke backend.
      const { data } = await axios.get(
        `${API_URL}/admin/pemesanan?page=${page}&per_page=${pagination.value.per_page}`,
        { headers: getAuthHeaders() },
      );

      // Data list disimpan, meta pagination dipindahkan ke helper.
      pemesanan.value = data.data || [];
      updateFromApi(data.meta || data);
    } catch (err: any) {
      console.error("Gagal mengambil data pemesanan:", err);
      if (!options.silent) {
        error.value =
          err.response?.status === 401
            ? "Sesi tidak valid. Silakan login kembali."
            : "Gagal memuat data pemesanan.";
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  // Fungsi umum untuk mengubah status pemesanan.
  const changeStatus = async (pemesanan: Pemesanan, newStatus: string, catatan?: string) => {
    try {
      const payload: any = { status: newStatus };
      // Catatan hanya dikirim saat status selesai membutuhkan catatan mekanik.
      if (catatan) {
        payload.catatan_mekanik = catatan;
      }

      // Endpoint status dipakai untuk konfirmasi, batal, dikerjakan, dan selesai.
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        payload,
        { headers: getAuthHeaders() },
      );

      // Update status lokal dari response backend.
      pemesanan.status = data.pemesanan?.status ?? newStatus;
      toast.success("Status pemesanan berhasil diubah!");
      notifyKrGarageDataChanged();
      await fetchAllPemesanan(pagination.value.current_page, { silent: true });
    } catch (err: any) {
      console.error("Gagal mengubah status:", err);
      toast.error(
        err.response?.data?.message || "Gagal mengubah status pemesanan.",
      );
    }
  };

  // Mengambil daftar mekanik dari backend.
  const fetchMekaniks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
      });
      mekaniks.value = data.data || [];

      // Hapus pilihan lama jika mekanik baru saja menjadi tidak tersedia.
      const mekanikTersedia = new Set(
        mekaniks.value
          .filter((mekanik) => mekanik.tersedia !== false)
          .map((mekanik) => mekanik.id),
      );
      selectedMekanikForPemesanan.value = Object.fromEntries(
        Object.entries(selectedMekanikForPemesanan.value).filter(([, mekanikId]) =>
          mekanikTersedia.has(mekanikId),
        ),
      );
    } catch (err: any) {
      console.error("Gagal mengambil data mekanik:", err);
    }
  };

  // Segarkan pemesanan dan ketersediaan mekanik saat data berubah.
  useRealtimeRefresh(() =>
    Promise.all([
      fetchAllPemesanan(pagination.value.current_page, { silent: true }),
      fetchMekaniks(),
    ]).then(() => undefined),
  );

  // State modal konfirmasi pemesanan.
  const isConfirmModalOpen = ref(false);
  const pemesananToConfirm = ref<Pemesanan | null>(null);

  // Saat tombol konfirmasi diklik, simpan pemesanan target lalu buka modal.
  const handleConfirmClick = (pemesanan: Pemesanan) => {
    pemesananToConfirm.value = pemesanan;
    isConfirmModalOpen.value = true;
  };

  // Setelah user setuju di modal, jalankan confirmPemesanan.
  const handleConfirmConfirm = async () => {
    const targetPemesanan = pemesananToConfirm.value;
    if (targetPemesanan) {
      isConfirmModalOpen.value = false;
      pemesananToConfirm.value = null;
      await confirmPemesanan(targetPemesanan);
    }
  };

  // Mengubah status menjadi Dikonfirmasi.
  const confirmPemesanan = async (pemesanan: Pemesanan) => {
    await changeStatus(pemesanan, PEMESANAN_STATUS.DIKONFIRMASI);
  };

  // Mengubah status menjadi Batal.
  const cancelPemesanan = async (pemesanan: Pemesanan) => {
    await changeStatus(pemesanan, PEMESANAN_STATUS.BATAL);
  };

  // State modal batal.
  const isCancelModalOpen = ref(false);
  const pemesananToCancel = ref<Pemesanan | null>(null);

  // Membuka modal batal untuk pemesanan tertentu.
  const handleCancelClick = (pemesanan: Pemesanan) => {
    pemesananToCancel.value = pemesanan;
    isCancelModalOpen.value = true;
  };

  // Menjalankan batal setelah user mengonfirmasi.
  const handleCancelConfirm = async () => {
    const targetPemesanan = pemesananToCancel.value;
    if (targetPemesanan) {
      isCancelModalOpen.value = false;
      pemesananToCancel.value = null;
      await cancelPemesanan(targetPemesanan);
    }
  };

  // State modal assign mekanik dan mulai servis.
  const isAssignStartModalOpen = ref(false);
  const pemesananToAssignStart = ref<Pemesanan | null>(null);

  // Membuka modal assign/start setelah memastikan mekanik sudah dipilih.
  const handleAssignStartClick = (pemesanan: Pemesanan) => {
    const mekanikId = selectedMekanikForPemesanan.value[pemesanan.id];
    if (!mekanikId) {
      toast.error("Pilih mekanik terlebih dahulu");
      return;
    }

    const mekanikTerpilih = mekaniks.value.find((mekanik) => mekanik.id === mekanikId);
    if (mekanikTerpilih?.tersedia === false) {
      toast.error("Mekanik ini masih memiliki penugasan aktif");
      return;
    }

    pemesananToAssignStart.value = pemesanan;
    isAssignStartModalOpen.value = true;
  };

  // Menjalankan assign mekanik dan ubah status jadi dikerjakan.
  const handleAssignStartConfirm = async () => {
    const targetPemesanan = pemesananToAssignStart.value;
    if (targetPemesanan) {
      isAssignStartModalOpen.value = false;
      pemesananToAssignStart.value = null;
      await assignMekanikAndStart(targetPemesanan);
    }
  };

  // State modal selesai.
  const isCompleteModalOpen = ref(false);
  const pemesananToComplete = ref<Pemesanan | null>(null);

  // Membuka modal catatan saat admin ingin menandai selesai.
  const handleCompleteClick = (pemesanan: Pemesanan) => {
    pemesananToComplete.value = pemesanan;
    isCompleteModalOpen.value = true;
  };

  // Setelah catatan diisi, ubah status menjadi Selesai.
  const handleCompleteConfirm = async (catatan: string) => {
    const targetPemesanan = pemesananToComplete.value;
    if (targetPemesanan) {
      isCompleteModalOpen.value = false;
      pemesananToComplete.value = null;
      await changeStatus(targetPemesanan, PEMESANAN_STATUS.SELESAI, catatan);
    }
  };

  // Wrapper agar event dari kartu tetap mudah dibaca.
  const completePemesanan = async (pemesanan: Pemesanan) => {
    handleCompleteClick(pemesanan);
  };

  // State modal pembayaran lunas.
  const isPaidConfirmOpen = ref(false);
  const pemesananToMarkPaid = ref<Pemesanan | null>(null);

  // Membuka modal konfirmasi lunas.
  const handleMarkPaidClick = (pemesanan: Pemesanan) => {
    pemesananToMarkPaid.value = pemesanan;
    isPaidConfirmOpen.value = true;
  };

  // Menjalankan tandai lunas setelah user mengonfirmasi.
  const handleMarkPaidConfirm = async () => {
    const targetPemesanan = pemesananToMarkPaid.value;
    if (!targetPemesanan) return;
    isPaidConfirmOpen.value = false;
    pemesananToMarkPaid.value = null;
    await markPemesananAsPaid(targetPemesanan);
  };

  // Mengubah status pembayaran pemesanan menjadi Lunas.
  const markPemesananAsPaid = async (pemesanan: Pemesanan) => {
    try {
      // Endpoint khusus status pembayaran, terpisah dari status servis.
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status-pembayaran`,
        { status_pembayaran: PEMBAYARAN_STATUS.PAID },
        { headers: getAuthHeaders() },
      );

      // Update lokal lalu refresh list agar paid_at ikut terbaru.
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

  // Menugaskan mekanik terpilih dan langsung memulai servis.
  const assignMekanikAndStart = async (pemesanan: Pemesanan) => {
    const mekanikId = selectedMekanikForPemesanan.value[pemesanan.id];

    if (!mekanikId) {
      toast.error("Pilih mekanik terlebih dahulu");
      return;
    }

    const mekanikTerpilih =
      mekaniks.value.find((mekanik) => mekanik.id === mekanikId) || null;

    if (mekanikTerpilih?.tersedia === false) {
      toast.error("Mekanik ini masih memiliki penugasan aktif");
      return;
    }

    try {
      // Request pertama menyimpan id mekanik.
      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/tugaskan-mekanik`,
        { id_mekanik: mekanikId },
        { headers: getAuthHeaders() },
      );

      // Request kedua mengubah status servis menjadi Dikerjakan.
      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        { status: PEMESANAN_STATUS.DIKERJAKAN },
        { headers: getAuthHeaders() },
      );

      pemesanan.status = PEMESANAN_STATUS.DIKERJAKAN;
      pemesanan.id_mekanik = mekanikId;
      pemesanan.mekanik = mekanikTerpilih;
      toast.success("Mekanik di-assign dan servis dimulai!");
      // Beri sinyal ke halaman lain agar ikut refresh.
      notifyKrGarageDataChanged();
      await Promise.all([
        fetchAllPemesanan(pagination.value.current_page, { silent: true }),
        fetchMekaniks(),
      ]);
    } catch (err: any) {
      console.error("Gagal assign mekanik dan mulai servis:", err);
      toast.error(err.response?.data?.message || "Gagal memproses pemesanan.");
    }
  };

  // Semua state dan handler yang dipakai oleh AdminPemesanan.vue.
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
    isPaidConfirmOpen,
    handleMarkPaidClick,
    handleMarkPaidConfirm,
    isConfirmModalOpen,
    handleConfirmClick,
    handleConfirmConfirm,
    isCancelModalOpen,
    handleCancelClick,
    handleCancelConfirm,
    isAssignStartModalOpen,
    handleAssignStartClick,
    handleAssignStartConfirm,
  };
}
