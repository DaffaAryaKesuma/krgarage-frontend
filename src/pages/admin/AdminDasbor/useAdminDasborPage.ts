import { computed, onMounted, ref } from "vue";
// Axios dipakai untuk request API ke backend Laravel.
import axios from "axios";
// Helper untuk menampilkan tanggal pendek di subtitle halaman.
import { formatDateShort } from "@/utils/date";
// Toast dipakai untuk pesan sukses/gagal ke pengguna.
import { useToast } from "@/utils/useToast";
// Helper error agar pesan error API lebih konsisten.
import { handleApiError, logError } from "@/utils/errorHandler";
// Base URL API backend.
import { API_URL } from "@/utils/api";
// Header Authorization berisi token login.
import { getAuthHeaders } from "@/utils/auth";
import {
  notifyKrGarageDataChanged,
  useRealtimeRefresh,
} from "@/composables/useRealtimeRefresh";
import { PEMESANAN_STATUS } from "@/utils/statusBadge";
import { PEMBAYARAN_STATUS } from "@/utils/pembayaranStatus";
import type { Pemesanan, MekanikOption } from "@/types/pemesanan";
import type { MekanikProfile } from "@/types/user";

// Bentuk data statistik yang dikirim endpoint dasbor admin.
interface DasborStatistik {
  pemesanan_hari_ini: number;
  sedang_dikerjakan: number;
  selesai_hari_ini: number;
}

// Opsi fetch agar refresh realtime bisa berjalan tanpa loading besar.
interface FetchOptions {
  silent?: boolean;
}

