// computed untuk validasi form, reactive untuk object form, ref untuk state sederhana, watch untuk reset modal.
import { computed, reactive, ref, watch } from "vue";
// Axios dipakai untuk request login ke backend.
import axios from "axios";
// Router dipakai untuk redirect setelah login berhasil.
import { useRouter } from "vue-router";
// Helper error agar pesan dari API tampil lebih rapi.
import { handleApiError, logError } from "@/utils/errorHandler";
// Base URL endpoint API backend.
import { API_URL } from "@/utils/api";
// Helper menentukan dashboard tujuan berdasarkan role.
import { getRedirectPathForRole } from "@/utils/roleRoutes";
// Mengunci scroll saat modal login terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper class input form.
import { getFormInputClass } from "@/utils/formVariants";

// Konfigurasi field login agar template bisa di-loop.
export const FORM_FIELDS = [
  { key: "email", label: "Email", type: "email", placeholder: "email@example.com" },
  { key: "password", label: "Password", type: "password", placeholder: "Masukkan password" },
];

// Aturan validasi sederhana untuk email dan password.
const VALIDATION_RULES = {
  email: [
    { test: (val: string) => val.trim() !== "", msg: "Email wajib diisi" },
    { test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), msg: "Format email salah" },
  ],
  password: [
    { test: (val: string) => val !== "", msg: "Password wajib diisi" },
    { test: (val: string) => val.length >= 6, msg: "Minimal 6 karakter" },
  ],
};

// Composable khusus modal login.
export function useMasukModal(
  getOpen: () => boolean,
  emit: (e: "close") => void,
) {
  // Kunci scroll body saat modal terbuka.
  scrollLock(getOpen);

  // State input login.
  const form = reactive({ email: "", password: "" });
  // Pesan error per field.
  const errors = reactive({ email: "", password: "" });
  // Menandai field yang sudah disentuh.
  const touched = reactive({ email: false, password: false });
  // Error global dari API login.
  const error = ref("");
  // Loading tombol submit.
  const isLoading = ref(false);
  // Router untuk pindah halaman setelah login.
  const router = useRouter();

  // Saat modal ditutup, kosongkan form dan error.
  watch(getOpen, (newVal) => {
    if (!newVal) {
      form.email = "";
      form.password = "";
      errors.email = "";
      errors.password = "";
      touched.email = false;
      touched.password = false;
      error.value = "";
    }
  });

  // Validasi satu field berdasarkan VALIDATION_RULES.
  const validate = (fieldKey: keyof typeof form) => {
    const rules = VALIDATION_RULES[fieldKey] || [];
    for (const rule of rules) {
      if (!rule.test(form[fieldKey])) {
        errors[fieldKey] = rule.msg;
        return;
      }
    }
    errors[fieldKey] = "";
  };

  // Form valid jika semua field terisi dan tidak ada error.
  const isFormValid = computed(
    () => form.email !== "" && form.password !== "" && errors.email === "" && errors.password === "",
  );

  // Handler input mengubah nilai form lalu memvalidasi field.
  const handleInput = (e: Event, key: string) => {
    const fieldKey = key as keyof typeof form;
    form[fieldKey] = (e.target as HTMLInputElement).value;
    validate(fieldKey);
  };

  // Handler blur menandai field sudah disentuh.
  const handleBlur = (key: string) => {
    const fieldKey = key as keyof typeof form;
    touched[fieldKey] = true;
    validate(fieldKey);
  };

  // Mengambil class input sesuai kondisi error.
  const getInputClass = (fieldKey: keyof typeof form) =>
    getFormInputClass(
      !!(errors[fieldKey] && touched[fieldKey]),
      "mt-1",
    );

  // Mengirim request login ke backend.
  const handleLogin = async () => {
    if (!isFormValid.value) return;
    error.value = "";
    isLoading.value = true;
    try {
      // Endpoint /masuk mengembalikan token dan data user.
      const response = await axios.post(`${API_URL}/masuk`, form);
      // Token disimpan agar request berikutnya terautentikasi.
      localStorage.setItem("token", response.data.access_token);
      // Data user disimpan untuk role, nama, dan navbar.
      localStorage.setItem("user", JSON.stringify(response.data.data));
      emit("close");
      // Redirect sesuai role user.
      router.push(getRedirectPathForRole(response.data.data?.role));
    } catch (err: any) {
      // Jika gagal, simpan log dan tampilkan pesan error.
      logError(err, "handleLogin");
      error.value = handleApiError(err);
    } finally {
      // Loading dimatikan baik berhasil maupun gagal.
      isLoading.value = false;
    }
  };

  // Nilai dan fungsi ini dipakai oleh komponen modal login.
  return {
    form,
    errors,
    touched,
    error,
    isLoading,
    isFormValid,
    handleInput,
    handleBlur,
    getInputClass,
    handleLogin,
  };
}
