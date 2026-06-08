<script setup lang="ts">
// onMounted menjalankan fetch detail saat halaman dibuka.
import { onMounted } from "vue";
// useRoute dipakai untuk mengambil id pemesanan dari URL.
import { useRoute } from "vue-router";
// Modal konfirmasi untuk hapus suku cadang dari pemesanan.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Loading saat detail pemesanan masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Header standar halaman.
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
// Kartu info pelanggan, vespa, dan jadwal.
import AdminPemesananInfoKartu from "@/components/admin/pemesanan-detail/AdminPemesananDetailInfoKartu/AdminPemesananInfoKartu.vue";
// Panel kontrol status, mekanik, dan pembayaran.
import AdminPemesananPanelKontrol from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/AdminPemesananPanelKontrol.vue";
// Daftar layanan dan item suku cadang.
import AdminPemesananRincianDaftar from "@/components/admin/pemesanan-detail/AdminPemesananDetailRincianDaftar/AdminPemesananRincianDaftar.vue";
// Ringkasan total biaya.
import AdminPemesananTotalRingkasan from "@/components/admin/pemesanan-detail/AdminPemesananDetailTotalRingkasan/AdminPemesananTotalRingkasan.vue";
// Komponen catatan pelanggan dan mekanik.
import AdminPemesananCatatan from "@/components/admin/pemesanan-detail/AdminPemesananDetailCatatan/AdminPemesananCatatan.vue";
// Modal untuk menambahkan suku cadang ke pemesanan.
import TambahSukuCadangModal from "@/components/ui/TambahSukuCadangModal/TambahSukuCadangModal.vue";
// Class alert reusable.
import { getAlertBoxClass, getAlertIconClass } from "@/utils/badgeVariants";
// Helper class tombol halaman.
import { getButtonClass } from "@/utils/buttonVariants";
// Composable logic detail pemesanan admin.
import { useAdminPemesananDetailPage } from "./useAdminPemesananDetailPage";

// Ambil data route, terutama params.id.
const route = useRoute();
// Kirim id pemesanan dari URL ke composable.
const {
  pemesanan,
  isLoading,
  error,
  showAddSukuCadangModal,
  availableSukuCadang,
  isAddingSukuCadang,
  showDeleteConfirm,
  isInProgress,
  totalHarga,
  totalSukuCadang,
  totalAkhir,
  fetchPemesananData,
  openAddSukuCadangModal,
  closeAddSukuCadangModal,
  addSukuCadangToPemesanan,
  promptDeleteSukuCadang,
  removeSukuCadangFromPemesanan,
} = useAdminPemesananDetailPage(String(route.params.id));

// Saat halaman dibuka, ambil detail pemesanan dari API.
onMounted(async () => {
  isLoading.value = true;
  await fetchPemesananData();
  isLoading.value = false;
});
</script>

<template>
  <!-- Container halaman detail pemesanan admin. -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header dengan subtitle dinamis berdasarkan kode pemesanan. -->
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        pemesanan
          ? `Kelola rincian lengkap untuk ${pemesanan.kode_pemesanan}`
          : 'Kelola rincian lengkap pemesanan pelanggan'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <!-- Area konten detail. -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading selama detail API dimuat. -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Alert error jika detail gagal diambil. -->
      <div
        v-else-if="error"
        :class="[getAlertBoxClass('error'), 'text-center']"
      >
        <i
          :class="[getAlertIconClass('error'), 'mdi mdi-alert-circle mb-2 text-4xl']"
        ></i>
        <p class="font-medium">{{ error }}</p>
      </div>

      <!-- Konten detail hanya tampil jika data pemesanan tersedia. -->
      <div v-else-if="pemesanan" class="space-y-6">
        <section>
          <!-- Kartu info utama berisi pelanggan, vespa, dan jadwal. -->
          <AdminPemesananInfoKartu
            :user="pemesanan.pengguna"
            :vespa="pemesanan.vespa"
            :tanggal-pemesanan="pemesanan.tanggal_pemesanan"
            :jam-pemesanan="pemesanan.jam_pemesanan"
          >
            <!-- Panel kontrol diletakkan di dalam slot kartu info. -->
            <AdminPemesananPanelKontrol
              :pemesanan-id="pemesanan.id"
              :current-status="pemesanan.status"
              :current-pembayaran-status="pemesanan.status_pembayaran"
              :completed-at="pemesanan.completed_at"
              :paid-at="pemesanan.paid_at"
              :current-mekanik-id="pemesanan.id_mekanik"
              :current-mekanik-name="pemesanan.mekanik?.nama"
              @refresh="fetchPemesananData"
            />
          </AdminPemesananInfoKartu>
        </section>

        <!-- Catatan pelanggan dan mekanik. -->
        <AdminPemesananCatatan 
          :catatan-pelanggan="pemesanan.catatan_pelanggan"
          :catatan-mekanik="pemesanan.catatan_mekanik"
        />

        <!-- Rincian layanan dan suku cadang, termasuk tombol tambah/hapus item. -->
        <AdminPemesananRincianDaftar
          :layanan="pemesanan.layanan"
          :pemesanan-items="pemesanan.item_pemesanan"
          :is-in-progress="isInProgress"
          @add-suku-cadang="openAddSukuCadangModal"
          @delete-item="promptDeleteSukuCadang"
        />

        <!-- Ringkasan total dan modal tambah suku cadang. -->
        <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <AdminPemesananTotalRingkasan
            :total-harga="totalHarga"
            :total-suku-cadang="totalSukuCadang"
            :grand-total="totalAkhir"
          />

          <!-- Modal ini muncul saat admin menambah suku cadang ke pemesanan. -->
          <TambahSukuCadangModal
            :show="showAddSukuCadangModal"
            :suku-cadang="availableSukuCadang"
            :is-submitting="isAddingSukuCadang"
            @submit="addSukuCadangToPemesanan"
            @close="closeAddSukuCadangModal"
          />
        </section>

        <!-- Aksi kembali diletakkan di bawah detail agar konsisten dengan halaman pelanggan. -->
        <div class="flex">
          <router-link
            to="/admin/pemesanan"
            :class="getButtonClass('secondary', 'md', 'w-fit no-underline')"
          >
            <i class="mdi mdi-arrow-left"></i>
            <span>Kembali</span>
          </router-link>
        </div>
      </div>

      <!-- Konfirmasi hapus item suku cadang dari pemesanan. -->
      <ConfirmationModal
        :show="showDeleteConfirm"
        title="Hapus Suku Cadang"
        message="Apakah Anda yakin ingin menghapus suku cadang ini dari pemesanan?"
        confirm-text="Hapus"
        cancel-text="Batal"
        variant="danger"
        @confirm="removeSukuCadangFromPemesanan"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>
