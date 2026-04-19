import { computed, ref } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { Booking } from "@/types/booking";
import type { SparepartSummary } from "@/types/inventory";

export function useAdminBookingDetailPage(bookingId: string) {
  const toast = useToast();

  const booking = ref<Booking | null>(null);
  const isLoading = ref(true);
  const error = ref("");

  const showAddSparepartModal = ref(false);
  const availableSpareparts = ref<SparepartSummary[]>([]);
  const isAddingSparepart = ref(false);

  const showDeleteConfirm = ref(false);
  const itemToDelete = ref<number | null>(null);

  const isInProgress = computed(() => {
    return booking.value?.status.toLowerCase().includes("progress") || false;
  });

  const totalHarga = computed(() => {
    return booking.value?.layanan?.reduce((sum, s) => sum + s.harga, 0) || 0;
  });

  const totalSpareparts = computed(() => {
    return (
      booking.value?.item_pemesanan?.reduce(
        (sum, item) => sum + item.harga_saat_ini * item.jumlah,
        0,
      ) || 0
    );
  });

  const grandTotal = computed(() => totalHarga.value + totalSpareparts.value);

  const totalAkhir = computed(
    () => booking.value?.total_harga || grandTotal.value,
  );

  const fetchBookingData = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/admin/pemesanan/${bookingId}`,
        {
          headers: getAuthHeaders(),
        },
      );
      booking.value = data;
    } catch (err) {
      console.error("Gagal mengambil detail pemesanan:", err);
      if (!booking.value) error.value = "Gagal memload data.";
    }
  };

  const fetchAvailableSpareparts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/inventori`, {
        headers: getAuthHeaders(),
      });
      availableSpareparts.value = data.data;
    } catch (err) {
      console.error("Gagal mengambil suku cadang:", err);
    }
  };

  const openAddSparepartModal = async () => {
    showAddSparepartModal.value = true;
    await fetchAvailableSpareparts();
  };

  const closeAddSparepartModal = () => {
    showAddSparepartModal.value = false;
  };

  const addSparepartToBooking = async (payload: {
    sparepartId: number;
    quantity: number;
  }) => {
    isAddingSparepart.value = true;
    try {
      await axios.post(
        `${API_URL}/admin/pemesanan/${booking.value?.id}/tambah-suku-cadang`,
        {
          id_suku_cadang: payload.sparepartId,
          jumlah: payload.quantity,
        },
        { headers: getAuthHeaders() },
      );

      toast.success("Suku cadang berhasil ditambahkan!");
      closeAddSparepartModal();
      await fetchBookingData();
    } catch (err: any) {
      console.error("Gagal menambahkan suku cadang:", err);
      toast.error(
        err.response?.data?.message || "Gagal menambahkan suku cadang",
      );
    } finally {
      isAddingSparepart.value = false;
    }
  };

  const promptDeleteSparepart = (itemId: number) => {
    itemToDelete.value = itemId;
    showDeleteConfirm.value = true;
  };

  const removeSparepartFromBooking = async () => {
    if (!itemToDelete.value) return;

    try {
      await axios.delete(
        `${API_URL}/admin/pemesanan/${booking.value?.id}/item/${itemToDelete.value}`,
        { headers: getAuthHeaders() },
      );

      toast.success("Suku cadang berhasil dihapus!");
      showDeleteConfirm.value = false;
      itemToDelete.value = null;
      await fetchBookingData();
    } catch (err: any) {
      console.error("Gagal menghapus suku cadang:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus suku cadang");
    }
  };

  return {
    booking,
    isLoading,
    error,
    showAddSparepartModal,
    availableSpareparts,
    isAddingSparepart,
    showDeleteConfirm,
    isInProgress,
    totalHarga,
    totalSpareparts,
    totalAkhir,
    fetchBookingData,
    openAddSparepartModal,
    closeAddSparepartModal,
    addSparepartToBooking,
    promptDeleteSparepart,
    removeSparepartFromBooking,
  };
}
