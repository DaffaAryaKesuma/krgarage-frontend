import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { getMekanikNextStatus } from "@/utils/statusBadge";
import type { MekanikBooking } from "@/types/booking";

interface ConfirmModalData {
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}

interface MekanikDashboardActionsOptions {
  activeBookings: Ref<MekanikBooking[]>;
  fetchData: () => Promise<void>;
}

export function useMekanikDashboardActions(
  options: MekanikDashboardActionsOptions,
) {
  const router = useRouter();
  const toast = useToast();

  const showAddSparepartModal = ref(false);
  const selectedBookingId = ref<number | null>(null);
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
          status: "Completed",
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

  const handleUpdateStatus = async (bookingId: number) => {
    const booking = options.activeBookings.value.find(
      (b) => b.id === bookingId,
    );
    if (!booking) return;

    const newStatus = getMekanikNextStatus(booking.status);
    let confirmMessage = "";
    let variant: "danger" | "warning" | "info" = "info";

    if (newStatus === "In Progress") {
      confirmMessage = "Apakah Anda yakin ingin memulai pekerjaan ini?";
      variant = "info";
    } else if (newStatus === "Completed") {
      completeJobTarget.value = {
        id: booking.id,
        kodePemesanan: booking.kode_pemesanan,
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
            `${API_URL}/mekanik/pemesanan/${bookingId}/status`,
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

  const handleAddSparepart = (bookingId: number) => {
    selectedBookingId.value = bookingId;
    showAddSparepartModal.value = true;
  };

  const handleDeleteSparepart = async (bookingId: number, itemId: number) => {
    showConfirm(
      "Hapus Sparepart",
      "Apakah Anda yakin ingin menghapus sparepart ini?",
      "danger",
      async () => {
        try {
          const headers = getValidAuthHeaders();
          if (!headers) {
            return;
          }

          await axios.delete(
            `${API_URL}/mekanik/pemesanan/${bookingId}/item/${itemId}`,
            { headers },
          );
          toast.success("Sparepart berhasil dihapus");
          await options.fetchData();
        } catch (error: any) {
          logError(error, "handleDeleteSparepart");
          toast.error("Gagal menghapus sparepart");
        }
      },
    );
  };

  const closeSparepartModal = () => {
    showAddSparepartModal.value = false;
    selectedBookingId.value = null;
  };

  const onSparepartAdded = async () => {
    closeSparepartModal();
    await options.fetchData();
  };

  return {
    showAddSparepartModal,
    selectedBookingId,
    showCompleteJobModal,
    isCompletingJob,
    completeJobTarget,
    showConfirmModal,
    confirmModalData,
    handleUpdateStatus,
    closeCompleteJobModal,
    submitCompleteJob,
    handleAddSparepart,
    handleDeleteSparepart,
    handleConfirm,
    handleCancel,
    closeSparepartModal,
    onSparepartAdded,
  };
}
