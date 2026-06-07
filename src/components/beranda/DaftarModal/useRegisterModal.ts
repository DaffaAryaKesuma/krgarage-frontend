// computed untuk validasi, reactive untuk form, ref untuk state loading/error.
import { computed, reactive, ref } from "vue";
// Axios dipakai untuk request daftar akun.
import axios from "axios";
// Helper error agar pesan backend mudah ditampilkan.
import { handleApiError, logError } from "@/utils/errorHandler";
// Base URL API backend.
import { API_URL } from "@/utils/api";
// Helper class input form.
import { getFormInputClass } from "@/utils/formVariants";

// Field yang dipakai pada form daftar.
type RegisterFieldKey = "name" | "email" | "no_telepon" | "password";

// Konfigurasi satu field form daftar.
interface RegisterFieldConfig {
  key: RegisterFieldKey;
  label: string;
  type: string;
  placeholder: string;
  hint?: string;
}

// Daftar field dibuat array agar template bisa memakai v-for.
const FORM_FIELDS: RegisterFieldConfig[] = [
  {
    key: "name",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukkan nama lengkap",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "email@example.com",
  },
  {
    key: "no_telepon",
    label: "Nomor HP",
    type: "tel",
    placeholder: "081234567890",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Minimal 8 karakter",
    hint: "Harus 8+ karakter, huruf besar, huruf kecil, dan angka",
  },
];

// Aturan validasi untuk setiap field daftar.
const VALIDATION_RULES = {
  name: [
    { test: (val: string) => val.trim() !== "", msg: "Nama harus diisi" },
    { test: (val: string) => val.length >= 3, msg: "Minimal 3 karakter" },
  ],
  email: [
    { test: (val: string) => val.trim() !== "", msg: "Email harus diisi" },
    {
      test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      msg: "Format email tidak valid",
    },
  ],
  no_telepon: [
    { test: (val: string) => val.trim() !== "", msg: "Nomor HP harus diisi" },
    {
      test: (val: string) =>
        /^(08|\+628)[0-9]{8,13}$/.test(val.replace(/\s/g, "")),
      msg: "Format HP tidak valid",
    },
  ],
  password: [
    { test: (val: string) => val !== "", msg: "Password harus diisi" },
    { test: (val: string) => val.length >= 8, msg: "Minimal 8 karakter" },
    {
      test: (val: string) => /(?=.*[a-z])/.test(val),
      msg: "Butuh huruf kecil",
    },
    {
      test: (val: string) => /(?=.*[A-Z])/.test(val),
      msg: "Butuh huruf besar",
    },
    { test: (val: string) => /(?=.*\d)/.test(val), msg: "Butuh angka" },
  ],
};

// Composable khusus modal daftar akun.
export function useRegisterModal(onClose: () => void) {
  // State input form daftar.
  const form = reactive({
    name: "",
    email: "",
    no_telepon: "",
    password: "",
  });

  // Pesan error per field.
  const errors = reactive({
    name: "",
    email: "",
    no_telepon: "",
    password: "",
  });

  // Status field sudah disentuh atau belum.
  const touched = reactive({
    name: false,
    email: false,
    no_telepon: false,
    password: false,
  });

  // Error global dari backend.
  const error = ref("");
  // Pesan sukses setelah akun berhasil dibuat.
  const successMessage = ref("");
  // Loading tombol submit.
  const isLoading = ref(false);

  // Validasi satu field sesuai aturan VALIDATION_RULES.
  const validate = (fieldKey: RegisterFieldKey) => {
    const rules = VALIDATION_RULES[fieldKey] || [];
    const value = form[fieldKey];

    for (const rule of rules) {
      if (!rule.test(value)) {
        errors[fieldKey] = rule.msg;
        return;
      }
    }

    errors[fieldKey] = "";
  };

  // Form valid jika tidak ada field kosong dan tidak ada error.
  const isFormValid = computed(() => {
    const hasEmptyFields = Object.keys(form).some(
      (key) => form[key as RegisterFieldKey] === "",
    );

    const hasErrors = Object.values(errors).some((msg) => msg !== "");

    return !hasEmptyFields && !hasErrors;
  });

  // Handler input mengubah nilai field dan langsung memvalidasi.
  const handleInput = (event: Event, key: string) => {
    const val = (event.target as HTMLInputElement).value;
    const fieldKey = key as RegisterFieldKey;

    form[fieldKey] = val;
    validate(fieldKey);
  };

  // Handler blur menandai field sudah disentuh.
  const handleBlur = (key: string) => {
    const fieldKey = key as RegisterFieldKey;
    touched[fieldKey] = true;
    validate(fieldKey);
  };

  // Mengambil class input berdasarkan kondisi error.
  const getInputClass = (key: string) => {
    const fieldKey = key as RegisterFieldKey;
    return getFormInputClass(
      !!(errors[fieldKey] && touched[fieldKey]),
      "mt-1",
    );
  };

  // Reset seluruh isi form, touched, dan error field.
  const resetFormState = () => {
    (Object.keys(form) as RegisterFieldKey[]).forEach((key) => {
      form[key] = "";
      touched[key] = false;
      errors[key] = "";
    });
  };

  // Mengirim data daftar akun ke backend.
  const handleRegister = async () => {
    if (!isFormValid.value) return;

    error.value = "";
    successMessage.value = "";
    isLoading.value = true;

    try {
      // Backend memakai nama field "nama", bukan "name".
      const payload = {
        nama: form.name,
        email: form.email,
        no_telepon: form.no_telepon,
        password: form.password,
      };

      // Endpoint /daftar membuat akun pelanggan baru.
      const response = await axios.post(`${API_URL}/daftar`, payload);
      // Tampilkan pesan sukses dari backend atau fallback default.
      successMessage.value = response.data.message || "Registrasi berhasil!";

      // Setelah sukses, kosongkan form.
      resetFormState();

      // Tutup modal setelah beberapa detik agar user sempat membaca pesan sukses.
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      // Jika gagal, tampilkan pesan error dari API.
      logError(err, "handleRegister");
      error.value = handleApiError(err);
    } finally {
      // Matikan loading setelah request selesai.
      isLoading.value = false;
    }
  };

  // Nilai dan fungsi ini dipakai oleh komponen modal daftar.
  return {
    FORM_FIELDS,
    form,
    errors,
    touched,
    error,
    successMessage,
    isLoading,
    isFormValid,
    handleInput,
    handleBlur,
    getInputClass,
    handleRegister,
    resetFormState, // export resetFormState
  };
}
