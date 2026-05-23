<script setup lang="ts">
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import PelangganPemesananDetailInfoKartu from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailInfoKartu.vue";
import PelangganPemesananDetailLayananSukuCadangGrid from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailLayananSukuCadangGrid.vue";
import PelangganPemesananDetailCatatanGrid from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailCatatanGrid.vue";
import PelangganPemesananDetailTotalRingkasan from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailTotalRingkasan.vue";
import { usePelangganPemesananDetailPage } from "./usePelangganPemesananDetailPage";

const {
  pemesanan,
  isLoading,
  isCancelling,
  showCancelConfirm,
  errorMessage,
  totalLayanan,
  totalSukuCadang,
  totalBiaya,
  canCancel,
  handleConfirmCancel,
} = usePelangganPemesananDetailPage();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        pemesanan
          ? `Lihat rincian lengkap untuk ${pemesanan.kode_pemesanan}`
          : 'Lihat rincian lengkap pemesanan servis Anda'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    >
      <template #aksi>
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

      <div v-else-if="pemesanan" class="space-y-6">
        <PelangganPemesananDetailInfoKartu :pemesanan="pemesanan" />

        <PelangganPemesananDetailLayananSukuCadangGrid :pemesanan="pemesanan" />

        <PelangganPemesananDetailCatatanGrid :pemesanan="pemesanan" />

        <PelangganPemesananDetailTotalRingkasan
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
