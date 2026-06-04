import { computed, ref } from "vue";
// Axios untuk request detail pemesanan dan item suku cadang.
import axios from "axios";
// Toast untuk feedback sukses/gagal.
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
// Helper uang agar string/number dapat dihitung sebagai number.
import { toMoneyNumber } from "@/utils/money";
// Refresh otomatis saat data global berubah.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
import type { Pemesanan } from "@/types/pemesanan";
import type { SukuCadangRingkasan } from "@/types/inventaris";

// Opsi fetch untuk refresh diam-diam.
interface FetchOptions {
  silent?: boolean;
}

// Composable utama halaman detail pemesanan admin.
export function useAdminPemesananDetailPage(pemesananId: string) {
  const toast = useToast();

  // Detail pemesanan dari API.
  const pemesanan = ref<Pemesanan | null>(null);
  // Loading dan error utama detail.
  const isLoading = ref(true);
  const error = ref("");

  // State modal tambah suku cadang.
  const showAddSukuCadangModal = ref(false);
  // Daftar suku cadang yang bisa dipilih dari inventaris.
  const availableSukuCadang = ref<SukuCadangRingkasan[]>([]);
  // Loading saat proses tambah suku cadang berjalan.
  const isAddingSukuCadang = ref(false);

  // State konfirmasi hapus suku cadang dari pemesanan.
  const showDeleteConfirm = ref(false);
  // Id item_pemesanan yang akan dihapus.
  const itemToDelete = ref<number | null>(null);

  // Menentukan apakah pemesanan sedang dikerjakan.
  const isInProgress = computed(() => {
    const status = pemesanan.value?.status;
    if (!status) return false;
    const s = status.toLowerCase();
    return s === "dikerjakan" || s === "in progress" || s === "in_progress" || s === "diproses";
  });

  // Total harga layanan dari pivot harga_saat_pesan.
  const totalHarga = computed(() => {
    return (
      pemesanan.value?.layanan?.reduce(
        (sum, s) =>
          sum + toMoneyNumber(s.pivot?.harga_saat_pesan ?? s.harga ?? 0),
        0,
      ) || 0
    );
  });

  // Total harga suku cadang: harga saat ini dikali jumlah.
  const totalSukuCadang = computed(() => {
    return (
      pemesanan.value?.item_pemesanan?.reduce(
        (sum, item) => sum + item.harga_saat_ini * item.jumlah,
        0,
      ) || 0
    );
  });

  // Total hitungan frontend dari layanan + suku cadang.
  const grandTotal = computed(() => totalHarga.value + totalSukuCadang.value);

  // Total akhir mengutamakan total_harga dari backend, fallback ke grandTotal.
  const totalAkhir = computed(
    () => toMoneyNumber(pemesanan.value?.total_harga) || grandTotal.value,
  );

  // Mengambil detail pemesanan dari backend.
  const fetchPemesananData = async (options: FetchOptions = {}) => {
    if (!options.silent) {
      isLoading.value = true;
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/admin/pemesanan/${pemesananId}`,
        {
          headers: getAuthHeaders(),
        },
      );
      // Backend bisa mengirim data langsung atau di dalam data.data.
      pemesanan.value = data.data ?? data;
    } catch (err) {
      console.error("Gagal mengambil detail pemesanan:", err);
      if (!pemesanan.value && !options.silent) error.value = "Gagal memload data.";
    } finally {
      if (!options.silent) {
        isLoading.value = false;
      }
    }
  };

  // Refresh detail secara diam-diam saat data berubah dari halaman lain.
  useRealtimeRefresh(() => fetchPemesananData({ silent: true }));

  // Mengambil daftar suku cadang yang tersedia untuk modal tambah.
  const fetchAvailableSukuCadang = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/inventori`, {
        headers: getAuthHeaders(),
      });
      availableSukuCadang.value = data.data;
    } catch (err) {
      console.error("Gagal mengambil suku cadang:", err);
    }
  };

  // Membuka modal tambah suku cadang dan mengambil data inventaris terbaru.
  const openAddSukuCadangModal = async () => {
    showAddSukuCadangModal.value = true;
    await fetchAvailableSukuCadang();
  };

  // Menutup modal tambah suku cadang.
  const closeAddSukuCadangModal = () => {
    showAddSukuCadangModal.value = false;
  };

  // Menambahkan satu atau beberapa suku cadang ke pemesanan.
  const addSukuCadangToPemesanan = async (
    items: { sukucadangId: number; quantity: number }[],
  ) => {
    if (!items.length) return;
    isAddingSukuCadang.value = true;
    try {
      // Promise.all mengirim semua item yang dipilih secara paralel.
      await Promise.all(
        items.map((item) =>
          axios.post(
            `${API_URL}/admin/pemesanan/${pemesanan.value?.id}/tambah-suku-cadang`,
            { id_suku_cadang: item.sukucadangId, jumlah: item.quantity },
            { headers: getAuthHeaders() },
          ),
        ),
      );

      toast.success(`${items.length} suku cadang berhasil ditambahkan!`);
      closeAddSukuCadangModal();
      // Refresh detail agar rincian dan total terbaru muncul.
      await fetchPemesananData();
    } catch (err: any) {
      console.error("Gagal menambahkan suku cadang:", err);
      toast.error(
        err.response?.data?.message || "Gagal menambahkan suku cadang",
      );
    } finally {
      isAddingSukuCadang.value = false;
    }
  };

  // Menyimpan item yang mau dihapus dan membuka konfirmasi.
  const promptDeleteSukuCadang = (itemId: number) => {
    itemToDelete.value = itemId;
    showDeleteConfirm.value = true;
  };

  // Menghapus item suku cadang dari pemesanan.
  const removeSukuCadangFromPemesanan = async () => {
    if (!itemToDelete.value) return;

    try {
      await axios.delete(
        `${API_URL}/admin/pemesanan/${pemesanan.value?.id}/item/${itemToDelete.value}`,
        { headers: getAuthHeaders() },
      );

      toast.success("Suku cadang berhasil dihapus!");
      showDeleteConfirm.value = false;
      itemToDelete.value = null;
      // Refresh detail agar total dan daftar item ikut update.
      await fetchPemesananData();
    } catch (err: any) {
      console.error("Gagal menghapus suku cadang:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus suku cadang");
    }
  };

  // State dan aksi yang digunakan AdminPemesananDetail.vue.
  return {
    pemesanan,
    isLoading,
    error,
    showAddSukuCadangModal,
    availableSukuCadang,
    isAddingSukuCadang,
    showDeleteConfirm,
    isInProgress,
    totalHarga,
    totalSukuCadang,
    totalAkhir,
    fetchPemesananData,
    openAddSukuCadangModal,
    closeAddSukuCadangModal,
    addSukuCadangToPemesanan,
    promptDeleteSukuCadang,
    removeSukuCadangFromPemesanan,
  };
}
