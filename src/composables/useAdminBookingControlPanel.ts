import { computed, ref, watch } from "vue";
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
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
  isPaidStatus,
} from "@/utils/paymentStatus";
import {
  ACTION_CONFIG,
  CANCEL_BUTTON_CLASS,
  type ActionConfirmationConfig,
  type BookingActionType,
  type Mekanik,
} from "@/composables/helpers/adminBookingControlPanelHelpers";
import {
  assignMekanikToBooking,
  fetchAdminMekaniks,
  patchAdminBookingStatus,
  patchAdminPaymentStatus,
} from "@/composables/helpers/adminBookingControlPanelApi";

export { CANCEL_BUTTON_CLASS };

export interface AdminBookingControlPanelProps {
  bookingId: number;
  currentStatus: string;
  currentPaymentStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}

export function useAdminBookingControlPanel(
  props: AdminBookingControlPanelProps,
  onRefresh: () => void,
) {
  const toast = useToast();

  const availableMekaniks = ref<Mekanik[]>([]);
  const isProcessing = ref(false);
  const selectedMekanikId = ref<number | null>(props.currentMekanikId);
  const showActionConfirmation = ref(false);
  const pendingAction = ref<BookingActionType | null>(null);

  watch(
    () => props.currentMekanikId,
    (nextMekanikId) => {
      selectedMekanikId.value = nextMekanikId;
    },
  );

  const mekanikOptionsList = computed(() =>
    availableMekaniks.value.map((mech) => ({
      value: mech.id,
      label: mech.nama,
    })),
  );

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

  const assignedMekanikName = computed(() => {
    const explicitName = props.currentMekanikName?.trim();
    if (explicitName) {
      return explicitName;
    }

    if (!props.currentMekanikId) {
      return null;
    }

    const matchedMekanik = availableMekaniks.value.find(
      (mech) => mech.id === props.currentMekanikId,
    );

    return matchedMekanik?.nama || null;
  });

  const actionConfirmationConfig = computed<ActionConfirmationConfig | null>(
    () => (pendingAction.value ? ACTION_CONFIG[pendingAction.value] : null),
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
      await patchAdminBookingStatus(props.bookingId, newStatus);
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
      await patchAdminPaymentStatus(props.bookingId, newPaymentStatus);
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

  async function fetchMekaniks() {
    try {
      availableMekaniks.value = await fetchAdminMekaniks();
    } catch (err) {
      console.error("Gagal mengambil daftar mekanik:", err);
    }
  }

  async function assignMekanikAndStart() {
    if (!selectedMekanikId.value) {
      toast.error("Silakan pilih mekanik terlebih dahulu");
      return;
    }

    isProcessing.value = true;
    try {
      await assignMekanikToBooking(props.bookingId, selectedMekanikId.value);
      await patchAdminBookingStatus(
        props.bookingId,
        BOOKING_STATUS.IN_PROGRESS,
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
    mekanikOptionsList,
    isProcessing,
    selectedMekanikId,
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
    assignedMekanikName,
    showActionConfirmation,
    actionConfirmationConfig,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkAsPaid,
    closeActionConfirmation,
    confirmAction,
    fetchMekaniks,
    assignMekanikAndStart,
  };
}
