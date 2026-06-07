import { ref, watch } from "vue";
// Axios untuk request update profil/password.
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
// Toast untuk pesan sukses/gagal.
import { useToast } from "@/utils/useToast";
import { logError, handleApiError } from "@/utils/errorHandler";
// Lock scroll saat modal profil terbuka.
import { scrollLock } from "@/composables/scrollLock";
import { FORM_LABEL_CLASS, getFormInputClass } from "@/utils/formVariants";

// Composable logic modal profil.
export function useProfilModal(
  getShow: () => boolean,
  emit: (e: "close") => void,
) {
  // Lock scroll mengikuti nilai show dari parent.
  scrollLock(getShow);

  const toast = useToast();
  // Loading dipakai oleh tombol simpan profil dan ganti password.
  const loading = ref(false);
  // User login dari localStorage.
  const user = ref<any>(null);

  // Form data profil.
  const profilForm = ref({ nama: "", email: "", no_telepon: "" });
  // Form ganti password.
  const passwordForm = ref({
    password_lama: "",
    password_baru: "",
    password_baru_confirmation: "",
  });

  // Mengambil data user dari localStorage lalu mengisi form profil.
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

  // Saat modal dibuka, load user; saat ditutup, reset form password.
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

  // Submit update profil ke backend.
  const handleUpdateProfil = async () => {
    loading.value = true;
    try {
      const { data } = await axios.put(`${API_URL}/profil`, profilForm.value, {
        headers: getAuthHeaders(),
      });
      // Simpan data user terbaru ke localStorage agar navbar/modal ikut update.
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

  // Submit ganti password ke backend.
  const handleGantiPassword = async () => {
    const passwordBaru = passwordForm.value.password_baru;
    // Validasi frontend sebelum request agar feedback lebih cepat.
    if (passwordBaru.length < 8) { toast.error("Password baru minimal 8 karakter."); return; }
    if (!/[A-Z]/.test(passwordBaru)) { toast.error("Password baru harus mengandung minimal 1 huruf besar."); return; }
    if (!/[0-9]/.test(passwordBaru)) { toast.error("Password baru harus mengandung minimal 1 angka."); return; }
    if (passwordBaru !== passwordForm.value.password_baru_confirmation) { toast.error("Konfirmasi password baru tidak cocok."); return; }

    loading.value = true;
    try {
      // Kirim password lama, baru, dan konfirmasi sesuai format backend.
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
      // Bersihkan form password setelah berhasil.
      passwordForm.value = { password_lama: "", password_baru: "", password_baru_confirmation: "" };
    } catch (error: any) {
      logError(error, "handleGantiPassword");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  // Class form standar untuk input dan label.
  const inputClass = getFormInputClass();
  const labelClass = FORM_LABEL_CLASS;

  // State dan aksi yang dipakai ProfilModal.vue.
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
