// Mengambil ref untuk state reaktif dan onMounted untuk aksi saat halaman dibuka.
import { ref, onMounted } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper untuk mencatat error.
import { logError } from "@/utils/errorHandler";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil helper refresh otomatis saat ada perubahan data.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";

// Opsi tambahan saat mengambil data.
interface FetchOptions {
  // Jika true, fetch dilakukan diam-diam tanpa mengubah loading.
  silent?: boolean;
}

// Fungsi utama logika dashboard pemilik.
export function usePemilikDasborPage() {
  // Menyimpan statistik utama dashboard pemilik.
  const statistik = ref({
    pendapatanHariIni: 0,
    pendapatanBulanIni: 0,
    unitHariIni: 0,
    nilaiStok: 0,
    loading: true,
  });

  // Menyimpan data ringkasan operasional/finansial.
  const ringkasan = ref(null);
  // Menyimpan data metrik keuangan.
  const metrik = ref(null);
  // Menyimpan daftar pemesanan terbaru.
  const terbaruPemesanan = ref<any[]>([]);

  // Mengambil semua data dashboard pemilik dari backend.
  const fetchDasborData = async (options: FetchOptions = {}) => {
    try {
      // Ambil header token.
      const headers = getAuthHeaders();

      // Ambil beberapa endpoint dashboard secara bersamaan agar lebih cepat.
      const [statistikRes, pemesananRes, ringkasanRes, metrikRes] =
        await Promise.all([
          axios.get(`${API_URL}/pemilik/statistik`, { headers }),
          axios.get(`${API_URL}/pemilik/pemesanan-terbaru`, { headers }),
          axios.get(`${API_URL}/pemilik/ringkasan`, { headers }),
          axios.get(`${API_URL}/pemilik/metrik-keuangan`, { headers }),
        ]);

      // Simpan statistik utama dari response API.
      statistik.value = {
        pendapatanHariIni:
          statistikRes.data.data?.pendapatan_hari_ini ??
          statistikRes.data.pendapatan_hari_ini ??
          0,
        pendapatanBulanIni:
          statistikRes.data.data?.pendapatan_bulan_ini ??
          statistikRes.data.pendapatan_bulan_ini ??
          0,
        unitHariIni:
          statistikRes.data.data?.unit_hari_ini ??
          statistikRes.data.unit_hari_ini ??
          0,
        nilaiStok:
          statistikRes.data.data?.nilai_stok ??
          statistikRes.data.nilai_stok ??
          0,
        loading: false,
      };

      // Simpan data ringkasan dan metrik.
      ringkasan.value = ringkasanRes.data.data ?? ringkasanRes.data;
      metrik.value = metrikRes.data.data ?? metrikRes.data;

      // Ambil data pemesanan terbaru dari response.
      const pemesanan = pemesananRes.data.data ?? pemesananRes.data;
      // Batasi aktivitas terbaru maksimal 5 data.
      terbaruPemesanan.value = Array.isArray(pemesanan)
        ? pemesanan.slice(0, 5)
        : [];
    } catch (error: any) {
      // Catat error dashboard pemilik.
      logError(error, "fetchDasborData");
      // Jika bukan silent, matikan loading agar halaman tidak menggantung.
      if (!options.silent) {
        statistik.value.loading = false;
      }
    }
  };

  // Ambil data dashboard saat halaman dibuka.
  onMounted(fetchDasborData);

  // Refresh data diam-diam saat ada perubahan data di sistem.
  useRealtimeRefresh(() => fetchDasborData({ silent: true }));

  // Kembalikan state dan fungsi ke file .vue.
  return {
    statistik,
    ringkasan,
    metrik,
    terbaruPemesanan,
    fetchDasborData,
  };
}
