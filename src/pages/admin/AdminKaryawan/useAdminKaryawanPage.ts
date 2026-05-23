import { ref, onMounted } from "vue";
import axios from "axios";
import { getCurrentUser } from "@/utils/auth";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

export interface Karyawan {
  id: number;
  nama: string;
  email: string;
  no_telepon?: string;
  role: string;
  created_at: string;
}

export function useAdminKaryawanPage() {
  const toast = useToast();
  const currentUser = getCurrentUser();

  const karyawanDaftar = ref<Karyawan[]>([]);
  const isLoading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const editData = ref<Karyawan | null>(null);
  const showDeleteConfirm = ref(false);
  const karyawanToDelete = ref<number | null>(null);

  const fetchKaryawan = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(`${API_URL}/admin/karyawan`, {
        headers: getAuthHeaders(),
      });
      karyawanDaftar.value = response.data.data;
    } catch (error) {
      logError(error, "fetchKaryawan");
      toast.error("Gagal memuat data karyawan.");
    } finally {
      isLoading.value = false;
    }
  };

  const openAddModal = () => {
    isEditMode.value = false;
    editData.value = null;
    isModalOpen.value = true;
  };

  const openEditModal = (karyawan: Karyawan) => {
    isEditMode.value = true;
    editData.value = karyawan;
    isModalOpen.value = true;
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = isEditMode.value
        ? `${API_URL}/admin/karyawan/${formData.id}`
        : `${API_URL}/admin/karyawan`;

      const bodyData = { ...formData };
      if (isEditMode.value && !bodyData.password) {
        delete bodyData.password;
      }

      const response = isEditMode.value
        ? await axios.put(url, bodyData, { headers: getAuthHeaders() })
        : await axios.post(url, bodyData, { headers: getAuthHeaders() });

      toast.success(response.data.message);
      isModalOpen.value = false;
      await fetchKaryawan();
    } catch (error: any) {
      logError(error, "handleFormSubmit");
      toast.error(handleApiError(error));
    }
  };

  const konfirmasiHapus = (id: number) => {
    karyawanToDelete.value = id;
    showDeleteConfirm.value = true;
  };

  const hapusKaryawan = async () => {
    if (!karyawanToDelete.value) return;
    try {
      const response = await axios.delete(
        `${API_URL}/admin/karyawan/${karyawanToDelete.value}`,
        { headers: getAuthHeaders() },
      );
      toast.success(response.data.message);
      await fetchKaryawan();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus karyawan");
    } finally {
      showDeleteConfirm.value = false;
      karyawanToDelete.value = null;
    }
  };

  onMounted(fetchKaryawan);

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
