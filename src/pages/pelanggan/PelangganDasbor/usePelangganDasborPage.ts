// Mengambil fitur Vue untuk menyimpan data, membuat data turunan, dan menjalankan kode saat halaman dibuka.
import { ref, computed, onMounted } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil helper untuk mencatat error dan mengubah error API menjadi pesan yang mudah dibaca.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil helper toast untuk menampilkan pesan kecil di layar.
import { useToast } from "@/utils/useToast";
// Mengambil alamat API backend, misalnya http://localhost:8000/api.
import { API_URL } from "@/utils/api";
// Mengambil header authorization yang berisi token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper untuk refresh data otomatis saat ada perubahan data.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Mengambil tipe data pemesanan pelanggan.
import type { PelangganPemesanan } from "@/types/pemesanan";
// Mengambil tipe data Vespa.
import type { VespaDetail } from "@/types/vespa";
// Mengambil helper untuk mengecek status pemesanan.
import {
  isStatusMenunggu,
  isStatusDikonfirmasi,
  isStatusDikerjakan,
  isStatusSelesai,
  isStatusBatal,
} from "@/utils/statusBadge";

// Tipe opsi untuk fungsi fetch data dashboard.
interface FetchOptions {
  // Jika true, fetch berjalan diam-diam tanpa loading dan toast error.
  silent?: boolean;
}

// Fungsi utama yang dipakai oleh halaman PelangganDasbor.vue.
export function usePelangganDasborPage() {
  // Menyiapkan toast untuk menampilkan pesan error ke pengguna.
  const toast = useToast();

  // Menyimpan daftar pemesanan pelanggan dari API.
  const pemesananDaftar = ref<PelangganPemesanan[]>([]);
  // Menyimpan daftar Vespa milik pelanggan dari API.
  const vespaDaftar = ref<VespaDetail[]>([]);
  // Menyimpan daftar Vespa yang perlu servis berkala.
  const vespasDueLayanan = ref<any[]>([]);
  // Menandakan apakah halaman sedang mengambil data.
  const isLoading = ref(true);
  // Menyimpan data user yang sedang login, default sementara adalah Guest.
  const user = ref({ nama: "Guest" });

  // Fungsi untuk mengambil semua data yang dibutuhkan dashboard pelanggan.
  const fetchDasborData = async (options: FetchOptions = {}) => {
    // Mengambil header token dari localStorage.
    const headers = getAuthHeaders();
    // Jika header kosong, berarti user belum login atau token tidak tersedia.
    if (!Object.keys(headers).length) {
      // Jika bukan mode silent, matikan loading agar halaman tidak terus menunggu.
      if (!options.silent) {
        isLoading.value = false;
      }
      // Hentikan proses karena endpoint dashboard membutuhkan token.
      return;
    }

    try {
      // Memanggil tiga API sekaligus agar proses lebih cepat.
      const [pemesananResponse, vespaResponse, dueLayananResponse] =
        await Promise.all([
          // Mengambil daftar pemesanan milik pelanggan.
          axios.get(`${API_URL}/pemesanan`, { headers }),
          // Mengambil daftar Vespa milik pelanggan.
          axios.get(`${API_URL}/vespa-saya`, { headers }),
          // Mengambil daftar Vespa yang sudah waktunya servis.
          axios.get(`${API_URL}/vespa-saya/perlu-servis`, { headers }),
        ]);

      // Menyimpan data pemesanan; beberapa API membungkus data dalam properti data.
      pemesananDaftar.value =
        pemesananResponse.data.data || pemesananResponse.data;
      // Menyimpan data Vespa.
      vespaDaftar.value = vespaResponse.data.data || vespaResponse.data;
      // Menyimpan data Vespa yang perlu servis.
      vespasDueLayanan.value =
        dueLayananResponse.data.data || dueLayananResponse.data;
    } catch (error: any) {
      // Mencatat error ke console untuk membantu debugging.
      logError(error, "fetchDasborData");
      // Jika bukan mode silent, tampilkan pesan error kepada pengguna.
      if (!options.silent) {
        toast.error(handleApiError(error));
      }
    } finally {
      // Bagian ini tetap berjalan baik request sukses maupun gagal.
      if (!options.silent) {
        // Jika bukan mode silent, matikan loading setelah proses selesai.
        isLoading.value = false;
      }
    }
  };

  // Refresh data dashboard secara diam-diam saat sistem mendeteksi ada perubahan data.
  useRealtimeRefresh(() => fetchDasborData({ silent: true }));

  // Data turunan untuk pemesanan yang masih aktif atau akan datang.
  const upcomingPemesanan = computed(() =>
    pemesananDaftar.value
      // Ambil pemesanan dengan status Menunggu, Dikonfirmasi, atau Dikerjakan.
      .filter(
        (p) =>
          isStatusMenunggu(p.status) ||
          isStatusDikonfirmasi(p.status) ||
          isStatusDikerjakan(p.status),
      )
      // Batasi hanya tiga data pertama untuk ditampilkan di dashboard.
      .slice(0, 3),
  );

  // Data turunan untuk riwayat pemesanan terbaru.
  const terbaruPemesanan = computed(() =>
    pemesananDaftar.value
      // Ambil pemesanan yang sudah selesai atau dibatalkan.
      .filter((p) => isStatusSelesai(p.status) || isStatusBatal(p.status))
      // Batasi hanya tiga data pertama untuk ditampilkan di dashboard.
      .slice(0, 3),
  );

  // Jalankan kode ini saat halaman dashboard pelanggan pertama kali dibuka.
  onMounted(async () => {
    // Ambil data user dari localStorage.
    const storedUser = localStorage.getItem("user");
    // Jika data user tersedia, ubah dari string JSON menjadi object.
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
    // Setelah user dibaca, ambil data dashboard dari API.
    await fetchDasborData();
  });

  // Mengembalikan data dan fungsi agar bisa digunakan oleh PelangganDasbor.vue.
  return {
    // Data user login.
    user,
    // Semua data pemesanan pelanggan.
    pemesananDaftar,
    // Semua data Vespa pelanggan.
    vespaDaftar,
    // Vespa yang perlu servis berkala.
    vespasDueLayanan,
    // Status loading halaman.
    isLoading,
    // Pemesanan aktif/mendatang hasil filter.
    upcomingPemesanan,
    // Riwayat pemesanan terbaru hasil filter.
    terbaruPemesanan,
    // Fungsi untuk mengambil ulang data dashboard.
    fetchDasborData,
  };
}
