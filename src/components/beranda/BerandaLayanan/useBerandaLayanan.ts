// ref menyimpan data layanan dan status loading, onMounted menjalankan fetch saat komponen tampil.
import { ref, onMounted } from "vue";
// Axios dipakai untuk mengambil data layanan publik dari backend.
import axios from "axios";
// Helper mengubah path gambar menjadi URL lengkap.
import { getImageUrl } from "@/utils/format";
// Base URL API backend.
import { API_URL } from "@/utils/api";
// Helper error agar pesan gagal fetch rapi.
import { handleApiError, logError } from "@/utils/errorHandler";
// Toast dipakai untuk menampilkan error ke user.
import { useToast } from "@/utils/useToast";

// Tipe layanan yang ditampilkan di landing page.
export type Layanan = {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string;
};

// Composable untuk mengambil daftar layanan pada halaman beranda.
export function useBerandaLayanan() {
  // Instance toast global.
  const toast = useToast();
  // Daftar layanan dari API.
  const layanan = ref<Layanan[]>([]);
  // Loading aktif saat request berjalan.
  const isLoading = ref(true);

  // Mengambil katalog layanan dari backend.
  const fetchLayanan = async () => {
    isLoading.value = true;
    try {
      // Endpoint publik layanan.
      const response = await axios.get(`${API_URL}/layanan`);
      // Gambar dirapikan menjadi URL lengkap agar bisa dipakai di <img>.
      layanan.value = (response.data || []).map((s: any) => ({
        ...s,
        gambar: getImageUrl(s.gambar, API_URL),
      }));
    } catch (error: any) {
      // Jika gagal, catat error dan tampilkan toast.
      logError(error, "fetchLayanan");
      toast.error(handleApiError(error));
    } finally {
      // Loading selalu dimatikan setelah request selesai.
      isLoading.value = false;
    }
  };

  // Fetch otomatis saat section layanan dimount.
  onMounted(fetchLayanan);

  // Data ini dipakai oleh BerandaLayanan.vue.
  return { layanan, isLoading };
}
