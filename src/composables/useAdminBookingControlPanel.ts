import { computed, ref, watch } from "vue";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/utils/useToast";
import {
  BOOKING_STATUS,
  canAdminAssignAndStart,
  canAdminCancelBooking,
  canAdminCompleteBooking,
  canAdminConfirmBooking,
  isCancelledStatus,
  isCompletedStatus,
} from "@/utils/statusBadge";
import {
  PAYMENT_STATUS,
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
  isPaidStatus,
} from "@/utils/paymentStatus";

interface Mechanic {
  id: number;
  nama: string;
  email: string;
}

export interface AdminBookingControlPanelProps {
  bookingId: number;
  currentStatus: string;
  currentPaymentStatus?: string | null;
  currentMechanicId: number | null;
  currentMechanicName?: string;
}

type BookingActionType = "confirm" | "complete" | "cancel" | "markPaid";

interface ActionConfirmationConfig {
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "warning" | "info" | "success";
  requestType: "status" | "payment";
  value: string;
  successMessage: string;
}

const ACTION_CONFIG: Record<BookingActionType, ActionConfirmationConfig> = {
  confirm: {
    title: "Konfirmasi Pemesanan",
    message: "Apakah Anda yakin ingin mengonfirmasi pemesanan ini?",
    confirmText: "Ya, Konfirmasi",
    variant: "info",
    requestType: "status",
    value: BOOKING_STATUS.CONFIRMED,
    successMessage: "Pemesanan berhasil dikonfirmasi!",
  },
  complete: {
    title: "Selesaikan Pemesanan",
    message: "Apakah Anda yakin ingin menandai servis ini telah selesai?",
    confirmText: "Ya, Selesaikan",
    variant: "success",
    requestType: "status",
    value: BOOKING_STATUS.COMPLETED,
    successMessage: "Pemesanan berhasil diselesaikan!",
  },
  cancel: {
    title: "Batalkan Pemesanan",
    message: "Apakah Anda yakin ingin membatalkan pemesanan ini?",
    confirmText: "Ya, Batalkan",
    variant: "danger",
    requestType: "status",
    value: BOOKING_STATUS.CANCELLED,
    successMessage: "Pemesanan berhasil dibatalkan!",
  },
  markPaid: {
    title: "Tandai Pembayaran Lunas",
    message: "Apakah Anda yakin pembayaran untuk pemesanan ini sudah lunas?",
    confirmText: "Ya, Tandai Lunas",
    variant: "success",
    requestType: "payment",
    value: PAYMENT_STATUS.PAID,
    successMessage: "Status pembayaran berhasil diperbarui menjadi lunas!",
  },
};

export const CANCEL_BUTTON_CLASS =
  "w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition font-semibold";

