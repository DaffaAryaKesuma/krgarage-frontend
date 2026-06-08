<script setup lang="ts">
// Header halaman detail pemesanan.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Loading saat detail masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Modal konfirmasi pembatalan pemesanan.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Kartu informasi utama pemesanan, Vespa, mekanik, dan status.
import PelangganPemesananDetailInfoKartu from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailInfoKartu.vue";
// Grid rincian layanan dan suku cadang.
import PelangganPemesananDetailLayananSukuCadangGrid from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailLayananSukuCadangGrid.vue";
// Grid catatan pelanggan dan mekanik.
import PelangganPemesananDetailCatatanGrid from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailCatatanGrid.vue";
// Ringkasan total biaya dan tombol batal jika masih bisa dibatalkan.
import PelangganPemesananDetailTotalRingkasan from "@/components/pelanggan/pemesanan-detail/PelangganPemesananDetailTotalRingkasan.vue";
// Helper class untuk alert error.
import { getAlertBoxClass } from "@/utils/badgeVariants";
// Helper class tombol halaman.
import { getButtonClass } from "@/utils/buttonVariants";
// Mengambil logika halaman detail pemesanan.
import { usePelangganPemesananDetailPage } from "./usePelangganPemesananDetailPage";

// Mengambil state dan fungsi dari composable detail pemesanan.
const {
  // Data detail pemesanan.
  pemesanan,
  // Status loading detail.
  isLoading,
  // Status saat pembatalan sedang diproses.
  isCancelling,
  // Status tampil modal konfirmasi batal.
  showCancelConfirm,
  // Pesan error jika detail gagal dimuat.
  errorMessage,
  // Total biaya layanan.
  totalLayanan,
  // Total biaya suku cadang.
  totalSukuCadang,
  // Total biaya akhir.
  totalBiaya,
  // Apakah pemesanan masih bisa dibatalkan.
  canCancel,
  // Fungsi menjalankan pembatalan setelah konfirmasi.
  handleConfirmCancel,
} = usePelangganPemesananDetailPage();
</script>

<template>
  <!-- Wrapper utama halaman detail pemesanan. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header detail pemesanan. -->
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        pemesanan
          ? `Lihat rincian lengkap untuk ${pemesanan.kode_pemesanan}`
          : 'Lihat rincian lengkap pemesanan servis Anda'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten detail. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Tampilkan loading saat data detail masih diambil. -->
      <LoadingSpinner v-if="isLoading" message="Memuat detail pemesanan..." />

      <!-- Tampilkan pesan error jika API detail gagal. -->
      <div v-else-if="errorMessage" :class="getAlertBoxClass('error')">
        <p class="font-semibold mb-1">Gagal memuat detail pemesanan</p>
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Tampilkan konten detail jika data pemesanan tersedia. -->
      <div v-else-if="pemesanan" class="space-y-6">
        <!-- Informasi utama pemesanan. -->
        <PelangganPemesananDetailInfoKartu :pemesanan="pemesanan" />

        <!-- Rincian layanan dan suku cadang. -->
        <PelangganPemesananDetailLayananSukuCadangGrid :pemesanan="pemesanan" />

        <!-- Catatan pelanggan dan mekanik. -->
        <PelangganPemesananDetailCatatanGrid :pemesanan="pemesanan" />

        <!-- Ringkasan total biaya dan aksi batal. -->
        <PelangganPemesananDetailTotalRingkasan
          :total-layanan="totalLayanan"
          :total-suku-cadang="totalSukuCadang"
          :total-biaya="totalBiaya"
        />

        <!-- Aksi utama sejajar dengan tepi kiri dan kanan grid kartu. -->
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <!-- Tombol kembali ke halaman riwayat. -->
          <router-link
            to="/app/riwayat"
            :class="getButtonClass('secondary', 'md', 'w-fit no-underline')"
          >
            <i class="mdi mdi-arrow-left"></i>
            <span>Kembali</span>
          </router-link>

          <!-- Tombol batal hanya muncul jika status pemesanan masih boleh dibatalkan. -->
          <button
            v-if="canCancel"
            @click="showCancelConfirm = true"
            :disabled="isCancelling"
            :class="
              getButtonClass(
                'dangerOutline',
                'md',
                'w-fit disabled:cursor-not-allowed disabled:opacity-60',
              )
            "
          >
            <i v-if="isCancelling" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-close-circle"></i>
            <span>Batalkan Pemesanan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal konfirmasi pembatalan pemesanan. -->
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
