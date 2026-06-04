import { ref, onMounted } from "vue";
// Axios dipakai untuk request CRUD karyawan ke backend.
import axios from "axios";
// Mengambil user yang sedang login dari local storage.
import { getCurrentUser } from "@/utils/auth";
// Toast untuk feedback sukses/gagal.
import { useToast } from "@/utils/useToast";
// Helper error API.
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

// Bentuk data karyawan yang dipakai di halaman admin.
export interface Karyawan {
  id: number;
  nama: string;
  email: string;
  no_telepon?: string;
  role: string;
  created_at: string;
}

// Composable utama halaman manajemen karyawan.
export function useAdminKaryawanPage() {
  const toast = useToast();
  // User login dipakai agar kartu bisa tahu akun mana yang sedang aktif.
  const currentUser = getCurrentUser();

  // Daftar karyawan dari API.
  const karyawanDaftar = ref<Karyawan[]>([]);
  // Loading utama halaman.
  const isLoading = ref(true);
  // Buka/tutup modal form.
  const isModalOpen = ref(false);
  // Menandai apakah modal sedang mode edit atau tambah.
  const isEditMode = ref(false);
  // Data karyawan yang sedang diedit.
  const editData = ref<Karyawan | null>(null);
  // Buka/tutup modal konfirmasi hapus.
  const showDeleteConfirm = ref(false);
  // Id karyawan yang akan dihapus setelah dikonfirmasi.
  const karyawanToDelete = ref<number | null>(null);

  // Mengambil daftar karyawan dari backend.
  const fetchKaryawan = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(`${API_URL}/admin/karyawan`, {
        headers: getAuthHeaders(),
      });
      // Response backend disimpan ke state agar grid ikut update.
      karyawanDaftar.value = response.data.data;
    } catch (error) {
      logError(error, "fetchKaryawan");
      toast.error("Gagal memuat data karyawan.");
    } finally {
      isLoading.value = false;
    }
  };

  // Membuka modal dalam mode tambah.
  const openAddModal = () => {
    isEditMode.value = false;
    editData.value = null;
    isModalOpen.value = true;
  };

  // Membuka modal dalam mode edit dengan data karyawan terpilih.
  const openEditModal = (karyawan: Karyawan) => {
    isEditMode.value = true;
    editData.value = karyawan;
    isModalOpen.value = true;
  };

  // Menerima submit dari modal, lalu create atau update sesuai mode.
  const handleFormSubmit = async (formData: any) => {
    try {
      // URL berbeda antara tambah dan edit.
      const url = isEditMode.value
        ? `${API_URL}/admin/karyawan/${formData.id}`
        : `${API_URL}/admin/karyawan`;

      // Salin form agar object asli dari modal tidak ikut diubah langsung.
      const bodyData = { ...formData };
      // Saat edit, password kosong berarti password lama tidak diubah.
      if (isEditMode.value && !bodyData.password) {
        delete bodyData.password;
      }

      // PUT untuk edit, POST untuk tambah.
      const response = isEditMode.value
        ? await axios.put(url, bodyData, { headers: getAuthHeaders() })
        : await axios.post(url, bodyData, { headers: getAuthHeaders() });

      toast.success(response.data.message);
      isModalOpen.value = false;
      // Refresh daftar setelah berhasil simpan.
      await fetchKaryawan();
    } catch (error: any) {
      logError(error, "handleFormSubmit");
      toast.error(handleApiError(error));
    }
  };

  // Menyimpan id yang akan dihapus dan membuka modal konfirmasi.
  const konfirmasiHapus = (id: number) => {
    karyawanToDelete.value = id;
    showDeleteConfirm.value = true;
  };

  // Menghapus karyawan setelah user mengonfirmasi.
  const hapusKaryawan = async () => {
    if (!karyawanToDelete.value) return;
    try {
      const response = await axios.delete(
        `${API_URL}/admin/karyawan/${karyawanToDelete.value}`,
        { headers: getAuthHeaders() },
      );
      toast.success(response.data.message);
      // Ambil ulang data agar kartu yang dihapus hilang dari layar.
      await fetchKaryawan();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus karyawan");
    } finally {
      showDeleteConfirm.value = false;
      karyawanToDelete.value = null;
    }
  };

  // Ambil data karyawan saat halaman pertama dibuka.
  onMounted(fetchKaryawan);

  // Semua yang direturn bisa dipakai oleh AdminKaryawan.vue.
  return {
    currentUser,
    karyawanDaftar,
    isLoading,
    isModalOpen,
    isEditMode,
    editData,
    showDeleteConfirm,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    konfirmasiHapus,
    hapusKaryawan,
  };
}
