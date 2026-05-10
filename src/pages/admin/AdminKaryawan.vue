<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentUser } from "@/utils/auth";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import CustomSelect from "@/components/ui/CustomSelect.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import { formatDateShort } from "@/utils/date";

// State
const karyawanList = ref<any[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const showDeleteConfirm = ref(false);
const karyawanToDelete = ref<number | null>(null);
const formData = ref({
  id: "",
  nama: "",
  email: "",
  no_telepon: "",
  password: "",
  role: "mekanik",
});

const currentUser = getCurrentUser();
const token = localStorage.getItem("token");
const router = useRouter();
const toast = useToast();
// Fetch Data
const fetchKaryawan = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/api/admin/karyawan");
    karyawanList.value = response.data.data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    isLoading.value = false;
  }
};

// Actions
const openModal = (karyawan?: any) => {
  if (karyawan) {
    isEditMode.value = true;
    formData.value = {
      id: karyawan.id,
      nama: karyawan.nama,
      email: karyawan.email,
      no_telepon: karyawan.no_telepon || "",
      password: "", // Kosongkan password saat edit
      role: karyawan.role,
    };
  } else {
    isEditMode.value = false;
    formData.value = {
      id: "",
      nama: "",
      email: "",
      no_telepon: "",
      password: "",
      role: "mekanik",
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveKaryawan = async () => {
  try {
    const url = isEditMode.value
      ? `/api/admin/karyawan/${formData.value.id}`
      : "/api/admin/karyawan";

    // Jika tidak isi password saat edit, jangan kirim password
    const bodyData: Record<string, any> = { ...formData.value };
    if (isEditMode.value && !bodyData.password) {
      delete bodyData.password;
    }

    if (isEditMode.value) {
      const response = await axios.put(url, bodyData);
      toast.success(response.data.message);
    } else {
      const response = await axios.post(url, bodyData);
      toast.success(response.data.message);
    }

    closeModal();
    fetchKaryawan(); // Refresh data
  } catch (error: any) {
    console.error("Error menyimpan karyawan:", error);
    if (error.response && error.response.data) {
      toast.error(
        error.response.data.message ||
          Object.values(error.response.data.errors || {})
            .flat()
            .join("\n"),
      );
    } else {
      toast.error("Terjadi kesalahan sistem.");
    }
  }
};

const konfirmasiHapus = (id: number) => {
  karyawanToDelete.value = id;
  showDeleteConfirm.value = true;
};

const hapusKaryawan = async () => {
  if (!karyawanToDelete.value) return;

  const id = karyawanToDelete.value;
  try {
    const response = await axios.delete(`/api/admin/karyawan/${id}`);
    toast.success(response.data.message);
    fetchKaryawan();
  } catch (error: any) {
    console.error("Error menghapus karyawan:", error);
    toast.error(error.response?.data?.message || "Gagal menghapus karyawan");
  } finally {
    showDeleteConfirm.value = false;
    karyawanToDelete.value = null;
  }
};

onMounted(() => {
  fetchKaryawan();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Manajemen Karyawan"
      icon="mdi-account-group"
      subtitle="Kelola akun admin dan mekanik KR Garage"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 text-center text-gray-500">
        Memuat data...
      </div>

      <!-- Data Karyawan (Card Grid) -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Tombol Tambah Karyawan (Card) -->
        <button
          @click="openModal()"
          class="flex flex-col items-center justify-center p-6 text-gray-400 transition-all bg-transparent border-2 border-gray-300 border-dashed rounded-xl hover:border-red-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[220px] group"
        >
          <i
            class="mb-2 text-5xl transition-transform mdi mdi-plus-circle-outline group-hover:scale-110"
          ></i>
          <span class="text-sm font-semibold tracking-wide uppercase"
            >Tambah Karyawan</span
          >
        </button>

        <div
          v-for="karyawan in karyawanList"
          :key="karyawan.id"
          class="flex flex-col p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">
                {{ karyawan.nama }}
              </h3>
              <p class="text-sm text-gray-500">
                Bergabung:
                {{ formatDateShort(karyawan.created_at) }}
              </p>
            </div>
            <span
              class="inline-flex px-2.5 py-0.5 text-xs font-semibold leading-5 rounded-full"
              :class="
                karyawan.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              "
            >
              {{ karyawan.role }}
            </span>
          </div>

          <div class="flex-1 mb-6 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <span
                class="mr-2 text-lg text-gray-400 mdi mdi-email-outline"
              ></span>
              {{ karyawan.email }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <span
                class="mr-2 text-lg text-gray-400 mdi mdi-phone-outline"
              ></span>
              {{ karyawan.no_telepon || "-" }}
            </div>
          </div>

          <div
            class="flex items-center justify-end gap-3 pt-4 mt-auto border-t border-gray-100"
          >
            <button
              @click="openModal(karyawan)"
              class="flex items-center px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-md hover:bg-indigo-100"
            >
              Edit
            </button>

            <!-- Sembunyikan tombol hapus jika itu adalah akun sendiri -->
            <button
              v-if="currentUser?.id !== karyawan.id"
              @click="konfirmasiHapus(karyawan.id)"
              class="flex items-center px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-transparent rounded-md hover:bg-red-100"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Form -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm"
            @click="closeModal"
          ></div>

          <div
            class="relative w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl sm:my-8"
          >
            <div
              class="flex items-center justify-between pb-4 border-b border-gray-100"
            >
              <h3
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <i
                  :class="
                    isEditMode
                      ? 'mdi mdi-account-edit text-blue-600'
                      : 'mdi mdi-account-plus text-blue-600'
                  "
                ></i>
                {{ isEditMode ? "Edit Karyawan" : "Tambah Karyawan Baru" }}
              </h3>
            </div>

            <form
              @submit.prevent="saveKaryawan"
              autocomplete="off"
              class="mt-5 space-y-4"
            >
              <!-- Form Fields -->
              <div>
                <label class="block mb-1.5 text-sm font-medium text-gray-700"
                  >Nama Lengkap</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <i
                      class="text-gray-400 mdi mdi-account-outline text-lg leading-none"
                    ></i>
                  </div>
                  <input
                    v-model="formData.nama"
                    autocomplete="off"
                    type="text"
                    required
                    minlength="3"
                    pattern="^[a-zA-Z\s]*$"
                    title="Nama hanya boleh berisi huruf dan spasi, minimal 3 karakter"
                    placeholder="Masukkan nama lengkap"
                    class="block w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label class="block mb-1.5 text-sm font-medium text-gray-700"
                  >Email</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <i
                      class="text-gray-400 mdi mdi-email-outline text-lg leading-none"
                    ></i>
                  </div>
                  <input
                    v-model="formData.email"
                    autocomplete="new-password"
                    type="email"
                    required
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    title="Masukkan alamat email yang valid (contoh: nama@domain.com)"
                    placeholder="nama@email.com"
                    class="block w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label class="block mb-1.5 text-sm font-medium text-gray-700"
                  >Nomor Telepon</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <i
                      class="text-gray-400 mdi mdi-phone-outline text-lg leading-none"
                    ></i>
                  </div>
                  <input
                    v-model="formData.no_telepon"
                    autocomplete="off"
                    type="tel"
                    required
                    minlength="10"
                    maxlength="15"
                    pattern="^[0-9+]*$"
                    title="Nomor telepon hanya boleh berisi angka (opsional awalan +), minimal 10 digit"
                    placeholder="08xxxxxxxxxx"
                    class="block w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <div class="relative">
                    <CustomSelect
                      v-model="formData.role"
                      label="Role"
                      :options="[
                        { value: 'mekanik', label: 'Mekanik' },
                        { value: 'admin', label: 'Admin' },
                      ]"
                    />
                  </div>
                </div>

                <div>
                  <label class="block mb-1.5 text-sm font-medium text-gray-700">
                    Password
                    <span
                      v-if="isEditMode"
                      class="text-[10px] font-normal text-gray-500 block -mt-0.5 leading-none"
                      >(Opsional)</span
                    >
                  </label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                    >
                      <i
                        class="text-gray-400 mdi mdi-lock-outline text-lg leading-none"
                      ></i>
                    </div>
                    <input
                      v-model="formData.password"
                      autocomplete="new-password"
                      type="password"
                      :required="!isEditMode"
                      minlength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Harus 8+ karakter, berisi huruf besar, huruf kecil, dan angka"
                      placeholder="Minimal 8 karakter"
                      class="block w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col-reverse gap-3 pt-5 mt-2 sm:flex-row sm:justify-end border-t border-gray-100"
              >
                <button
                  type="button"
                  @click="closeModal"
                  class="inline-flex justify-center w-full px-5 py-2.5 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-white transition-all bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                  <i class="mr-2 mdi mdi-content-save text-lg leading-none"></i>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Akun Karyawan"
      message="Apakah Anda yakin ingin menghapus akun karyawan ini? Tindakan ini tidak dapat dibatalkan dan semua hak aksesnya akan terhapus."
      variant="danger"
      confirmText="Ya, Hapus Akun"
      cancelText="Batal"
      @confirm="hapusKaryawan"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
