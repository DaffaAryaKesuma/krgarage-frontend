// Mengambil ref untuk state, computed untuk data turunan, dan onMounted untuk aksi saat halaman dibuka.
import { ref, computed, onMounted } from "vue";
// Mengambil route aktif untuk membaca id pemesanan dari URL.
import { useRoute } from "vue-router";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil toast untuk pesan sukses/error.
import { useToast } from "@/utils/useToast";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper error.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil helper untuk memastikan nilai uang menjadi angka.
import { toMoneyNumber } from "@/utils/money";
// Mengambil helper untuk mengecek apakah pelanggan masih boleh membatalkan pemesanan.
import { canPelangganCancelPemesanan } from "@/utils/statusBadge";
// Mengambil helper refresh otomatis saat ada perubahan data.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Mengambil tipe data pemesanan detail.
import type { Pemesanan } from "@/types/pemesanan";

// Opsi tambahan untuk fetch data.
interface FetchOptions {
  // Jika true, fetch dilakukan diam-diam tanpa loading/error besar.
  silent?: boolean;
}

// Fungsi utama logika halaman detail pemesanan pelanggan.
export function usePelangganPemesananDetailPage() {
  // Route digunakan untuk mengambil parameter id dari URL.
  const route = useRoute();
  // Toast digunakan untuk pesan sukses/error.
  const toast = useToast();

  // Menyimpan data detail pemesanan.
  const pemesanan = ref<Pemesanan | null>(null);
  // Status loading detail.
  const isLoading = ref(true);
  // Status ketika pembatalan sedang diproses.
  const isCancelling = ref(false);
  // Menentukan apakah modal konfirmasi batal tampil.
  const showCancelConfirm = ref(false);
  // Menyimpan pesan error ketika detail gagal dimuat.
  const errorMessage = ref("");

  // Mengambil id pemesanan dari URL dan mengubahnya menjadi number.
  const pemesananId = computed(() => Number(route.params.id));

  // Mengambil harga layanan snapshot saat pemesanan dibuat.
  const getLayananSnapshotPrice = (layanan: Pemesanan["layanan"][number]) =>
    toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0);

  // Menghitung total harga layanan.
  const totalLayanan = computed(
    () =>
      pemesanan.value?.layanan?.reduce(
        (sum, layanan) => sum + getLayananSnapshotPrice(layanan),
        0,
      ) || 0,
  );

  // Menghitung total harga suku cadang.
  const totalSukuCadang = computed(
    () =>
      pemesanan.value?.item_pemesanan?.reduce(
        (sum, item) => sum + toMoneyNumber(item.harga_saat_ini) * item.jumlah,
        0,
      ) || 0,
  );

  // Menghitung total biaya akhir.
  const totalBiaya = computed(() => {
    // Ambil total_harga dari backend jika tersedia.
    const rawTotal = pemesanan.value?.total_harga;
    // Jika total_harga kosong, hitung manual dari layanan + suku cadang.
    if (rawTotal === null || rawTotal === undefined) {
      return totalLayanan.value + totalSukuCadang.value;
    }
    // Jika tersedia, pastikan nilainya berbentuk number.
    return toMoneyNumber(rawTotal);
  });

  // Menentukan apakah tombol batal boleh tampil.
  const canCancel = computed(() =>
    canPelangganCancelPemesanan(pemesanan.value?.status || null),
  );

  // Mengambil detail pemesanan dari backend.
  const fetchPemesananDetail = async (options: FetchOptions = {}) => {
    // Jika bukan silent, tampilkan loading dan kosongkan error lama.
    if (!options.silent) {
      isLoading.value = true;
      errorMessage.value = "";
    }

    // Validasi id pemesanan dari URL.
    if (!Number.isFinite(pemesananId.value) || pemesananId.value <= 0) {
      if (!options.silent) {
        errorMessage.value = "ID pemesanan tidak valid.";
        isLoading.value = false;
      }
      return;
    }

    // Ambil header token.
    const headers = getAuthHeaders();
    // Jika token tidak tersedia, hentikan proses.
    if (!Object.keys(headers).length) {
      if (!options.silent) {
        isLoading.value = false;
      }
      return;
    }

    try {
      // Panggil endpoint detail pemesanan pelanggan.
      const { data } = await axios.get(
        `${API_URL}/pemesanan/${pemesananId.value}`,
        { headers },
      );
      // Simpan data detail dari response.
      pemesanan.value = data?.data || data;
    } catch (error: any) {
      // Catat error untuk debugging.
      logError(error, "fetchPemesananDetail");
      // Jika bukan silent, tampilkan error di halaman.
      if (!options.silent) {
        errorMessage.value = handleApiError(error);
      }
    } finally {
      // Jika bukan silent, matikan loading.
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  // Refresh detail secara diam-diam saat ada perubahan data.
  useRealtimeRefresh(() => fetchPemesananDetail({ silent: true }));

  // Menjalankan pembatalan pemesanan setelah user konfirmasi.
  const handleConfirmCancel = async () => {
    // Jika data belum ada atau sedang membatalkan, hentikan proses.
    if (!pemesanan.value || isCancelling.value) return;

    // Tandai proses pembatalan sedang berjalan.
    isCancelling.value = true;
    // Ambil header token.
    const headers = getAuthHeaders();

    try {
      // Kirim request pembatalan ke backend.
      await axios.post(
        `${API_URL}/pemesanan/${pemesanan.value.id}/batalkan`,
        {},
        { headers },
      );

      // Tampilkan pesan sukses.
      toast.success("Pemesanan berhasil dibatalkan");
      // Tutup modal konfirmasi.
      showCancelConfirm.value = false;
      // Ambil ulang detail agar status terbaru tampil.
      await fetchPemesananDetail();
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "cancelPemesananFromDetail");
      toast.error(handleApiError(error));
    } finally {
      // Matikan status pembatalan.
      isCancelling.value = false;
    }
  };

  // Saat halaman dibuka, ambil detail pemesanan.
  onMounted(() => {
    fetchPemesananDetail();
  });

  // Kembalikan state dan fungsi ke file .vue.
  return {
    pemesanan,
    isLoading,
    isCancelling,
    showCancelConfirm,
    errorMessage,
    totalLayanan,
    totalSukuCadang,
    totalBiaya,
    canCancel,
    handleConfirmCancel,
  };
}