// Composable utama halaman dasbor admin.
export function useAdminDasborPage() {
  // Membuat instance toast untuk pesan notifikasi UI.
  const toast = useToast();

  // State loading utama halaman.
  const isLoading = ref(true);
  // Data angka ringkasan dasbor.
  const statistik = ref<DasborStatistik>({
    pemesanan_hari_ini: 0,
    sedang_dikerjakan: 0,
    selesai_hari_ini: 0,
  });
  // Jumlah suku cadang yang stoknya menipis.
  const lowStockCount = ref(0);
  // Daftar pemesanan terbaru yang tampil di dasbor.
  const terbaruPemesanan = ref<Pemesanan[]>([]);
  // Tanggal sekarang untuk subtitle header.
  const currentDate = ref("");
  // Daftar mekanik dari API.
  const mekaniks = ref<MekanikProfile[]>([]);
  // Menyimpan mekanik terpilih per id pemesanan.
  const selectedMekanikForPemesanan = ref<Record<number, number>>({});
  // Batas waktu request dashboard agar loading tidak menggantung terlalu lama.
  const REQUEST_TIMEOUT_MS = 15000;

  // Mengubah data mekanik mentah menjadi option untuk dropdown/select.
  const mekanikOptions = computed<MekanikOption[]>(() =>
    mekaniks.value.map((mekanik) => ({
      value: mekanik.id,
      label:
        mekanik.tersedia === false
          ? `${mekanik.nama} - sedang bertugas`
          : mekanik.nama,
      disabled: mekanik.tersedia === false,
    })),
  );

  // Mengambil statistik ringkas dari backend.
  const fetchDasborStatistik = async (notifyOnError = true) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/dashboard/statistik`, {
        headers: getAuthHeaders(),
        timeout: REQUEST_TIMEOUT_MS,
      });

      // Data langsung dimasukkan ke state agar kartu statistik ikut berubah.
      statistik.value = data;
    } catch (error: any) {
      logError(error, "fetchDasborStatistik");
      if (notifyOnError) {
        toast.error(handleApiError(error));
      }
    }
  };

  // Mengambil daftar mekanik untuk kebutuhan assign pemesanan.
  const fetchMekaniks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
        timeout: REQUEST_TIMEOUT_MS,
      });
      // Backend mengembalikan data di dalam properti data.
      mekaniks.value = data.data || [];
    } catch (error: any) {
      logError(error, "fetchMekaniks");
      toast.error(handleApiError(error));
    }
  };

  // Mengambil data utama dasbor: pemesanan terbaru dan stok menipis.
  const fetchDasborData = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    try {
      const requestConfig = {
        headers: getAuthHeaders(),
        timeout: REQUEST_TIMEOUT_MS,
      };

      // Promise.allSettled membuat halaman tetap tampil walau salah satu endpoint lambat/gagal.
      const [pemesananResult, lowStockResult] = await Promise.allSettled([
        axios.get(`${API_URL}/admin/dashboard/pemesanan-terbaru`, {
          ...requestConfig,
        }),
        axios.get(`${API_URL}/admin/inventori/stok-menipis`, {
          ...requestConfig,
        }),
      ]);

      if (pemesananResult.status === "fulfilled") {
        terbaruPemesanan.value = pemesananResult.value.data;
      } else {
        logError(pemesananResult.reason, "fetchDasborData:pemesananTerbaru");
      }

      if (lowStockResult.status === "fulfilled") {
        lowStockCount.value = lowStockResult.value.data.data?.length || 0;
      } else {
        logError(lowStockResult.reason, "fetchDasborData:stokMenipis");
      }

      // Statistik juga disegarkan setelah data utama berhasil.
      await fetchDasborStatistik(false);
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

  // Saat ada sinyal data berubah dari halaman lain, dasbor refresh diam-diam.
  useRealtimeRefresh(() => fetchDasborData({ silent: true }));

  // Mengubah status servis dari pemesanan tertentu.
  const changeStatus = async (pemesanan: Pemesanan, statusBaru: string, catatan?: string) => {
    try {
      const payload: Record<string, string> = { status: statusBaru };
      // Catatan mekanik hanya dikirim kalau memang ada isinya.
      if (catatan) payload.catatan_mekanik = catatan;

      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        payload,
        { headers: getAuthHeaders() },
      );

      pemesanan.status = statusBaru;
      toast.success("Status pemesanan berhasil diubah!");
      notifyKrGarageDataChanged();
      await fetchDasborData({ silent: true });
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "changeStatus");
      toast.error(handleApiError(error));
    }
  };

  // Menugaskan mekanik lalu langsung mengubah status menjadi dikerjakan.
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
      // Request pertama: simpan mekanik yang ditugaskan.
      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/tugaskan-mekanik`,
        { id_mekanik: mekanikId },
        { headers: getAuthHeaders() },
      );

      // Request kedua: mulai pekerjaan dengan status Dikerjakan.
      await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status`,
        { status: PEMESANAN_STATUS.DIKERJAKAN },
        { headers: getAuthHeaders() },
      );

      pemesanan.status = PEMESANAN_STATUS.DIKERJAKAN;
      pemesanan.id_mekanik = mekanikId;
      pemesanan.mekanik = mekanikTerpilih;
      toast.success("Mekanik di-assign dan servis dimulai!");
      // Memberi tahu halaman lain bahwa data KRGarage berubah.
      notifyKrGarageDataChanged();
      await fetchDasborData({ silent: true });
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "assignMekanikAndStart");
      toast.error(handleApiError(error));
    }
  };

  // Mengubah status pembayaran, misalnya dari Belum Lunas menjadi Lunas.
  const changePembayaranStatus = async (pemesanan: Pemesanan, statusBaru: string) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/pemesanan/${pemesanan.id}/status-pembayaran`,
        { status_pembayaran: statusBaru },
        { headers: getAuthHeaders() },
      );

      // Ambil status terbaru dari response backend, fallback ke status yang diminta.
      pemesanan.status_pembayaran =
        data.data?.status_pembayaran || data.pemesanan?.status_pembayaran || statusBaru || PEMBAYARAN_STATUS.PAID;
      toast.success("Status pembayaran berhasil diperbarui menjadi lunas!");
      await fetchDasborStatistik(false);
    } catch (error: any) {
      logError(error, "changePembayaranStatus");
      toast.error(handleApiError(error));
    }
  };

  // Saat halaman pertama kali dibuka, ambil semua data awal.
  onMounted(() => {
    fetchDasborData();
    fetchMekaniks();
    currentDate.value = formatDateShort(new Date());
  });

  // Semua yang direturn di sini bisa dipakai oleh file .vue.
  return {
    isLoading,
    statistik,
    lowStockCount,
    terbaruPemesanan,
    currentDate,
    mekanikOptions,
    selectedMekanikForPemesanan,
    fetchDasborStatistik,
    fetchDasborData,
    fetchMekaniks,
    changeStatus,
    assignMekanikAndStart,
    changePembayaranStatus,
  };
}