export function useAdminBookingControlPanel(
  props: AdminBookingControlPanelProps,
  onRefresh: () => void,
) {
  const toast = useToast();

  const availableMechanics = ref<Mechanic[]>([]);
  const isProcessing = ref(false);
  const selectedMechanicId = ref<number | null>(props.currentMechanicId);
  const showActionConfirmation = ref(false);
  const pendingAction = ref<BookingActionType | null>(null);

  watch(
    () => props.currentMechanicId,
    (nextMechanicId) => {
      selectedMechanicId.value = nextMechanicId;
    },
  );

  const mechanicOptionsList = computed(() => {
    return availableMechanics.value.map((mech) => ({
      value: mech.id,
      label: mech.nama,
    }));
  });

  const canConfirm = computed(() =>
    canAdminConfirmBooking(props.currentStatus),
  );
  const canAssignAndStart = computed(() =>
    canAdminAssignAndStart(props.currentStatus),
  );
  const canComplete = computed(() =>
    canAdminCompleteBooking(props.currentStatus),
  );
  const canCancel = computed(() => canAdminCancelBooking(props.currentStatus));
  const isCompleted = computed(() => isCompletedStatus(props.currentStatus));
  const isCancelled = computed(() => isCancelledStatus(props.currentStatus));
  const isPaid = computed(() => isPaidStatus(props.currentPaymentStatus));
  const canMarkAsPaid = computed(
    () => isCompleted.value && !isCancelled.value && !isPaid.value,
  );

  const paymentStatusLabel = computed(() =>
    getPaymentStatusLabel(props.currentPaymentStatus),
  );
  const paymentStatusBadgeClass = computed(() =>
    getPaymentStatusBadgeClass(props.currentPaymentStatus),
  );

  const assignedMechanicName = computed(() => {
    const explicitName = props.currentMechanicName?.trim();
    if (explicitName) {
      return explicitName;
    }

    if (!props.currentMechanicId) {
      return null;
    }

    const matchedMechanic = availableMechanics.value.find(
      (mech) => mech.id === props.currentMechanicId,
    );

    return matchedMechanic?.nama || null;
  });

  const actionConfirmationConfig = computed<ActionConfirmationConfig | null>(
    () => {
      if (!pendingAction.value) {
        return null;
      }

      return ACTION_CONFIG[pendingAction.value];
    },
  );

  const requestActionConfirmation = (action: BookingActionType) => {
    pendingAction.value = action;
    showActionConfirmation.value = true;
  };

  const closeActionConfirmation = () => {
    showActionConfirmation.value = false;
    pendingAction.value = null;
  };

  async function updateStatus(newStatus: string, successMessage: string) {
    isProcessing.value = true;
    try {
      await axios.patch(
        `${API_URL}/admin/pemesanan/${props.bookingId}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() },
      );
      toast.success(successMessage);
      onRefresh();
    } catch (err: any) {
      console.error(`Gagal memperbarui status ke ${newStatus}:`, err);
      toast.error(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      isProcessing.value = false;
    }
  }

  async function updatePaymentStatus(
    newPaymentStatus: string,
    successMessage: string,
  ) {
    isProcessing.value = true;
    try {
      await axios.patch(
        `${API_URL}/admin/pemesanan/${props.bookingId}/status-pembayaran`,
        { status_pembayaran: newPaymentStatus },
        { headers: getAuthHeaders() },
      );
      toast.success(successMessage);
      onRefresh();
    } catch (err: any) {
      console.error(
        `Gagal memperbarui status pembayaran ke ${newPaymentStatus}:`,
        err,
      );
      toast.error(
        err.response?.data?.message || "Gagal memperbarui status pembayaran",
      );
    } finally {
      isProcessing.value = false;
    }
  }

  const confirmAction = () => {
    const config = actionConfirmationConfig.value;
    if (!config || isProcessing.value) {
      closeActionConfirmation();
      return;
    }

    closeActionConfirmation();
    if (config.requestType === "payment") {
      void updatePaymentStatus(config.value, config.successMessage);
      return;
    }

    void updateStatus(config.value, config.successMessage);
  };

  async function fetchMechanics() {
    try {
      const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
        headers: getAuthHeaders(),
      });
      availableMechanics.value = data.data || [];
    } catch (err) {
      console.error("Gagal mengambil daftar mekanik:", err);
    }
  }

  async function assignMechanicAndStart() {
    if (!selectedMechanicId.value) {
      toast.error("Silakan pilih mekanik terlebih dahulu");
      return;
    }

    isProcessing.value = true;
    try {
      await axios.post(
        `${API_URL}/admin/pemesanan/${props.bookingId}/tugaskan-mekanik`,
        { id_mekanik: selectedMechanicId.value },
        { headers: getAuthHeaders() },
      );

      await axios.patch(
        `${API_URL}/admin/pemesanan/${props.bookingId}/status`,
        { status: BOOKING_STATUS.IN_PROGRESS },
        { headers: getAuthHeaders() },
      );

      toast.success("Mekanik ditugaskan dan servis dimulai!");
      onRefresh();
    } catch (err: any) {
      console.error("Gagal menugaskan mekanik dan memulai servis:", err);
      toast.error(err.response?.data?.message || "Gagal memulai servis");
    } finally {
      isProcessing.value = false;
    }
  }

  const handleConfirm = () => requestActionConfirmation("confirm");
  const handleComplete = () => requestActionConfirmation("complete");
  const handleCancel = () => requestActionConfirmation("cancel");
  const handleMarkAsPaid = () => requestActionConfirmation("markPaid");

  return {
    mechanicOptionsList,
    isProcessing,
    selectedMechanicId,
    canConfirm,
    canAssignAndStart,
    canComplete,
    canCancel,
    isCompleted,
    isCancelled,
    isPaid,
    canMarkAsPaid,
    paymentStatusLabel,
    paymentStatusBadgeClass,
    assignedMechanicName,
    showActionConfirmation,
    actionConfirmationConfig,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkAsPaid,
    closeActionConfirmation,
    confirmAction,
    fetchMechanics,
    assignMechanicAndStart,
  };
}
