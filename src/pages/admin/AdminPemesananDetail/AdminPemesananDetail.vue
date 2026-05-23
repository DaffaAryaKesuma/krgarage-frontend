<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminPemesananInfoKartu from "@/components/admin/pemesanan-detail/AdminPemesananDetailInfoKartu/AdminPemesananInfoKartu.vue";
import AdminPemesananPanelKontrol from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/AdminPemesananPanelKontrol.vue";
import AdminPemesananRincianDaftar from "@/components/admin/pemesanan-detail/AdminPemesananDetailRincianDaftar/AdminPemesananRincianDaftar.vue";
import AdminPemesananTotalRingkasan from "@/components/admin/pemesanan-detail/AdminPemesananDetailTotalRingkasan/AdminPemesananTotalRingkasan.vue";
import AdminPemesananCatatan from "@/components/admin/pemesanan-detail/AdminPemesananDetailCatatan/AdminPemesananCatatan.vue";
import TambahSukuCadangModal from "@/components/ui/TambahSukuCadangModal/TambahSukuCadangModal.vue";
import { useAdminPemesananDetailPage } from "./useAdminPemesananDetailPage";

const route = useRoute();
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

// Lifecycle
onMounted(async () => {
  isLoading.value = true;
  await fetchPemesananData();
  isLoading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Detail Pemesanan"
      icon="mdi-clipboard-text"
      :subtitle="
        pemesanan
          ? `Kelola rincian lengkap untuk ${pemesanan.kode_pemesanan}`
          : 'Kelola rincian lengkap pemesanan pelanggan'
      "
      subtitle-class="text-sm sm:text-base text-red-100"
    >
      <template #aksi>
        <router-link
          to="/admin/pemesanan"
          class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white no-underline backdrop-blur-sm transition hover:bg-white/20"
        >
          <i class="mdi mdi-arrow-left"></i>
          <span class="font-medium">Kembali</span>
        </router-link>
      </template>
    </AppPageHeader>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <i class="mdi mdi-alert-circle mb-2 text-4xl text-red-600"></i>
        <p class="font-medium text-red-800">{{ error }}</p>
      </div>

      <div v-else-if="pemesanan" class="space-y-6">
        <section>
          <AdminPemesananInfoKartu
            :user="pemesanan.pengguna"
            :vespa="pemesanan.vespa"
            :tanggal-pemesanan="pemesanan.tanggal_pemesanan"
            :jam-pemesanan="pemesanan.jam_pemesanan"
          >
            <AdminPemesananPanelKontrol
              :pemesanan-id="pemesanan.id"
              :current-status="pemesanan.status"
              :current-pembayaran-status="pemesanan.status_pembayaran"
              :current-mekanik-id="pemesanan.id_mekanik"
              :current-mekanik-name="pemesanan.mekanik?.nama"
              @refresh="fetchPemesananData"
            />
          </AdminPemesananInfoKartu>
        </section>

        <AdminPemesananCatatan 
          :catatan-pelanggan="pemesanan.catatan_pelanggan"
          :catatan-mekanik="pemesanan.catatan_mekanik"
        />

        <AdminPemesananRincianDaftar
          :layanan="pemesanan.layanan"
          :pemesanan-items="pemesanan.item_pemesanan"
          :is-in-progress="isInProgress"
          @add-suku-cadang="openAddSukuCadangModal"
          @delete-item="promptDeleteSukuCadang"
        />

        <section class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <AdminPemesananTotalRingkasan
            :total-harga="totalHarga"
            :total-suku-cadang="totalSukuCadang"
            :grand-total="totalAkhir"
          />

          <TambahSukuCadangModal
            :show="showAddSukuCadangModal"
            :suku-cadang="availableSukuCadang"
            :is-submitting="isAddingSukuCadang"
            @submit="addSukuCadangToPemesanan"
            @close="closeAddSukuCadangModal"
          />
        </section>
      </div>

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
