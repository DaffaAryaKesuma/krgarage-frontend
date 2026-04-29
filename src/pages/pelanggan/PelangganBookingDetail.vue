<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import PelangganBookingDetailInfoCards from "@/components/pelanggan/booking-detail/PelangganBookingDetailInfoCards.vue";
import PelangganBookingDetailServiceSparepartGrid from "@/components/pelanggan/booking-detail/PelangganBookingDetailServiceSparepartGrid.vue";
import PelangganBookingDetailNotesGrid from "@/components/pelanggan/booking-detail/PelangganBookingDetailNotesGrid.vue";
import PelangganBookingDetailTotalSummary from "@/components/pelanggan/booking-detail/PelangganBookingDetailTotalSummary.vue";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { handleApiError, logError } from "@/utils/errorHandler";
import { toMoneyNumber } from "@/utils/money";
import { canPelangganCancelBooking } from "@/utils/statusBadge";
import type { Booking } from "@/types/booking";

const route = useRoute();
const toast = useToast();

const booking = ref<Booking | null>(null);
const isLoading = ref(true);
const isCancelling = ref(false);
const showCancelConfirm = ref(false);
const errorMessage = ref("");

const bookingId = computed(() => Number(route.params.id));

const getServiceSnapshotPrice = (layanan: Booking["layanan"][number]) =>
  toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0);

const totalLayanan = computed(
  () =>
    booking.value?.layanan?.reduce(
      (sum, layanan) => sum + getServiceSnapshotPrice(layanan),
      0,
    ) || 0,
);

const totalSukuCadang = computed(
  () =>
    booking.value?.item_pemesanan?.reduce(
      (sum, item) => sum + toMoneyNumber(item.harga_saat_ini) * item.jumlah,
      0,
    ) || 0,
);

const totalBiaya = computed(() => {
  const rawTotal = booking.value?.total_harga;

  if (rawTotal === null || rawTotal === undefined) {
    return totalLayanan.value + totalSukuCadang.value;
  }

  const parsedTotal = toMoneyNumber(rawTotal);
  return parsedTotal;
});

const canCancel = computed(() =>
  canPelangganCancelBooking(booking.value?.status || null),
);

const fetchBookingDetail = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  if (!Number.isFinite(bookingId.value) || bookingId.value <= 0) {
    errorMessage.value = "ID pemesanan tidak valid.";
    isLoading.value = false;
    return;
  }

  const headers = getAuthHeaders();
  if (!Object.keys(headers).length) {
    isLoading.value = false;
    return;
  }

  try {
    const { data } = await axios.get(
      `${API_URL}/pemesanan/${bookingId.value}`,
      {
        headers,
      },
    );

    booking.value = data?.data || data;
  } catch (error: any) {
    logError(error, "fetchBookingDetail");
    errorMessage.value = handleApiError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleConfirmCancel = async () => {
  if (!booking.value || isCancelling.value) {
    return;
  }

  isCancelling.value = true;
  const headers = getAuthHeaders();

  try {
    await axios.post(
      `${API_URL}/pemesanan/${booking.value.id}/batalkan`,
      {},
      { headers },
    );

    toast.success("Pemesanan berhasil dibatalkan");
    showCancelConfirm.value = false;
    await fetchBookingDetail();
  } catch (error: any) {
    logError(error, "cancelBookingFromDetail");
    toast.error(handleApiError(error));
  } finally {
    isCancelling.value = false;
  }
};

onMounted(() => {
  fetchBookingDetail();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        booking
          ? `Lihat rincian lengkap untuk ${booking.kode_pemesanan}`
          : 'Lihat rincian lengkap pemesanan servis Anda'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    >
      <template #actions>
        <router-link
          to="/app/riwayat"
          class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white no-underline backdrop-blur-sm transition hover:bg-white/20"
        >
          <i class="mdi mdi-arrow-left"></i>
          <span class="font-medium">Kembali</span>
        </router-link>
      </template>
    </AppPageHeader>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner v-if="isLoading" message="Memuat detail pemesanan..." />

      <div
        v-else-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        <p class="font-semibold mb-1">Gagal memuat detail pemesanan</p>
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <div v-else-if="booking" class="space-y-6">
        <PelangganBookingDetailInfoCards :booking="booking" />

        <PelangganBookingDetailServiceSparepartGrid :booking="booking" />

        <PelangganBookingDetailNotesGrid :booking="booking" />

        <PelangganBookingDetailTotalSummary
          :total-layanan="totalLayanan"
          :total-suku-cadang="totalSukuCadang"
          :total-biaya="totalBiaya"
          :can-cancel="canCancel"
          :is-cancelling="isCancelling"
          @cancel="showCancelConfirm = true"
        />
      </div>
    </div>

    <ConfirmationModal
      :show="showCancelConfirm"
      title="Batalkan Pemesanan"
      message="Apakah Anda yakin ingin membatalkan pemesanan ini?"
      confirm-text="Ya, Batalkan"
      cancel-text="Tidak"
      variant="danger"
      @confirm="handleConfirmCancel"
      @cancel="showCancelConfirm = false"
    />
  </div>
</template>
