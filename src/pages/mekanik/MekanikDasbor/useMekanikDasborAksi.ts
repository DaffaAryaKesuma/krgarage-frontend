import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { getMekanikNextStatus } from "@/utils/statusBadge";
import type { MekanikPemesanan } from "@/types/pemesanan";
import type { SukuCadangRingkasan } from "@/types/inventaris";

interface ConfirmModalData {
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}

interface MekanikDasborAksiOptions {
  activePemesanan: Ref<MekanikPemesanan[]>;
  fetchData: () => Promise<void>;
}

export function useMekanikDasborAksi(
  options: MekanikDasborAksiOptions,
) {
  const router = useRouter();
  const toast = useToast();

  const showAddSukuCadangModal = ref(false);
  const selectedPemesananId = ref<number | null>(null);
  const sukuCadangList = ref<SukuCadangRingkasan[]>([]);
  const isLoadingSukuCadang = ref(false);
  const isAddingSukuCadang = ref(false);
  const showCompleteJobModal = ref(false);
  const isCompletingJob = ref(false);
  const completeJobTarget = ref<{ id: number; kodePemesanan: string } | null>(
    null,
  );

  const showConfirmModal = ref(false);
  const confirmModalData = ref<ConfirmModalData>({
    title: "",
    message: "",
    variant: "info",
    onConfirm: () => {},
  });

  const getValidAuthHeaders = () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      router.push("/");
      return null;
    }
    return headers;
  };

  const showConfirm = (
    title: string,
    message: string,
    variant: "danger" | "warning" | "info",
    onConfirm: () => void,
  ) => {
    confirmModalData.value = { title, message, variant, onConfirm };
    showConfirmModal.value = true;
  };

  const handleConfirm = () => {
    confirmModalData.value.onConfirm();
    showConfirmModal.value = false;
  };

  const handleCancel = () => {
    showConfirmModal.value = false;
  };

  const closeCompleteJobModal = () => {
    showCompleteJobModal.value = false;
    completeJobTarget.value = null;
  };

  const submitCompleteJob = async (catatanMekanik: string) => {
    if (!completeJobTarget.value) {
      return;
    }

    try {
      isCompletingJob.value = true;

      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      const response = await axios.put(
        `${API_URL}/mekanik/pemesanan/${completeJobTarget.value.id}/status`,
        {
          status: "Selesai",
          catatan_mekanik: catatanMekanik,
        },
        { headers },
      );

      if (response.data.success) {
        toast.success("Pekerjaan berhasil diselesaikan");
        closeCompleteJobModal();
        await options.fetchData();
      }
    } catch (error: any) {
      logError(error, "submitCompleteJob");
      toast.error(handleApiError(error));
    } finally {
      isCompletingJob.value = false;
    }
  };

  const handleUpdateStatus = async (idPemesanan: number) => {
    const pemesanan = options.activePemesanan.value.find(
      (pesanan) => pesanan.id === idPemesanan,
    );
    if (!pemesanan) return;

    const newStatus = getMekanikNextStatus(pemesanan.status);
    let confirmMessage = "";
    let variant: "danger" | "warning" | "info" = "info";

    if (newStatus === "Dikerjakan") {
      confirmMessage = "Apakah Anda yakin ingin memulai pekerjaan ini?";
      variant = "info";
    } else if (newStatus === "Selesai") {
      completeJobTarget.value = {
        id: pemesanan.id,
        kodePemesanan: pemesanan.kode_pemesanan,
      };
      showCompleteJobModal.value = true;
      return;
    } else {
      toast.error("Status tidak dapat diubah");
      return;
    }

    showConfirm(
      "Konfirmasi Perubahan Status",
      confirmMessage,
      variant,
      async () => {
        try {
          const headers = getValidAuthHeaders();
          if (!headers) {
            return;
          }

          const response = await axios.put(
            `${API_URL}/mekanik/pemesanan/${idPemesanan}/status`,
            { status: newStatus },
            { headers },
          );

          if (response.data.success) {
            toast.success("Status berhasil diperbarui");
            await options.fetchData();
          }
        } catch (error: any) {
          logError(error, "handleUpdateStatus");
          toast.error(handleApiError(error));
        }
      },
    );
  };

  const handleAddSukuCadang = async (idPemesanan: number) => {
    selectedPemesananId.value = idPemesanan;
    showAddSukuCadangModal.value = true;
    // Fetch daftar suku cadang saat modal dibuka
    isLoadingSukuCadang.value = true;
    try {
      const headers = getValidAuthHeaders();
      if (!headers) return;
      const res = await axios.get(`${API_URL}/mekanik/suku-cadang`, { headers });
      const data = res.data.data || res.data;
      sukuCadangList.value = Array.isArray(data) ? data : [];
    } catch (error: any) {
      logError(error, "fetchSukuCadang");
      toast.error(handleApiError(error));
    } finally {
      isLoadingSukuCadang.value = false;
    }
  };

  const submitSukuCadangItems = async (
    items: { sukucadangId: number; quantity: number }[],
  ) => {
    if (!selectedPemesananId.value || !items.length) return;
    isAddingSukuCadang.value = true;
    try {
      const headers = getValidAuthHeaders();
      if (!headers) return;
      await Promise.all(
        items.map((item) =>
          axios.post(
            `${API_URL}/mekanik/pemesanan/${selectedPemesananId.value}/tambah-suku-cadang`,
            { id_suku_cadang: item.sukucadangId, jumlah: item.quantity },
            { headers },
          ),
        ),
      );
      toast.success(`${items.length} suku cadang berhasil ditambahkan!`);
      closeSukuCadangModal();
      await options.fetchData();
    } catch (error: any) {
      logError(error, "submitSukuCadangItems");
      toast.error(handleApiError(error));
    } finally {
      isAddingSukuCadang.value = false;
    }
  };

  const handleDeleteSukuCadang = async (idPemesanan: number, idItem: number) => {
    showConfirm(
      "Hapus SukuCadang",
      "Apakah Anda yakin ingin menghapus sukucadang ini?",
      "danger",
      async () => {
        try {
          const headers = getValidAuthHeaders();
          if (!headers) {
            return;
          }

          await axios.delete(
            `${API_URL}/mekanik/pemesanan/${idPemesanan}/item/${idItem}`,
            { headers },
          );
          toast.success("SukuCadang berhasil dihapus");
          await options.fetchData();
        } catch (error: any) {
          logError(error, "handleDeleteSukuCadang");
          toast.error("Gagal menghapus sukucadang");
        }
      },
    );
  };

  const closeSukuCadangModal = () => {
    showAddSukuCadangModal.value = false;
    selectedPemesananId.value = null;
    sukuCadangList.value = [];
  };

  const onSukuCadangAdded = async () => {
    closeSukuCadangModal();
    await options.fetchData();
  };

  return {
    showAddSukuCadangModal,
    selectedPemesananId,
    sukuCadangList,
    isLoadingSukuCadang,
    isAddingSukuCadang,
    showCompleteJobModal,
    isCompletingJob,
    completeJobTarget,
    showConfirmModal,
    confirmModalData,
    handleUpdateStatus,
    closeCompleteJobModal,
    submitCompleteJob,
    handleAddSukuCadang,
    submitSukuCadangItems,
    handleDeleteSukuCadang,
    handleConfirm,
    handleCancel,
    closeSukuCadangModal,
    onSukuCadangAdded,
  };
}
