<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/utils/useToast";
import { logError, handleApiError } from "@/utils/errorHandler";
import { formatNama } from "@/utils/format";

interface Props {
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();

// State
const loading = ref(false);
const user = ref<any>(null);

const profilForm = ref({
  nama: "",
  email: "",
  no_telepon: "",
});

const passwordForm = ref({
  password_lama: "",
  password_baru: "",
  password_baru_confirmation: "",
});

const loadUserData = () => {
  const userString = localStorage.getItem("user");
  if (userString) {
    user.value = JSON.parse(userString);
    profilForm.value = {
      nama: user.value.nama,
      email: user.value.email,
      no_telepon: user.value.no_telepon,
    };
  }
};

onMounted(loadUserData);

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      loadUserData();
    } else {
      // Reset form password saat modal ditutup
      passwordForm.value = {
        password_lama: "",
        password_baru: "",
        password_baru_confirmation: "",
      };
    }
  },
);

const handleUpdateProfil = async () => {
  loading.value = true;
  try {
    const { data } = await axios.put(`${API_URL}/profil`, profilForm.value, {
      headers: getAuthHeaders(),
    });

    const updatedUser = data.data;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    user.value = updatedUser;

    toast.success("Profil berhasil diperbarui!");
  } catch (error: any) {
    logError(error, "handleUpdateProfil");
    toast.error(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

const handleGantiPassword = async () => {
  const passwordBaru = passwordForm.value.password_baru;

  // Validasi frontend sebelum kirim ke server
  if (passwordBaru.length < 8) {
    toast.error("Password baru minimal 8 karakter.");
    return;
  }
  if (!/[A-Z]/.test(passwordBaru)) {
    toast.error("Password baru harus mengandung minimal 1 huruf besar.");
    return;
  }
  if (!/[0-9]/.test(passwordBaru)) {
    toast.error("Password baru harus mengandung minimal 1 angka.");
    return;
  }
  if (passwordBaru !== passwordForm.value.password_baru_confirmation) {
    toast.error("Konfirmasi password baru tidak cocok.");
    return;
  }

  loading.value = true;
  try {
    await axios.put(
      `${API_URL}/profil/password`,
      {
        password_lama: passwordForm.value.password_lama,
        password_baru: passwordForm.value.password_baru,
        password_baru_confirmation:
          passwordForm.value.password_baru_confirmation,
      },
      {
        headers: getAuthHeaders(),
      },
    );

    toast.success("Password berhasil diganti!");
    passwordForm.value = {
      password_lama: "",
      password_baru: "",
      password_baru_confirmation: "",
    };
  } catch (error: any) {
    logError(error, "handleGantiPassword");
    toast.error(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50";
const labelClass =
  "mb-1 block text-sm font-medium text-gray-700  tracking-wider";
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-account-circle text-red-600"></i>
          Profil Saya
        </h2>
        <button
          @click="emit('close')"
          class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <div v-if="user" class="p-6 space-y-8">
        <!-- Profile Info Section -->
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Avatar -->
          <div
            class="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0"
          >
            <div
              class="h-28 w-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-red-50"
            >
              {{
                formatNama(user.nama)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              }}
            </div>
            <div class="text-center">
              <span
                class="inline-block px-3 py-1 rounded-full bg-red-100 text-[10px] font-bold text-red-700 uppercase tracking-widest"
              >
                {{ user.role }}
              </span>
            </div>
          </div>

          <!-- Form Info -->
          <form
            @submit.prevent="handleUpdateProfil"
            class="flex-1 w-full space-y-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">Nama Lengkap</label>
                <input
                  v-model="profilForm.nama"
                  type="text"
                  :class="inputClass"
                  required
                />
              </div>
              <div>
                <label :class="labelClass">Nomor Telepon</label>
                <input
                  v-model="profilForm.no_telepon"
                  type="tel"
                  @input="
                    profilForm.no_telepon = profilForm.no_telepon.replace(
                      /[^0-9]/g,
                      '',
                    )
                  "
                  :class="inputClass"
                  required
                />
              </div>
            </div>

            <div>
              <label :class="labelClass">Email</label>
              <input
                v-model="profilForm.email"
                type="email"
                :class="inputClass"
                required
              />
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400 shadow-md"
              >
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
                Simpan Profil
              </button>
            </div>
          </form>
        </div>

        <!-- Password Section -->
        <div>
          <h3
            class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            <i class="mdi mdi-shield-lock text-red-600"></i>
            Ganti Password
          </h3>
          <form @submit.prevent="handleGantiPassword" class="space-y-4">
            <div>
              <label :class="labelClass">Password Saat Ini</label>
              <input
                v-model="passwordForm.password_lama"
                type="password"
                :class="inputClass"
                required
                placeholder="••••••••"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">Password Baru</label>
                <input
                  v-model="passwordForm.password_baru"
                  type="password"
                  :class="inputClass"
                  required
                  placeholder="Min. 8 karakter, 1 huruf besar, dan 1 angka"
                />
              </div>
              <div>
                <label :class="labelClass">Konfirmasi Password</label>
                <input
                  v-model="passwordForm.password_baru_confirmation"
                  type="password"
                  :class="inputClass"
                  required
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="flex items-center gap-2 rounded-xl border-2 border-red-600 px-6 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-400"
              >
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
                Ganti Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
