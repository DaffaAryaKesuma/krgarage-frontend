// Mengambil ref untuk data reaktif dan onMounted untuk menjalankan kode saat halaman dibuka.
import { ref, onMounted } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil toast untuk menampilkan pesan sukses/error.
import { useToast } from "@/utils/useToast";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil tipe data Vespa.
import type { VespaDetail } from "@/types/vespa";

// Tipe data yang digunakan oleh form tambah/edit Vespa.
export type VespaFormData = {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
};

// Fungsi utama untuk mengatur logika halaman Vespa Saya.
export function usePelangganVespasPage() {
  // Menyiapkan toast.
  const toast = useToast();

  // Menyimpan daftar Vespa dari API.
  const vespas = ref<VespaDetail[]>([]);
  // Menyimpan status loading.
  const isLoading = ref(true);
  // Menyimpan pesan error form/API.
  const error = ref("");
  // Menentukan apakah form modal sedang tampil.
  const isFormVisible = ref(false);
  // Menentukan mode form, tambah atau edit.
  const formMode = ref<"add" | "edit">("add");
  // Menentukan apakah modal konfirmasi hapus tampil.
  const showDeleteConfirm = ref(false);
  // Menyimpan Vespa yang dipilih untuk dihapus.
  const vespaToDelete = ref<VespaDetail | null>(null);
  // Menyimpan data awal yang dikirim ke form.
  const formInitialData = ref<VespaFormData | undefined>(undefined);

  // Mengambil daftar Vespa milik pelanggan dari backend.
  const fetchVespas = async () => {
    // Aktifkan loading sebelum request API.
    isLoading.value = true;
    // Ambil header token.
    const headers = getAuthHeaders();

    // Jika token tidak ada, hentikan proses dan matikan loading.
    if (!Object.keys(headers).length) {
      isLoading.value = false;
      return;
    }

    try {
      // Panggil endpoint Vespa Saya.
      const { data } = await axios.get(`${API_URL}/vespa-saya`, { headers });
      // Simpan data response ke state vespas.
      vespas.value = data.data || data;
    } catch {
      // Jika gagal, simpan pesan error.
      error.value = "Gagal memuat data Vespa.";
    } finally {
      // Loading selalu dimatikan setelah request selesai.
      isLoading.value = false;
    }
  };

  // Membuka form dalam mode tambah Vespa.
  const openAddForm = () => {
    formMode.value = "add";
    formInitialData.value = { id: null, model: "", tahun_produksi: null, plat_nomor: "" };
    error.value = "";
    isFormVisible.value = true;
  };

  // Membuka form dalam mode edit dengan data Vespa yang dipilih.
  const openEditForm = (vespa: VespaDetail) => {
    formMode.value = "edit";
    formInitialData.value = {
      id: vespa.id,
      model: vespa.model,
      tahun_produksi: vespa.tahun_produksi,
      plat_nomor: vespa.plat_nomor,
    };
    error.value = "";
    isFormVisible.value = true;
  };

  // Menyimpan data form, baik tambah maupun edit.
  const handleFormSubmit = async (formData: VespaFormData) => {
    // Ambil header token.
    const headers = getAuthHeaders();
    // Cek apakah mode saat ini edit.
    const isEdit = formMode.value === "edit";
    // Tentukan URL API berdasarkan mode.
    const url = isEdit
      ? `${API_URL}/vespa-saya/${formData.id}`
      : `${API_URL}/vespa-saya`;
    // Tentukan method HTTP berdasarkan mode.
    const method = isEdit ? "put" : "post";

    try {
      // Kirim data form ke backend.
      await axios({ method, url, data: formData, headers });
      // Tutup modal form setelah berhasil.
      isFormVisible.value = false;
      // Ambil ulang daftar Vespa agar tampilan terbaru.
      await fetchVespas();
      // Tampilkan pesan sukses sesuai mode.
      toast.success(isEdit ? "Vespa berhasil diupdate!" : "Vespa berhasil ditambahkan!");
    } catch (err: any) {
      // Jika gagal, tampilkan pesan dari backend atau pesan default.
      error.value =
        err.response?.data?.message ||
        "Gagal menyimpan data. Pastikan Plat Nomor unik.";
    }
  };

  // Menyiapkan data Vespa yang akan dihapus dan membuka modal konfirmasi.
  const handleDelete = (vespa: VespaDetail) => {
    vespaToDelete.value = vespa;
    showDeleteConfirm.value = true;
  };

  // Menghapus Vespa setelah user menekan tombol konfirmasi.
  const confirmDelete = async () => {
    // Jika tidak ada Vespa yang dipilih, hentikan proses.
    if (!vespaToDelete.value) return;

    // Ambil header token.
    const headers = getAuthHeaders();
    try {
      // Kirim request DELETE ke backend.
      await axios.delete(`${API_URL}/vespa-saya/${vespaToDelete.value.id}`, { headers });
      // Ambil ulang daftar Vespa.
      await fetchVespas();
      // Tampilkan pesan sukses.
      toast.success("Vespa berhasil dihapus!");
    } catch {
      // Tampilkan pesan gagal jika proses hapus error.
      toast.error("Gagal menghapus Vespa.");
    } finally {
      // Tutup modal dan kosongkan data Vespa yang dipilih.
      showDeleteConfirm.value = false;
      vespaToDelete.value = null;
    }
  };

  // Saat halaman dibuka, langsung ambil data Vespa dari API.
  onMounted(fetchVespas);

  // Kembalikan state dan fungsi agar bisa digunakan oleh file .vue.
  return {
    vespas,
    isLoading,
    error,
    isFormVisible,
    formMode,
    showDeleteConfirm,
    vespaToDelete,
    formInitialData,
    openAddForm,
    openEditForm,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
  };
}
