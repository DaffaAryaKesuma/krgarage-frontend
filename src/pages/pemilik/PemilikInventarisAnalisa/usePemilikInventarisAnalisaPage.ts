// Mengambil ref untuk state, computed untuk data turunan, watch untuk memantau perubahan, dan onMounted saat halaman dibuka.
import { ref, computed, watch, onMounted } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper untuk mencatat error.
import { logError } from "@/utils/errorHandler";
// Mengambil helper pilihan tahun.
import { getYearOptions } from "@/utils/dateFilters";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";

// Fungsi utama logika halaman analisis inventaris pemilik.
export function usePemilikInventarisAnalisaPage() {
  // Membuat daftar pilihan tahun, misalnya 6 tahun terakhir.
  const YEAR_OPTIONS = computed(() =>
    getYearOptions(6).map((opt) => Number(opt.value)),
  );

  // Bulan default adalah bulan saat ini.
  const selectedMonth = ref(new Date().getMonth() + 1);
  // Tahun default adalah tahun saat ini.
  const selectedYear = ref(new Date().getFullYear());

  // Menyimpan layanan terpopuler.
  const topLayanan = ref<any[]>([]);
  // Menyimpan suku cadang terlaris.
  const topSukuCadang = ref<any[]>([]);
  // Menyimpan barang dengan stok menipis.
  const lowStockItems = ref<any[]>([]);
  // Status loading halaman.
  const loading = ref(true);

  // Ringkasan angka hasil analisa.
  const ringkasan = ref({
    totalLayanan: 0,
    totalSukuCadang: 0,
    lowStockCount: 0,
  });

  // Mengambil data analisis inventaris dari backend.
  const fetchInventarisAnalisa = async () => {
    // Aktifkan loading sebelum request.
    loading.value = true;
    try {
      // Ambil header token.
      const headers = getAuthHeaders();
      // Parameter bulan dan tahun untuk API.
      const params = {
        month: selectedMonth.value,
        year: selectedYear.value,
      };

      // Ambil layanan terpopuler, suku cadang terlaris, dan stok menipis sekaligus.
      const [layananRes, sukucadangRes, lowStockRes] = await Promise.all([
        axios.get(`${API_URL}/pemilik/layanan-terpopuler`, { headers, params }),
        axios.get(`${API_URL}/pemilik/suku-cadang-terlaris`, { headers, params }),
        axios.get(`${API_URL}/pemilik/stok-menipis`, { headers }),
      ]);

      // Simpan data layanan terpopuler.
      topLayanan.value = layananRes.data.data ?? layananRes.data;
      // Simpan data suku cadang terlaris.
      topSukuCadang.value = sukucadangRes.data.data ?? sukucadangRes.data;
      // Simpan data stok menipis.
      lowStockItems.value = lowStockRes.data.data ?? lowStockRes.data;

      // Hitung ringkasan dari data yang sudah diambil.
      ringkasan.value = {
        // Total pemesanan layanan dari semua layanan terpopuler.
        totalLayanan: Array.isArray(topLayanan.value)
          ? topLayanan.value.reduce(
              (sum, s) => sum + parseInt(s.total || s.total_pemesanan || 0),
              0,
            )
          : 0,
        // Total suku cadang yang terjual/digunakan.
        totalSukuCadang: Array.isArray(topSukuCadang.value)
          ? topSukuCadang.value.reduce(
              (sum, s) => sum + parseInt(s.total_terjual || 0),
              0,
            )
          : 0,
        // Jumlah item yang stoknya menipis.
        lowStockCount: Array.isArray(lowStockItems.value)
          ? lowStockItems.value.length
          : 0,
      };
    } catch (error: any) {
      // Catat error jika API gagal.
      logError(error, "fetchInventarisData");
    } finally {
      // Matikan loading setelah proses selesai.
      loading.value = false;
    }
  };

  // Jika bulan atau tahun berubah, ambil ulang data analisa.
  watch([selectedMonth, selectedYear], () => {
    fetchInventarisAnalisa();
  });

  // Ambil data saat halaman pertama kali dibuka.
  onMounted(fetchInventarisAnalisa);

  // Kembalikan state agar bisa dipakai oleh file .vue.
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
