// Mengambil ref untuk state reaktif dan onMounted untuk aksi saat halaman dibuka.
import { ref, onMounted } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil toast untuk pesan sukses/error.
import { useToast } from "@/utils/useToast";
// Mengambil helper error.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper pagination API.
import { useApiPagination } from "@/composables/useApiPagination";
// Mengambil helper refresh otomatis.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Mengambil tipe data pemesanan pelanggan.
import type { PelangganPemesanan } from "@/types/pemesanan";

// Opsi tambahan untuk fetch data.
interface FetchOptions {
  // Jika true, fetch dilakukan tanpa loading dan toast error.
  silent?: boolean;
}

// Fungsi utama logika halaman riwayat pelanggan.
export function usePelangganRiwayatPage() {
  // Menyiapkan toast.
  const toast = useToast();

  // Menyimpan daftar pemesanan dari API.
  const list = ref<PelangganPemesanan[]>([]);
  // Menyimpan status loading.
  const isLoading = ref(true);
  // Menyimpan ID pemesanan yang sedang diproses pembatalan.
  const cancelling = ref<number | null>(null);
  // Menentukan apakah modal konfirmasi tampil.
  const showConfirmDialog = ref(false);
  // Menyimpan ID pemesanan yang akan dibatalkan.
  const pemesananToCancel = ref<number | null>(null);

  // Filter bulan default adalah bulan sekarang.
  const selectedMonth = ref<number>(new Date().getMonth() + 1);
  // Filter tahun default adalah tahun sekarang.
  const selectedYear = ref<number>(new Date().getFullYear());
  // Menyiapkan pagination dengan 10 data per halaman.
  const { pagination, setCurrentPage, updateFromApi } = useApiPagination(10);

  // Mengambil data riwayat pemesanan dari backend.
  const fetchPemesanan = async (page = 1, options: FetchOptions = {}) => {
    // Jika bukan silent, tampilkan loading.
    if (!options.silent) {
      isLoading.value = true;
    }
    // Ambil header token.
    const headers = getAuthHeaders();

    // Jika token tidak ada, hentikan proses.
    if (!Object.keys(headers).length) {
      if (!options.silent) {
        isLoading.value = false;
      }
      return;
    }

    try {
      // Panggil API pemesanan dengan pagination, bulan, dan tahun.
      const { data } = await axios.get(
        `${API_URL}/pemesanan?page=${page}&per_page=${pagination.value.per_page}&month=${selectedMonth.value}&year=${selectedYear.value}`,
        { headers },
      );

      // Simpan daftar data dari response API.
      list.value = data.data;
      // Update informasi pagination dari response API.
      updateFromApi(data.meta || data);
    } catch (error) {
      // Catat error untuk debugging.
      logError(error, "fetchPemesanan");
      // Jika bukan silent, tampilkan pesan error.
      if (!options.silent) {
        toast.error("Gagal memuat riwayat pemesanan.");
      }
    } finally {
      // Matikan loading jika bukan silent.
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  // Refresh data diam-diam saat ada perubahan data di sistem.
  useRealtimeRefresh(
    () => fetchPemesanan(pagination.value.current_page, { silent: true }),
  );

  // Membuka modal konfirmasi pembatalan pemesanan.
  const cancelPemesanan = (pemesananId: number) => {
    pemesananToCancel.value = pemesananId;
    showConfirmDialog.value = true;
  };

  // Menjalankan pembatalan pemesanan setelah user konfirmasi.
  const handleConfirmCancel = async () => {
    // Tutup dialog konfirmasi.
    showConfirmDialog.value = false;
    // Jika tidak ada target pemesanan, hentikan proses.
    if (!pemesananToCancel.value) return;

    // Simpan ID yang akan dibatalkan.
    const pemesananId = pemesananToCancel.value;
    // Tandai kartu sedang diproses.
    cancelling.value = pemesananId;
    // Ambil header token.
    const headers = getAuthHeaders();

    try {
      // Kirim request pembatalan ke backend.
      await axios.post(
        `${API_URL}/pemesanan/${pemesananId}/batalkan`,
        {},
        { headers },
      );

      // Tampilkan pesan sukses dan reload data dari halaman pertama.
      toast.success("Pemesanan berhasil dibatalkan");
      await fetchPemesanan(1);
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "cancelPemesanan");
      toast.error(handleApiError(error));
    } finally {
      // Bersihkan status proses pembatalan.
      cancelling.value = null;
      pemesananToCancel.value = null;
    }
  };

  // Menutup dialog konfirmasi tanpa membatalkan pemesanan.
  const handleCancelDialog = () => {
    showConfirmDialog.value = false;
    pemesananToCancel.value = null;
  };

  // Saat filter berubah, kembali ke halaman pertama lalu fetch ulang data.
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchPemesanan(1);
  };

  // Ambil data riwayat saat halaman pertama kali dibuka.
  onMounted(() => fetchPemesanan());

  // Kembalikan state dan fungsi ke file .vue.
  return {
    list,
    isLoading,
    cancelling,
    showConfirmDialog,
    selectedMonth,
    selectedYear,
    pagination,
    fetchPemesanan,
    cancelPemesanan,
    handleConfirmCancel,
    handleCancelDialog,
    handleFilterChange,
  };
}
