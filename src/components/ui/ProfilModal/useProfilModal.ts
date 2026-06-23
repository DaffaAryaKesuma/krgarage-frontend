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

type ProfileField = "nama" | "email" | "no_telepon";
type PasswordField =
  | "password_lama"
  | "password_baru"
  | "password_baru_confirmation";

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
  const profilErrors = ref<Record<ProfileField, string>>({
    nama: "",
    email: "",
    no_telepon: "",
  });
  const passwordErrors = ref<Record<PasswordField, string>>({
    password_lama: "",
    password_baru: "",
    password_baru_confirmation: "",
  });
  const profilTouched = ref<Record<ProfileField, boolean>>({
    nama: false,
    email: false,
    no_telepon: false,
  });
  const passwordTouched = ref<Record<PasswordField, boolean>>({
    password_lama: false,
    password_baru: false,
    password_baru_confirmation: false,
  });

  const validateProfileField = (field: ProfileField): boolean => {
    const value = profilForm.value[field].trim();
    if (field === "nama") {
      profilErrors.value.nama = !value
        ? "Nama lengkap wajib diisi."
        : value.length < 3
          ? "Nama lengkap minimal 3 karakter."
          : "";
    } else if (field === "email") {
      profilErrors.value.email = !value
        ? "Email wajib diisi."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
          ? "Masukkan alamat email yang valid."
          : "";
    } else {
      profilErrors.value.no_telepon = !value
        ? "Nomor telepon wajib diisi."
        : !/^(08[0-9]{8,13}|\+628[0-9]{8,13})$/.test(value)
          ? "Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxxx."
          : "";
    }
    return !profilErrors.value[field];
  };

  const validatePasswordField = (field: PasswordField): boolean => {
    const value = passwordForm.value[field];
    if (field === "password_lama") {
      passwordErrors.value.password_lama = value
        ? ""
        : "Password saat ini wajib diisi.";
    } else if (field === "password_baru") {
      passwordErrors.value.password_baru = !value
        ? "Password baru wajib diisi."
        : value.length < 8
          ? "Password baru minimal 8 karakter."
          : !/[A-Z]/.test(value) || !/[0-9]/.test(value)
            ? "Password baru harus mengandung huruf besar dan angka."
            : "";
    } else {
      passwordErrors.value.password_baru_confirmation = !value
        ? "Konfirmasi password wajib diisi."
        : value !== passwordForm.value.password_baru
          ? "Konfirmasi password baru tidak cocok."
          : "";
    }
    return !passwordErrors.value[field];
  };

  const handleProfileBlur = (field: ProfileField) => {
    profilTouched.value[field] = true;
    validateProfileField(field);
  };

  const handlePasswordBlur = (field: PasswordField) => {
    passwordTouched.value[field] = true;
    validatePasswordField(field);
  };

  const handleProfileInput = (field: ProfileField) => {
    if (profilTouched.value[field]) validateProfileField(field);
  };

  const handlePasswordInput = (field: PasswordField) => {
    if (passwordTouched.value[field]) validatePasswordField(field);
    if (
      field === "password_baru" &&
      passwordTouched.value.password_baru_confirmation
    ) {
      validatePasswordField("password_baru_confirmation");
    }
  };

  const handleProfilePhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const filtered = input.value.startsWith("+")
      ? `+${input.value.slice(1).replace(/\D/g, "")}`
      : input.value.replace(/\D/g, "");
    profilForm.value.no_telepon = filtered.slice(0, 17);
    input.value = profilForm.value.no_telepon;
    handleProfileInput("no_telepon");
  };

  const getProfileInputClass = (field: ProfileField) =>
    getFormInputClass(
      profilTouched.value[field] && Boolean(profilErrors.value[field]),
    );
  const getPasswordInputClass = (field: PasswordField) =>
    getFormInputClass(
      passwordTouched.value[field] && Boolean(passwordErrors.value[field]),
    );

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
        profilTouched.value = { nama: false, email: false, no_telepon: false };
        profilErrors.value = { nama: "", email: "", no_telepon: "" };
      } else {
        passwordForm.value = { password_lama: "", password_baru: "", password_baru_confirmation: "" };
        passwordTouched.value = {
          password_lama: false,
          password_baru: false,
          password_baru_confirmation: false,
        };
        passwordErrors.value = {
          password_lama: "",
          password_baru: "",
          password_baru_confirmation: "",
        };
      }
    },
    { immediate: true },
  );

  // Submit update profil ke backend.
  const handleUpdateProfil = async () => {
    const fields: ProfileField[] = ["nama", "email", "no_telepon"];
    fields.forEach((field) => {
      profilTouched.value[field] = true;
      validateProfileField(field);
    });
    if (fields.some((field) => profilErrors.value[field])) return;

    const nama = profilForm.value.nama.trim();
    const nomorTelepon = profilForm.value.no_telepon.replace(/\s/g, "");

    profilForm.value.nama = nama;
    profilForm.value.no_telepon = nomorTelepon;
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
    const fields: PasswordField[] = [
      "password_lama",
      "password_baru",
      "password_baru_confirmation",
    ];
    fields.forEach((field) => {
      passwordTouched.value[field] = true;
      validatePasswordField(field);
    });
    if (fields.some((field) => passwordErrors.value[field])) return;

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
  const labelClass = FORM_LABEL_CLASS;

  // State dan aksi yang dipakai ProfilModal.vue.
  return {
    loading,
    user,
    profilForm,
    passwordForm,
    profilErrors,
    passwordErrors,
    profilTouched,
    passwordTouched,
    handleProfileBlur,
    handlePasswordBlur,
    handleProfileInput,
    handlePasswordInput,
    handleProfilePhoneInput,
    getProfileInputClass,
    getPasswordInputClass,
    labelClass,
    handleUpdateProfil,
    handleGantiPassword,
  };
}
