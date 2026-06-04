import { ref, onMounted } from "vue";
// Axios untuk request laporan keuangan.
import axios from "axios";
// Helper error agar pesan error API konsisten.
import { logError, handleApiError } from "@/utils/errorHandler";
// Toast untuk feedback jika gagal memuat data.
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
// Dipakai agar laporan ikut refresh saat data transaksi berubah.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { KeuanganPemesanan } from "@/types/pemesanan";

// Bentuk ringkasan yang dikembalikan backend.
export interface Ringkasan {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

// Bentuk data grafik bulanan.
export interface MonthlyData {
  bulan: number;
  pendapatan: string;
}

// Opsi fetch untuk refresh diam-diam tanpa loading penuh.
interface FetchOptions {
  silent?: boolean;
}

// Composable utama halaman laporan keuangan admin.
export function useAdminKeuanganLaporanPage() {
  const toast = useToast();

  // Default filter tahun adalah tahun saat ini.
  const selectedYear = ref(new Date().getFullYear());
  // Default filter bulan adalah bulan saat ini.
  const selectedMonth = ref<number | string>(new Date().getMonth() + 1);
  // Loading utama halaman.
  const isLoading = ref(true);

  // Nilai awal ringkasan sebelum data API datang.
  const ringkasan = ref<Ringkasan>({
    total_pendapatan: 0,
    total_pemesanan: 0,
    rata_rata_nilai_pesan: 0,
  });

  // Data untuk grafik pendapatan bulanan.
  const monthlyData = ref<MonthlyData[]>([]);
  // Data layanan paling populer/teratas.
  const topLayanan = ref<any[]>([]);
  // Daftar transaksi pemesanan pada laporan.
  const pemesanan = ref<KeuanganPemesanan[]>([]);

  // Mengambil laporan sesuai filter tahun dan bulan.
  const fetchLaporan = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }
    try {
      // Params dikirim sebagai query string, contoh: ?year=2026&month=6.
      const params = {
        year: selectedYear.value,
        // Month hanya dikirim kalau ada nilainya.
        ...(selectedMonth.value && { month: selectedMonth.value }),
      };

      const { data } = await axios.get(`${API_URL}/admin/laporan/keuangan`, {
        params,
        headers: getAuthHeaders(),
      });

      // Response backend dipecah ke state sesuai komponen yang membutuhkan.
      ringkasan.value = data.ringkasan;
      monthlyData.value = data.data_bulanan;
      topLayanan.value = data.layanan_terpopuler;
      pemesanan.value = data.pemesanan;
    } catch (error: any) {
      logError(error, "fetchLaporan");
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  // Refresh laporan diam-diam jika ada perubahan data global.
  useRealtimeRefresh(() => fetchLaporan({ silent: true }));

  // Ambil laporan pertama kali saat halaman dibuka.
  onMounted(() => fetchLaporan());

  // State dan aksi yang dipakai oleh file .vue.
  return {
    selectedYear,
    selectedMonth,
    isLoading,
    ringkasan,
    monthlyData,
    topLayanan,
    pemesanan,
    fetchLaporan,
  };
}
