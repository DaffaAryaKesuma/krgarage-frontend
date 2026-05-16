import { computed, ref, watch } from "vue";
import { useToast } from "@/utils/useToast";
import {
  PEMESANAN_STATUS,
  canAdminAssignAndStart,
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusBatal,
  isStatusSelesai,
} from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
  isPaidStatus,
} from "@/utils/pembayaranStatus";
import {
  AKSI_CONFIG,
  CANCEL_BUTTON_CLASS,
  type AksiConfirmationConfig,
  type PemesananAksiType,
  type Mekanik,
} from "@/composables/helpers/adminPemesananControlPanelHelpers";
import {
  assignMekanikToPemesanan,
  fetchAdminMekaniks,
  patchAdminPemesananStatus,
  patchAdminPembayaranStatus,
} from "@/composables/helpers/adminPemesananControlPanelApi";

export { CANCEL_BUTTON_CLASS };

export interface AdminPemesananControlPanelProps {
  pemesananId: number;
  currentStatus: string;
  currentPembayaranStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}

export function useAdminPemesananControlPanel(
  props: AdminPemesananControlPanelProps,
  onRefresh: () => void,
) {
  const toast = useToast();

  const availableMekaniks = ref<Mekanik[]>([]);
  const isProcessing = ref(false);
  const selectedMekanikId = ref<number | null>(props.currentMekanikId);
  const showAksiConfirmation = ref(false);
  const pendingAksi = ref<PemesananAksiType | null>(null);

  watch(
    () => props.currentMekanikId,
    (nextMekanikId) => {
      selectedMekanikId.value = nextMekanikId;
    },
  );

  const mekanikOptionsDaftar = computed(() =>
    availableMekaniks.value.map((mech) => ({
      value: mech.id,
      label: mech.nama,
    })),
  );

  const canConfirm = computed(() =>
    canAdminConfirmPemesanan(props.currentStatus),
  );
  const canAssignAndStart = computed(() =>
    canAdminAssignAndStart(props.currentStatus),
  );
  const canComplete = computed(() =>
    canAdminCompletePemesanan(props.currentStatus),
  );
  const canCancel = computed(() => canAdminCancelPemesanan(props.currentStatus));
  const isCompleted = computed(() => isStatusSelesai(props.currentStatus));
  const isCancelled = computed(() => isStatusBatal(props.currentStatus));
  const isPaid = computed(() => isPaidStatus(props.currentPembayaranStatus));
  const canMarkAsPaid = computed(
    () => isCompleted.value && !isCancelled.value && !isPaid.value,
  );

  const pembayaranStatusLabel = computed(() =>
    getPembayaranStatusLabel(props.currentPembayaranStatus),
  );
  const pembayaranStatusBadgeClass = computed(() =>
    getPembayaranStatusBadgeClass(props.currentPembayaranStatus),
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

  const aksiConfirmationConfig = computed<AksiConfirmationConfig | null>(
    () => (pendingAksi.value ? AKSI_CONFIG[pendingAksi.value] : null),
  );

  const requestAksiConfirmation = (aksi: PemesananAksiType) => {
    pendingAksi.value = aksi;
    showAksiConfirmation.value = true;
  };

  const closeAksiConfirmation = () => {
    showAksiConfirmation.value = false;
    pendingAksi.value = null;
  };

  async function updateStatus(newStatus: string, successMessage: string, catatan?: string) {
    isProcessing.value = true;
    try {
      await patchAdminPemesananStatus(props.pemesananId, newStatus, catatan);
      toast.success(successMessage);
      onRefresh();
    } catch (err: any) {
      console.error(`Gagal memperbarui status ke ${newStatus}:`, err);
      toast.error(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      isProcessing.value = false;
    }
  }

  async function updatePembayaranStatus(
    newPembayaranStatus: string,
    successMessage: string,
  ) {
    isProcessing.value = true;
    try {
      await patchAdminPembayaranStatus(props.pemesananId, newPembayaranStatus);
      toast.success(successMessage);
      onRefresh();
    } catch (err: any) {
      console.error(
        `Gagal memperbarui status pembayaran ke ${newPembayaranStatus}:`,
        err,
      );
      toast.error(
        err.response?.data?.message || "Gagal memperbarui status pembayaran",
      );
    } finally {
      isProcessing.value = false;
    }
  }

  const confirmAksi = (catatan?: string) => {
    const config = aksiConfirmationConfig.value;
    if (!config || isProcessing.value) {
      closeAksiConfirmation();
      return;
    }

    closeAksiConfirmation();
    if (config.requestType === "pembayaran") {
      void updatePembayaranStatus(config.value, config.successMessage);
      return;
    }

    void updateStatus(config.value, config.successMessage, catatan);
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
      await assignMekanikToPemesanan(props.pemesananId, selectedMekanikId.value);
      await patchAdminPemesananStatus(
        props.pemesananId,
        PEMESANAN_STATUS.IN_PROGRESS,
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

  const handleConfirm = () => requestAksiConfirmation("confirm");
  const handleComplete = () => requestAksiConfirmation("complete");
  const handleCancel = () => requestAksiConfirmation("cancel");
  const handleMarkAsPaid = () => requestAksiConfirmation("markPaid");

  return {
    mekanikOptionsDaftar,
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
    pembayaranStatusLabel,
    pembayaranStatusBadgeClass,
    assignedMekanikName,
    showAksiConfirmation,
    aksiConfirmationConfig,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkAsPaid,
    closeAksiConfirmation,
    confirmAksi,
    fetchMekaniks,
    assignMekanikAndStart,
  };
}

