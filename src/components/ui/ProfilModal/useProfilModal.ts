import { ref, watch } from "vue";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/utils/useToast";
import { logError, handleApiError } from "@/utils/errorHandler";
import { scrollLock } from "@/composables/scrollLock";

export function useProfilModal(
  getShow: () => boolean,
  emit: (e: "close") => void,
) {
  scrollLock(getShow);

  const toast = useToast();
  const loading = ref(false);
  const user = ref<any>(null);

  const profilForm = ref({ nama: "", email: "", no_telepon: "" });
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

  watch(
    getShow,
    (newVal) => {
      if (newVal) {
        loadUserData();
      } else {
        passwordForm.value = { password_lama: "", password_baru: "", password_baru_confirmation: "" };
      }
    },
    { immediate: true },
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
    if (passwordBaru.length < 8) { toast.error("Password baru minimal 8 karakter."); return; }
    if (!/[A-Z]/.test(passwordBaru)) { toast.error("Password baru harus mengandung minimal 1 huruf besar."); return; }
    if (!/[0-9]/.test(passwordBaru)) { toast.error("Password baru harus mengandung minimal 1 angka."); return; }
    if (passwordBaru !== passwordForm.value.password_baru_confirmation) { toast.error("Konfirmasi password baru tidak cocok."); return; }

    loading.value = true;
    try {
      await axios.put(
        `${API_URL}/profil/password`,
        {
          password_lama: passwordForm.value.password_lama,
          password_baru: passwordForm.value.password_baru,
          password_baru_confirmation: passwordForm.value.password_baru_confirmation,
        },
        { headers: getAuthHeaders() },
      );
      toast.success("Password berhasil diganti!");
      passwordForm.value = { password_lama: "", password_baru: "", password_baru_confirmation: "" };
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
    "mb-1 block text-sm font-medium text-gray-700 tracking-wider";

  return {
    loading,
    user,
    profilForm,
    passwordForm,
    inputClass,
    labelClass,
    handleUpdateProfil,
    handleGantiPassword,
  };
}
