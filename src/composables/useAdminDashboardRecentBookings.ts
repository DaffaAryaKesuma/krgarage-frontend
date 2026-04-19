import { computed, ref, type Ref } from "vue";
import { PAYMENT_STATUS } from "@/utils/paymentStatus";
import {
  ACTION_CONFIG,
  type ActionConfirmationConfig,
  type BookingActionType,
} from "@/composables/helpers/adminBookingControlPanelHelpers";
import type { Booking } from "@/types/booking";

type DashboardActionType = Exclude<BookingActionType, "markPaid">;

interface PendingStatusAction {
  booking: Booking;
  action: DashboardActionType;
}

type StatusActionConfig = Pick<
  ActionConfirmationConfig,
  "title" | "message" | "confirmText" | "variant"
> & {
  newStatus: string;
};

interface UseAdminDashboardRecentBookingsOptions {
  bookings: Ref<Booking[]>;
  selectedMekaniks: Ref<Record<number, number>>;
  onStatusChange: (booking: Booking, newStatus: string) => void;
  onPaymentStatusChange: (booking: Booking, newStatus: string) => void;
  onSelectedMekaniksChange: (value: Record<number, number>) => void;
}

export function useAdminDashboardRecentBookings({
  bookings,
  selectedMekaniks,
  onStatusChange,
  onPaymentStatusChange,
  onSelectedMekaniksChange,
}: UseAdminDashboardRecentBookingsOptions) {
  const showStatusConfirmModal = ref(false);
  const pendingStatusAction = ref<PendingStatusAction | null>(null);

  const hasBookings = computed(() => bookings.value.length > 0);

  const activeStatusConfig = computed<StatusActionConfig | null>(() => {
    if (!pendingStatusAction.value) {
      return null;
    }

    const config = ACTION_CONFIG[pendingStatusAction.value.action];

    if (config.requestType !== "status") {
      return null;
    }

    return {
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      variant: config.variant,
      newStatus: config.value,
    };
  });

  const requestStatusConfirmation = (
    booking: Booking,
    action: DashboardActionType,
  ) => {
    pendingStatusAction.value = { booking, action };
    showStatusConfirmModal.value = true;
  };

  const closeStatusConfirmModal = () => {
    showStatusConfirmModal.value = false;
    pendingStatusAction.value = null;
  };

  const applyStatusChange = () => {
    const action = pendingStatusAction.value;
    const config = activeStatusConfig.value;

    if (!action || !config) {
      closeStatusConfirmModal();
      return;
    }

    onStatusChange(action.booking, config.newStatus);
    closeStatusConfirmModal();
  };

  const handleConfirm = (booking: Booking) => {
    requestStatusConfirmation(booking, "confirm");
  };

  const handleComplete = (booking: Booking) => {
    requestStatusConfirmation(booking, "complete");
  };

  const handleCancel = (booking: Booking) => {
    requestStatusConfirmation(booking, "cancel");
  };

  const handleMarkPaid = (booking: Booking) => {
    onPaymentStatusChange(booking, PAYMENT_STATUS.PAID);
  };

  const handleMekanikChange = (
    bookingId: number,
    value: string | number | null,
  ) => {
    if (typeof value !== "number") {
      return;
    }

    const updatedSelection = {
      ...selectedMekaniks.value,
      [bookingId]: value,
    };

    onSelectedMekaniksChange(updatedSelection);
  };

  return {
    hasBookings,
    showStatusConfirmModal,
    activeStatusConfig,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkPaid,
    handleMekanikChange,
    closeStatusConfirmModal,
    applyStatusChange,
  };
}
